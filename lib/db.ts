import "server-only";
import postgres from "postgres";

export type Signup = { id: string; email: string; created_at: string };

// Cached on globalThis so dev hot reloads reuse one pool instead of opening new connections.
const cache = globalThis as unknown as { sql?: postgres.Sql; schema?: Promise<void> };

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
  // Keeps Supabase's public API from exposing these tables; this connection owns them, so it's unaffected.
  `alter table waitlist enable row level security`,
  `alter table site_stats enable row level security`,
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
  cache.sql = postgres(url, { prepare: false, max: 5, idle_timeout: 20, ssl: local ? false : "require" });
  return cache.sql;
}

async function db() {
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

export async function addSignup(email: string) {
  const sql = await db();
  await sql`insert into waitlist (email) values (${email}) on conflict (email) do nothing`;
}

export async function incrementViewers(): Promise<number> {
  const sql = await db();
  const [row] = await sql`
    insert into site_stats (id, viewers) values (1, 1)
    on conflict (id) do update set viewers = site_stats.viewers + 1
    returning viewers`;
  return Number(row.viewers);
}

export async function getViewers(): Promise<number> {
  const sql = await db();
  const [row] = await sql`select viewers from site_stats where id = 1`;
  return Number(row?.viewers ?? 0);
}

export async function getSignups(): Promise<Signup[]> {
  const sql = await db();
  const rows = await sql<{ id: string; email: string; created_at: Date }[]>`
    select id, email, created_at from waitlist order by created_at desc`;
  return rows.map((r) => ({ id: String(r.id), email: r.email, created_at: r.created_at.toISOString() }));
}
