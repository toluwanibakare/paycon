import { createSession, verifyAndConsumeNonce } from "@/lib/auth/store";
import { setSessionCookie } from "@/lib/auth/cookies";
import { buildSignInMessage } from "@/lib/auth/message";
import { publicClient } from "@/lib/wallet";
import { recoverMessageAddress } from "viem";

export async function POST(request: Request) {
  try {
    const { address, signature, nonce } = await request.json();
    if (!address || !signature || !nonce) {
      return Response.json({ error: "Address, signature, and nonce required" }, { status: 400 });
    }

    if (!verifyAndConsumeNonce(address, nonce)) {
      return Response.json({ error: "Invalid or expired nonce" }, { status: 401 });
    }

    const message = buildSignInMessage(address, nonce);
    const recovered = await recoverMessageAddress({
      message,
      signature,
    });

    if (recovered.toLowerCase() !== address.toLowerCase()) {
      return Response.json({ error: "Signature does not match address" }, { status: 401 });
    }

    const token = createSession(address.toLowerCase(), address);
    await setSessionCookie(token);

    return Response.json({ token, address });
  } catch {
    return Response.json({ error: "Verification failed" }, { status: 400 });
  }
}
