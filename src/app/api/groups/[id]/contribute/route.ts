import { requireAuth } from "@/lib/api-auth";
import { publicClient, getWalletClient, USDM_ADDRESS, ERC20_ABI } from "@/lib/wallet";
import { getAttributionSuffix } from "@/lib/attribution";
import { parseUnits } from "viem";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = requireAuth(request);
  if (authError) return authError;

  const { id } = await params;
  const body = await request.json();
  const { userId, amount, privateKey } = body;

  if (!userId || !amount || !privateKey) {
    return Response.json(
      { error: "Missing userId, amount, or privateKey" },
      { status: 400 },
    );
  }

  try {
    const walletClient = getWalletClient(privateKey as `0x${string}`);
    const decimals = await publicClient.readContract({
      address: USDM_ADDRESS,
      abi: ERC20_ABI,
      functionName: "decimals",
    });

    const attributionData = getAttributionSuffix();
    const tx = await walletClient.writeContract({
      address: USDM_ADDRESS,
      abi: ERC20_ABI,
      functionName: "transfer",
      args: [body.to as `0x${string}`, parseUnits(amount, decimals)],
      dataSuffix: attributionData,
    });

    // TODO: record contribution in DB

    return Response.json({
      contribution: {
        txHash: tx,
        amount,
        token: "USDm",
        status: "confirmed",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Transaction failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
