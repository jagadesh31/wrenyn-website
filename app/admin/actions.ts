"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, adminConfigured, checkCredentials, createSessionToken, sessionCookieOptions } from "@/lib/auth";

export type LoginState = { error: string };

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;
const failures = new Map<string, number[]>();

function recentFailures(ip: string) {
  const now = Date.now();
  const list = (failures.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  failures.set(ip, list);
  return list;
}

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  if (!adminConfigured()) return { error: "Admin login isn’t configured. Set ADMIN_SECRET and ADMIN_PASSWORD." };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "local";
  if (recentFailures(ip).length >= MAX_FAILURES) return { error: "Too many attempts. Try again in 15 minutes." };

  const secret = String(form.get("secret") ?? "");
  const password = String(form.get("password") ?? "");
  if (!checkCredentials(secret, password)) {
    recentFailures(ip).push(Date.now());
    await new Promise((r) => setTimeout(r, 700));
    return { error: "Incorrect secret or password." };
  }

  failures.delete(ip);
  (await cookies()).set(SESSION_COOKIE, createSessionToken(), sessionCookieOptions);
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete({ name: SESSION_COOKIE, path: sessionCookieOptions.path });
  redirect("/admin");
}
