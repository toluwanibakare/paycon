import { requireAuth } from "@/lib/api-auth";

export async function GET(request: Request) {
  const authError = requireAuth(request);
  if (authError) return authError;

  // TODO: query DB for contributions due today
  return Response.json({
    dueContributions: [],
  });
}
