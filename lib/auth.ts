import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "wrenyn_admin";
const MAX_AGE = 60 * 60 * 12;

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/admin",
  maxAge: MAX_AGE,
};

function credentials() {
  const secret = process.env.ADMIN_SECRET;
  const password = process.env.ADMIN_PASSWORD;
  return secret && password ? { secret, password } : null;
}

function sha256(v: string) {
  return createHash("sha256").update(v).digest();
}

function safeEqual(a: string, b: string) {
  return timingSafeEqual(sha256(a), sha256(b));
}

// Signing key is derived from the credentials, so rotating either env value logs out every session.
function sign(payload: string) {
  const c = credentials();
  if (!c) return null;
  return createHmac("sha256", sha256(`${c.secret}\0${c.password}`)).update(payload).digest("base64url");
}

export function adminConfigured() {
  return credentials() !== null;
}

export function checkCredentials(secret: string, password: string) {
  const c = credentials();
  if (!c) return false;
  const secretOk = safeEqual(secret, c.secret);
  const passwordOk = safeEqual(password, c.password);
  return secretOk && passwordOk;
}

export function createSessionToken() {
  const exp = String(Math.floor(Date.now() / 1000) + MAX_AGE);
  return `${exp}.${sign(exp)}`;
}

function verifySessionToken(token: string | undefined) {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  const expected = exp && sign(exp);
  if (!expected || !sig || !safeEqual(sig, expected)) return false;
  return Number(exp) > Date.now() / 1000;
}

export async function isAdmin() {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}
