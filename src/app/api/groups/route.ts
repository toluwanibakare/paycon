import { requireAuth } from "@/lib/api-auth";

export async function GET(request: Request) {
  const authError = requireAuth(request);
  if (authError) return authError;

  const url = new URL(request.url);
  const visibility = url.searchParams.get("visibility");
  const status = url.searchParams.get("status");
  const limit = url.searchParams.get("limit") ?? "20";

  // TODO: query DB with filters
  return Response.json({
    groups: [],
    total: 0,
  });
}

export async function POST(request: Request) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const {
      name,
      description,
      savingType,
      visibility,
      contributionAmount,
      contributionFrequency,
      maxMembers,
      targetAmount,
      totalCycles,
      adminUserId,
    } = body;

    if (!name || !savingType || !contributionAmount || !maxMembers || !totalCycles || !adminUserId) {
      return Response.json(
        { error: "Missing required fields: name, savingType, contributionAmount, maxMembers, totalCycles, adminUserId" },
        { status: 400 },
      );
    }

    // TODO: create group in DB, generate invite code, create pool wallet
    return Response.json({
      group: {
        id: crypto.randomUUID(),
        name,
        savingType,
        inviteCode: "SAVE-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        status: "active",
      },
    });
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }
}
