import { requireUser } from "@/lib/api-auth";
import { db } from "@/lib/db";
import { groups, members, contributions, cycles } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireUser(request);
  if (user instanceof Response) return user;

  const { id } = await params;

  const [group] = await db.select().from(groups).where(eq(groups.id, id)).limit(1);
  if (!group) {
    return Response.json({ error: "Group not found" }, { status: 404 });
  }

  const groupMembers = await db
    .select()
    .from(members)
    .where(and(eq(members.groupId, id), eq(members.status, "active")))
    .orderBy(members.position);

  const groupContributions = await db
    .select()
    .from(contributions)
    .where(eq(contributions.groupId, id))
    .orderBy(desc(contributions.createdAt))
    .limit(50);

  const groupCycles = await db
    .select()
    .from(cycles)
    .where(eq(cycles.groupId, id))
    .orderBy(cycles.cycleNumber);

  return Response.json({ group, members: groupMembers, contributions: groupContributions, cycles: groupCycles });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireUser(request);
  if (user instanceof Response) return user;

  const { id } = await params;

  const [group] = await db.select().from(groups).where(eq(groups.id, id)).limit(1);
  if (!group) return Response.json({ error: "Group not found" }, { status: 404 });
  if (group.adminUserId !== user.id) {
    return Response.json({ error: "Only the admin can update the group" }, { status: 403 });
  }

  const body = await request.json();
  const allowed = ["name", "description", "visibility", "maxMembers", "targetAmount"];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (body[key] !== undefined) updates[key] = body[key];
  }

  if (Object.keys(updates).length === 0) {
    return Response.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const [updated] = await db.update(groups).set(updates).where(eq(groups.id, id)).returning();
  return Response.json({ group: updated });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireUser(request);
  if (user instanceof Response) return user;

  const { id } = await params;

  const [group] = await db.select().from(groups).where(eq(groups.id, id)).limit(1);
  if (!group) return Response.json({ error: "Group not found" }, { status: 404 });
  if (group.adminUserId !== user.id) {
    return Response.json({ error: "Only the admin can cancel the group" }, { status: 403 });
  }

  const [updated] = await db
    .update(groups)
    .set({ status: "cancelled" })
    .where(eq(groups.id, id))
    .returning();

  return Response.json({ group: updated });
}
