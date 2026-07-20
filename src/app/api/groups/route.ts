import { requireUser } from "@/lib/api-auth";
import { db } from "@/lib/db";
import { groups, members, cycles } from "@/lib/db/schema";
import { eq, and, inArray, desc } from "drizzle-orm";

function generateInviteCode(): string {
  return "SAVE-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function GET(request: Request) {
  const user = await requireUser(request);
  if (user instanceof Response) return user;

  const url = new URL(request.url);
  const visibility = url.searchParams.get("visibility");
  const status = url.searchParams.get("status");
  const limit = Number.parseInt(url.searchParams.get("limit") ?? "20");

  const conditions = [];
  if (visibility) conditions.push(eq(groups.visibility, visibility));
  if (status) conditions.push(eq(groups.status, status));

  // If fetching "my groups", filter by user membership
  const myGroups = url.searchParams.get("my") === "true";
  if (myGroups) {
    const userGroups = await db
      .select({ groupId: members.groupId })
      .from(members)
      .where(eq(members.userId, user.id));
    const groupIds = userGroups.map((m) => m.groupId);
    if (groupIds.length > 0) {
      conditions.push(inArray(groups.id, groupIds));
    } else {
      return Response.json({ groups: [], total: 0 });
    }
  }

  const result = await db
    .select()
    .from(groups)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .limit(limit)
    .orderBy(desc(groups.createdAt));

  return Response.json({
    groups: result,
    total: result.length,
  });
}

export async function POST(request: Request) {
  const user = await requireUser(request);
  if (user instanceof Response) return user;

  try {
    const body = await request.json();
    const {
      name,
      description,
      savingType,
      visibility = "public",
      contributionAmount,
      contributionFrequency,
      maxMembers,
      targetAmount,
      totalCycles,
    } = body;

    if (!name || !savingType || !contributionAmount || !maxMembers || !totalCycles) {
      return Response.json(
        { error: "Missing required fields: name, savingType, contributionAmount, maxMembers, totalCycles" },
        { status: 400 },
      );
    }

    const inviteCode = generateInviteCode();

    const [group] = await db
      .insert(groups)
      .values({
        name,
        description,
        savingType,
        visibility,
        inviteCode,
        contributionAmount: contributionAmount.toString(),
        contributionFrequency,
        maxMembers,
        targetAmount: targetAmount?.toString(),
        totalCycles,
        adminUserId: user.id,
        poolBalance: "0",
      })
      .returning();

    await db.insert(members).values({
      groupId: group.id,
      userId: user.id,
      position: 1,
      totalContributed: "0",
      status: "active",
    });

    return Response.json({ group }, { status: 201 });
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }
}
