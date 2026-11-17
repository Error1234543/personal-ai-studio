import "server-only";

export function getAIProviderConfig() {
  const apiKey = process.env.AI_API_KEY;
  const baseUrl = process.env.AI_BASE_URL;
  const provider = process.env.AI_PROVIDER || "OpenAI-compatible";
  if (!apiKey || !baseUrl) throw new Error("AI_API_KEY and AI_BASE_URL must be configured in the hosting environment.");
  let parsed: URL;
  try { parsed = new URL(baseUrl); } catch { throw new Error("AI_BASE_URL is invalid."); }
  if (parsed.protocol !== "https:" && process.env.NODE_ENV === "production") {
    throw new Error("AI_BASE_URL must use HTTPS in production.");
  }
  return { apiKey, baseUrl: baseUrl.replace(/\/+$/, ""), provider };
}
