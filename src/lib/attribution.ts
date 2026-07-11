import { toDataSuffix, verifyTx } from "@celo/attribution-tags";
import type { Hash } from "viem";

const TAG = process.env.ATTRIBUTION_TAG ?? "";

export function getAttributionSuffix() {
  if (!TAG) return undefined;
  return toDataSuffix(TAG);
}

export function getAttributionSuffixMulti(existingCodes: string[]) {
  const codes = TAG ? [...existingCodes, TAG] : existingCodes;
  return toDataSuffix(codes);
}

export async function checkTxHasTag(txHash: Hash): Promise<boolean> {
  if (!TAG) return false;
  const decoded = await verifyTx(txHash);
  return decoded.codes.includes(TAG);
}
