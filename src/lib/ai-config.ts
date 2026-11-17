import "server-only";
import { createDecipheriv, createCipheriv, randomBytes } from "node:crypto";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
function serviceClient() {
  if (!url || !serviceKey) throw new Error("Missing server Supabase service configuration.");
  return createSupabaseClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
}
function encryptionKey() {
  const value = process.env.AI_CONFIG_ENCRYPTION_KEY;
  if (!value) throw new Error("AI_CONFIG_ENCRYPTION_KEY is not configured.");
  const key = Buffer.from(value, "base64");
  if (key.length !== 32) throw new Error("AI_CONFIG_ENCRYPTION_KEY must be a base64-encoded 32-byte key.");
  return key;
}
export function encryptApiKey(plain: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return [iv.toString("base64"), cipher.getAuthTag().toString("base64"), encrypted.toString("base64")].join(".");
}
function decryptApiKey(value: string) {
  const [iv, tag, data] = value.split(".");
  if (!iv || !tag || !data) throw new Error("Stored AI credential is invalid.");
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(iv, "base64"));
  decipher.setAuthTag(Buffer.from(tag, "base64"));
  return Buffer.concat([decipher.update(Buffer.from(data, "base64")), decipher.final()]).toString("utf8");
}
export async function saveAISettings(input: { provider: string; baseUrl: string; model: string; apiKey: string }) {
  const supabase = serviceClient();
  const payload = {
    id: 1, provider: input.provider, base_url: input.baseUrl, model: input.model,
    encrypted_api_key: encryptApiKey(input.apiKey), updated_at: new Date().toISOString(),
  };
  const { error } = await supabase.from("ai_provider_settings").upsert(payload, { onConflict: "id" });
  if (error) throw new Error("AI settings could not be saved.");
}
export async function readAISettings() {
  const supabase = serviceClient();
  const { data, error } = await supabase.from("ai_provider_settings")
    .select("provider,base_url,model,encrypted_api_key").eq("id", 1).maybeSingle();
  if (error) throw new Error("AI settings are unavailable.");
  if (!data) return null;
  return { provider: data.provider as string, baseUrl: data.base_url as string, model: data.model as string, apiKey: decryptApiKey(data.encrypted_api_key as string) };
}
export async function getAISettingsStatus() {
  const supabase = serviceClient();
  const { data, error } = await supabase.from("ai_provider_settings").select("provider,base_url,model,updated_at").eq("id", 1).maybeSingle();
  if (error) throw new Error("AI settings are unavailable.");
  return data;
}
