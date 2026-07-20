import { getSessionCookie } from "@/lib/auth/cookies";
import { getSession } from "@/lib/auth/store";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const N8N_API_KEY = process.env.N8N_API_KEY ?? "";

export function isAuthenticated(request: Request): boolean {
  const apiKey = request.headers.get("x-api-key");
  return apiKey === N8N_API_KEY;
}

export function requireAuth(request: Request): Response | null {
  if (!isAuthenticated(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function getCurrentUser(): Promise<{ id: string; address: string } | null> {
  const token = await getSessionCookie();
  if (!token) return null;
  return getSession(token);
}

export async function requireUser(request: Request): Promise<{ id: string; address: string } | Response> {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 }) as Response;
  }
  return user;
}

export async function getOrCreateUser(address: string) {
  const normalized = address.toLowerCase();
  const existing = await db.select().from(users).where(eq(users.walletAddress, normalized)).limit(1);
  if (existing.length > 0) return existing[0];

  const [created] = await db.insert(users).values({
    name: normalized.slice(0, 10),
    email: `${normalized.slice(2, 10)}@paycon.app`,
    walletAddress: normalized,
  }).returning();
  return created;
}
