"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  if (user.app_metadata?.role !== "admin") redirect("/dashboard");
  return supabase;
}
export async function updateAISettings(formData: FormData) {
  const supabase = await requireAdmin();
  const model = String(formData.get("model") || "").trim();
  if (!model || model.length > 160 || !/^[a-zA-Z0-9._:/-]+$/.test(model)) {
    throw new Error("Enter a valid model identifier (up to 160 characters).");
  }
  const { error } = await supabase.from("ai_provider_settings").upsert({
    id: 1, model, updated_at: new Date().toISOString(),
  }, { onConflict: "id" });
  if (error) throw new Error("Model setting could not be saved. Check the database migration and admin permissions.");
  revalidatePath("/dashboard/admin/ai-settings");
  redirect("/dashboard/admin/ai-settings?saved=1");
}
