import "server-only";
import postgres from "postgres";

export type Signup = { id: string; email: string; created_at: string };

// Cached on globalThis so dev hot reloads reuse one pool instead of opening new connections.
const cache = globalThis as unknown as { sql?: postgres.Sql; schema?: Promise<void>; downUntil?: number };

// After a connection failure, fail instantly for a few seconds instead of piling up requests that each wait to time out.
const BREAKER_MS = 5000;
const CONNECTION_ERROR = /^(CONNECT_TIMEOUT|CONNECTION_|ECONN|ENOTFOUND|ETIMEDOUT|EAI_AGAIN|EHOSTUNREACH|ENETUNREACH)/;

const SCHEMA = [
  `create table if not exists waitlist (
     id bigint generated always as identity primary key,
     email text not null unique,
     created_at timestamptz not null default now()
   )`,
  `create table if not exists site_stats (
     id smallint primary key check (id = 1),
     viewers bigint not null default 0
   )`,
  `create table if not exists rate_limits (
     key text primary key,
     hits integer not null,
     reset_at timestamptz not null
   )`,
  // Keeps Supabase's public API from exposing these tables; this connection owns them, so it's unaffected.
  `alter table waitlist enable row level security`,
  `alter table site_stats enable row level security`,
  `alter table rate_limits enable row level security`,
];

function client() {
  if (cache.sql) return cache.sql;
  // Dashboards often keep pasted quotes or a "DATABASE_URL=" prefix in the value.
  const url = (process.env.DATABASE_URL ?? "")
    .trim()
    .replace(/^DATABASE_URL\s*=\s*/, "")
    .replace(/^(["'])(.*)\1$/, "$2")
    .trim();
  if (!url) throw new Error("DATABASE_URL must be set");
  if (!/^postgres(ql)?:\/\/[^@\s]+@[^/\s]+\//.test(url)) {
    throw new Error(
      `DATABASE_URL is not a valid postgres connection string (starts with "${url.slice(0, 14)}…", length ${url.length})`,
    );
  }
  const local = /@(localhost|127\.0\.0\.1)[:/]/.test(url);
  // prepare:false keeps it compatible with Supabase's transaction pooler (port 6543).
  cache.sql = postgres(url, {
    prepare: false,
    max: 5,
    idle_timeout: 20,
    connect_timeout: 5,
    ssl: local ? false : "require",
    // Silences "already exists, skipping" notices from the create-if-not-exists schema setup.
    onnotice: () => {},
  });
  return cache.sql;
}

async function connect() {
  const sql = client();
  cache.schema ??= (async () => {
    for (const stmt of SCHEMA) await sql.unsafe(stmt);
  })().catch((e) => {
    cache.schema = undefined;
    throw e;
  });
  await cache.schema;
  return sql;
}

async function query<T>(run: (sql: postgres.Sql) => Promise<T>): Promise<T> {
  if (cache.downUntil && Date.now() < cache.downUntil) throw new Error("Database unavailable (recent connection failure)");
  try {
    return await run(await connect());
  } catch (e) {
    const code = (e as { code?: unknown })?.code;
    if (typeof code === "string" && CONNECTION_ERROR.test(code)) cache.downUntil = Date.now() + BREAKER_MS;
    throw e;
  }
}

export async function addSignup(email: string) {
  await query((sql) => sql`insert into waitlist (email) values (${email}) on conflict (email) do nothing`);
}

// Fixed-window counter: the first hit opens a window of `windowSeconds`, later hits in it add up.
export async function hitRateLimit(key: string, windowSeconds: number): Promise<{ hits: number; resetIn: number }> {
  return query(async (sql) => {
    const [row] = await sql`
      insert into rate_limits (key, hits, reset_at)
      values (${key}, 1, now() + ${windowSeconds}::int * interval '1 second')
      on conflict (key) do update set
        hits = case when rate_limits.reset_at <= now() then 1 else rate_limits.hits + 1 end,
        reset_at = case when rate_limits.reset_at <= now() then excluded.reset_at else rate_limits.reset_at end
      returning hits, ceil(extract(epoch from reset_at - now()))::int as reset_in`;
    if (Math.random() < 0.05) sql`delete from rate_limits where reset_at < now()`.catch(() => {});
    return { hits: Number(row.hits), resetIn: Math.max(1, Number(row.reset_in)) };
  });
}

export async function peekRateLimit(key: string): Promise<{ hits: number; resetIn: number }> {
  return query(async (sql) => {
    const [row] = await sql`
      select hits, ceil(extract(epoch from reset_at - now()))::int as reset_in
      from rate_limits where key = ${key} and reset_at > now()`;
    return row ? { hits: Number(row.hits), resetIn: Math.max(1, Number(row.reset_in)) } : { hits: 0, resetIn: 0 };
  });
}

export async function clearRateLimit(key: string) {
  await query((sql) => sql`delete from rate_limits where key = ${key}`);
}

export async function incrementViewers(): Promise<number> {
  return query(async (sql) => {
    const [row] = await sql`
      insert into site_stats (id, viewers) values (1, 1)
      on conflict (id) do update set viewers = site_stats.viewers + 1
      returning viewers`;
    return Number(row.viewers);
  });
}

export async function getViewers(): Promise<number> {
  return query(async (sql) => {
    const [row] = await sql`select viewers from site_stats where id = 1`;
    return Number(row?.viewers ?? 0);
  });
}

export async function getSignups(): Promise<Signup[]> {
  return query(async (sql) => {
    const rows = await sql<{ id: string; email: string; created_at: Date }[]>`
      select id, email, created_at from waitlist order by created_at desc`;
    return rows.map((r) => ({ id: String(r.id), email: r.email, created_at: r.created_at.toISOString() }));
  });
}

