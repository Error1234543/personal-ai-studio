"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { saveAISettings } from "@/lib/ai-config";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  if (user.app_metadata?.role !== "admin") redirect("/dashboard");
  return user;
}
export async function updateAISettings(formData: FormData) {
  await requireAdmin();
  const provider = String(formData.get("provider") || "").trim().slice(0, 60);
  const baseUrl = String(formData.get("baseUrl") || "").trim().replace(/\/+$/, "");
  const model = String(formData.get("model") || "").trim().slice(0, 160);
  const apiKey = String(formData.get("apiKey") || "").trim();
  if (!provider || !model || !apiKey || !/^https:\/\//i.test(baseUrl)) throw new Error("Provider, HTTPS base URL, model and API key are required.");
  if (apiKey.length > 4096) throw new Error("API key is too long.");
  await saveAISettings({ provider, baseUrl, model, apiKey });
  revalidatePath("/dashboard/admin/ai-settings");
  redirect("/dashboard/admin/ai-settings?saved=1");
}
