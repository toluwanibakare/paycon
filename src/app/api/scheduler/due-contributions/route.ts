import { requireAuth } from "@/lib/api-auth";
import { db } from "@/lib/db";
import { groups, members } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: Request) {
  const authError = requireAuth(request);
  if (authError) return authError;

  const now = new Date();
  const dueGroups = await db
    .select()
    .from(groups)
    .where(and(eq(groups.status, "active"), eq(groups.currentCycle, 1)));

  const dueContributions = [];

  for (const group of dueGroups) {
    const activeMembers = await db
      .select()
      .from(members)
      .where(and(eq(members.groupId, group.id), eq(members.status, "active")));

    for (const member of activeMembers) {
      dueContributions.push({
        memberId: member.id,
        userId: member.userId,
        groupId: group.id,
        groupName: group.name,
        amount: group.contributionAmount,
        cycleNumber: group.currentCycle,
        dueDate: now.toISOString(),
      });
    }
  }

  return Response.json({
    dueContributions,
    total: dueContributions.length,
  });
}
