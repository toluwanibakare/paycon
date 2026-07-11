import { createPublicClient, createWalletClient, http } from "viem";
import { celo } from "viem/chains";

const RPC_URL = process.env.CELO_RPC_URL ?? "https://forno.celo.org";

export const publicClient = createPublicClient({
  chain: celo,
  transport: http(RPC_URL),
});

export function getWalletClient(privateKey: `0x${string}`) {
  return createWalletClient({
    chain: celo,
    transport: http(RPC_URL),
    account: privateKey,
  });
}

export const USDM_ADDRESS = "0x61E44b892F6663C9481350d0cA28cDe4EdE26f01";

export const ERC20_ABI = [
  {
    type: "function",
    name: "transfer",
    inputs: [
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "decimals",
    inputs: [],
    outputs: [{ type: "uint8" }],
    stateMutability: "view",
  },
] as const;
