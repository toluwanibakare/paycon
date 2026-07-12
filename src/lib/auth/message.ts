export function buildSignInMessage(address: string, nonce: string): string {
  return `Welcome to Paycon

Sign this message to verify your wallet and access your dashboard.

Address: ${address}
Nonce: ${nonce}

This request will not trigger a blockchain transaction or cost any gas fees.`;
}
