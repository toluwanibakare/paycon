const N8N_API_KEY = process.env.N8N_API_KEY ?? "";

export function isAuthenticated(request: Request): boolean {
  const apiKey = request.headers.get("x-api-key");
  return apiKey === N8N_API_KEY;
}

export function requireAuth(request: Request): Response | null {
  if (!isAuthenticated(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
