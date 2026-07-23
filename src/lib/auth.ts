import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "bm_lojista_session";

const SESSION_DURATION_SECONDS = 60 * 60 * 8;

function getSecret() {
  return process.env.SESSION_SECRET || "bm-vitrine-local-development-secret";
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

export function validateCredentials(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL || "lojista@bm.com.br";
  const adminPassword = process.env.ADMIN_PASSWORD || "bm123456";

  return email === adminEmail && password === adminPassword;
}

export function createSessionToken(email: string) {
  const payload = Buffer.from(
    JSON.stringify({
      email,
      expiresAt: Date.now() + SESSION_DURATION_SECONDS * 1000
    })
  ).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token?: string) {
  if (!token) {
    return false;
  }

  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return false;
  }

  const expected = sign(payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return false;
  }

  try {
    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as { email: string; expiresAt: number };

    return Boolean(session.email) && session.expiresAt > Date.now();
  } catch {
    return false;
  }
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export const sessionMaxAge = SESSION_DURATION_SECONDS;
