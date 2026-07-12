import { getSessionCookie } from "@/lib/auth/cookies";
import { getSession } from "@/lib/auth/store";

export async function GET() {
  const token = await getSessionCookie();
  if (!token) {
    return Response.json({ user: null }, { status: 401 });
  }

  const session = getSession(token);
  if (!session) {
    return Response.json({ user: null }, { status: 401 });
  }

  return Response.json({
    user: {
      id: session.userId,
      address: session.address,
    },
  });
}

export async function DELETE() {
  const { removeSessionCookie } = await import("@/lib/auth/cookies");
  await removeSessionCookie();
  return Response.json({ success: true });
}
