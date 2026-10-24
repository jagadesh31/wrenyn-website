"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, { error: "" });

  return (
    <form className="card login" action={action}>
      <h1>Admin</h1>
      <p className="muted">Sign in with the admin secret and password.</p>
      <label htmlFor="secret">Secret</label>
      <input id="secret" name="secret" type="password" autoComplete="off" required autoFocus />
      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" autoComplete="current-password" required />
      <p className="err" role="alert">{state.error}</p>
      <button className="btn solid" type="submit" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
