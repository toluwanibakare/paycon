import { requireUser } from "@/lib/api-auth";
import { db } from "@/lib/db";
import { members, contributions, groups } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireUser(request);
  if (user instanceof Response) return user;

  const { id } = await params;

  const [group] = await db.select().from(groups).where(eq(groups.id, id)).limit(1);
  if (!group) return Response.json({ error: "Group not found" }, { status: 404 });

  const [member] = await db
    .select()
    .from(members)
    .where(and(eq(members.groupId, id), eq(members.userId, user.id)))
    .limit(1);

  if (!member) return Response.json({ error: "Not a member of this group" }, { status: 403 });

  const body = await request.json();
  const { txHash } = body;
  const amount = body.amount ?? group.contributionAmount;

  const [contribution] = await db
    .insert(contributions)
    .values({
      groupId: id,
      memberId: member.id,
      amount: amount.toString(),
      token: "USDm",
      txHash,
      cycleNumber: group.currentCycle,
      status: txHash ? "confirmed" : "pending",
    })
    .returning();

  if (txHash) {
    await db
      .update(members)
      .set({
        totalContributed: (
          Number.parseFloat(member.totalContributed) + Number.parseFloat(amount.toString())
        ).toString(),
      })
      .where(eq(members.id, member.id));

    await db
      .update(groups)
      .set({
        poolBalance: (
          Number.parseFloat(group.poolBalance) + Number.parseFloat(amount.toString())
        ).toString(),
      })
      .where(eq(groups.id, id));
  }

  return Response.json({ contribution }, { status: 201 });
}
