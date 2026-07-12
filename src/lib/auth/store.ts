const nonceStore = new Map<string, { nonce: string; exp: number }>();
const sessionStore = new Map<string, { userId: string; address: string; exp: number }>();

export function createNonce(address: string): string {
  const nonce = crypto.randomUUID();
  nonceStore.set(address.toLowerCase(), {
    nonce,
    exp: Date.now() + 5 * 60 * 1000,
  });
  return nonce;
}

export function verifyAndConsumeNonce(address: string, nonce: string): boolean {
  const entry = nonceStore.get(address.toLowerCase());
  if (!entry) return false;
  nonceStore.delete(address.toLowerCase());
  if (Date.now() > entry.exp) return false;
  return entry.nonce === nonce;
}

export function createSession(userId: string, address: string): string {
  const token = crypto.randomUUID();
  sessionStore.set(token, {
    userId,
    address: address.toLowerCase(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });
  return token;
}

export function getSession(token: string) {
  const session = sessionStore.get(token);
  if (!session) return null;
  if (Date.now() > session.exp) {
    sessionStore.delete(token);
    return null;
  }
  return session;
}

export function deleteSession(token: string) {
  sessionStore.delete(token);
}
