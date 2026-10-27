"use client";

import { useActionState, useEffect, useRef } from "react";
import { mountTurnstile, type Challenge } from "../components/turnstile";
import { login, type LoginState } from "./actions";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function LoginForm() {
  const captchaBox = useRef<HTMLDivElement>(null);
  const challenge = useRef<Challenge | null>(null);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    const c = mountTurnstile(captchaBox.current!, TURNSTILE_SITE_KEY, "admin-login");
    challenge.current = c;
    return () => {
      c.remove();
      challenge.current = null;
    };
  }, []);

  const [state, action, pending] = useActionState<LoginState, FormData>(async (prev, form) => {
    const c = challenge.current;
    if (c) {
      try {
        form.set("cf-turnstile-response", await c.token());
      } catch {
        return { error: "Couldn’t verify you’re human. Please try again." };
      }
    }
    // A successful login redirects, so getting a result back means this attempt failed and used up the token.
    const result = await login(prev, form);
    c?.consume();
    return result;
  }, { error: "" });

  return (
    <form className="card login" action={action}>
      <h1>Admin</h1>
      <p className="muted">Sign in with the admin secret and password.</p>
      <label htmlFor="secret">Secret</label>
      <input id="secret" name="secret" type="password" autoComplete="off" required autoFocus />
      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" autoComplete="current-password" required />
      <p className="err" role="alert">{state.error}</p>
      <div className="captcha" ref={captchaBox} />
      <button className="btn solid" type="submit" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
