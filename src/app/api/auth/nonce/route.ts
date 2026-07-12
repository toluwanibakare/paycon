import { createNonce } from "@/lib/auth/store";

export async function POST(request: Request) {
  try {
    const { address } = await request.json();
    if (!address || typeof address !== "string") {
      return Response.json({ error: "Address is required" }, { status: 400 });
    }

    const nonce = createNonce(address);
    return Response.json({ nonce });
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}
