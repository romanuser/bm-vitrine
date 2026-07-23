import { NextRequest, NextResponse } from "next/server";
import {
  createSessionToken,
  SESSION_COOKIE,
  sessionMaxAge,
  validateCredentials
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  if (!validateCredentials(email, password)) {
    return NextResponse.json(
      { message: "E-mail ou senha incorretos." },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ authenticated: true });
  response.cookies.set(SESSION_COOKIE, createSessionToken(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionMaxAge
  });

  return response;
}
