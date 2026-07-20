import { createSession } from "@/lib/auth/store";
import { setSessionCookie } from "@/lib/auth/cookies";
import { getOrCreateUser } from "@/lib/api-auth";

export async function POST(request: Request) {
  try {
    const { address } = await request.json();
    if (!address || typeof address !== "string") {
      return Response.json({ error: "Address is required" }, { status: 400 });
    }

    const normalized = address.toLowerCase();
    const dbUser = await getOrCreateUser(normalized);
    const token = createSession(dbUser.id, normalized);
    await setSessionCookie(token);

    return Response.json({ token, address: normalized, userId: dbUser.id });
  } catch {
    return Response.json({ error: "Verification failed" }, { status: 400 });
  }
}
