// Attribution tags (ERC-8021) for hackathon leaderboard tracking.
// Install @celo/attribution-tags when ready:
//   npm install @celo/attribution-tags

const TAG = process.env.ATTRIBUTION_TAG ?? "";

// Placeholder — will use real SDK after install
export function getAttributionSuffix(): `0x${string}` | undefined {
  if (!TAG) return undefined;
  // TODO: replace with toDataSuffix from @celo/attribution-tags
  return undefined;
}

export function getAttributionSuffixMulti(_existingCodes: string[]): `0x${string}` | undefined {
  if (!TAG) return undefined;
  // TODO: replace with toDataSuffix from @celo/attribution-tags
  return undefined;
}
