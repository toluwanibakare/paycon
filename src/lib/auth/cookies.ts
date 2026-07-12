import { cookies } from "next/headers";

const SESSION_COOKIE = "paycon_session";

export async function setSessionCookie(token: string) {
  const c = await cookies();
  c.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function getSessionCookie(): Promise<string | null> {
  const c = await cookies();
  return c.get(SESSION_COOKIE)?.value ?? null;
}

export async function removeSessionCookie() {
  const c = await cookies();
  c.delete(SESSION_COOKIE);
}
