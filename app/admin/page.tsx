import type { Metadata } from "next";
import Image from "next/image";
import { adminConfigured, isAdmin } from "@/lib/auth";
import { getSignups, getViewers, type Signup } from "@/lib/db";
import { logout } from "./actions";
import LoginForm from "./LoginForm";
import SignupTable from "./SignupTable";
import "./admin.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin – Wrenyn", robots: { index: false, follow: false } };

function Brand() {
  return (
    <a className="brand" href="/">
      <Image src="/wrenyn-logo.png" width={40} height={35} alt="" />
      <span>wrenyn</span>
    </a>
  );
}

export default async function AdminPage() {
  if (!(await isAdmin())) {
    return (
      <div className="admin center">
        <Brand />
        {adminConfigured() ? (
          <LoginForm />
        ) : (
          <div className="card login">
            <h1>Admin</h1>
            <p className="muted">Admin login isn’t configured. Set <code>ADMIN_SECRET</code> and <code>ADMIN_PASSWORD</code> in the environment, then restart the server.</p>
          </div>
        )}
      </div>
    );
  }

  let viewers = 0;
  let rows: Signup[] = [];
  let loadError = "";
  try {
    [viewers, rows] = await Promise.all([getViewers(), getSignups()]);
  } catch (e) {
    console.error("admin data load failed", e);
    loadError = e instanceof Error ? e.message : "Unknown database error";
  }
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const lastWeek = rows.filter((r) => new Date(r.created_at).getTime() >= weekAgo).length;

  return (
    <div className="admin">
      <header className="admin-bar">
        <Brand />
        <form action={logout}>
          <button className="btn ghost-light" type="submit">Sign out</button>
        </form>
      </header>

      {loadError && (
        <p className="alert">Couldn’t load data from the database: {loadError}. Check <code>DATABASE_URL</code> in the environment.</p>
      )}

      <div className="stats">
        <div className="stat"><span>Viewers</span><b>{viewers.toLocaleString("en-US")}</b></div>
        <div className="stat"><span>Waitlist signups</span><b>{rows.length.toLocaleString("en-US")}</b></div>
        <div className="stat"><span>Signups, last 7 days</span><b>{lastWeek.toLocaleString("en-US")}</b></div>
      </div>

      <SignupTable rows={rows} />
    </div>
  );
}
