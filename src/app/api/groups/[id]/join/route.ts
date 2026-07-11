import { requireAuth } from "@/lib/api-auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = requireAuth(request);
  if (authError) return authError;

  const { id } = await params;
  const body = await request.json();
  const { userId } = body;

  if (!userId) {
    return Response.json({ error: "Missing userId" }, { status: 400 });
  }

  // TODO: add member to group
  return Response.json({
    member: {
      id: crypto.randomUUID(),
      groupId: id,
      userId,
      status: "active",
    },
  });
}
