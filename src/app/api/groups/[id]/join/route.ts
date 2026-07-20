import { requireUser } from "@/lib/api-auth";
import { db } from "@/lib/db";
import { groups, members } from "@/lib/db/schema";
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
  if (group.status !== "active") return Response.json({ error: "Group is not active" }, { status: 400 });

  const existingMember = await db
    .select()
    .from(members)
    .where(and(eq(members.groupId, id), eq(members.userId, user.id)))
    .limit(1);

  if (existingMember.length > 0) {
    return Response.json({ error: "Already a member" }, { status: 409 });
  }

  const activeMembers = await db
    .select()
    .from(members)
    .where(and(eq(members.groupId, id), eq(members.status, "active")));

  if (activeMembers.length >= group.maxMembers) {
    return Response.json({ error: "Group is full" }, { status: 400 });
  }

  const nextPosition = activeMembers.length + 1;

  const [member] = await db
    .insert(members)
    .values({
      groupId: id,
      userId: user.id,
      position: nextPosition,
      totalContributed: "0",
      status: "active",
    })
    .returning();

  return Response.json({ member }, { status: 201 });
}
