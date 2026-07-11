import { createWalletClient, http } from "viem";
import { celo } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const AGENT_WALLET_PRIVATE_KEY = process.env.AGENT_WALLET_PRIVATE_KEY as `0x${string}`;
const AGENT_NAME = "Paycon Group Savings Agent";
const AGENT_DESCRIPTION = "AI agent for group savings (Ajo/Esusu) on Celo";

async function main() {
  if (!AGENT_WALLET_PRIVATE_KEY) {
    console.error("Missing AGENT_WALLET_PRIVATE_KEY in environment");
    process.exit(1);
  }

  const account = privateKeyToAccount(AGENT_WALLET_PRIVATE_KEY);
  const walletClient = createWalletClient({
    account,
    chain: celo,
    transport: http("https://forno.celo.org"),
  });

  console.log(`Registering agent: ${AGENT_NAME}`);
  console.log(`From wallet: ${account.address}`);

  // ERC-8004 Agent Registration
  // https://github.com/celo-org/ERC-8004
  const ERC8004_REGISTRY = "0x8004a169fb4a3325136eb29fa0ceb6d2e539a432";

  const hash = await walletClient.writeContract({
    address: ERC8004_REGISTRY as `0x${string}`,
    abi: [
      {
        type: "function",
        name: "registerAgent",
        inputs: [
          { name: "name", type: "string" },
          { name: "description", type: "string" },
          { name: "agentUrl", type: "string" },
        ],
        outputs: [{ name: "agentId", type: "uint256" }],
        stateMutability: "nonpayable",
      },
    ] as const,
    functionName: "registerAgent",
    args: [AGENT_NAME, AGENT_DESCRIPTION, "https://paycon.vercel.app"],
  });

  console.log(`Registration tx sent: ${hash}`);
  console.log(`View on Celoscan: https://celoscan.io/tx/${hash}`);
}

main().catch(console.error);
