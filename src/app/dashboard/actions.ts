"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function getUserClient() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/login");
  return { supabase, user };
}

export async function createProject(formData: FormData) {
  const name = String(formData.get("name") || "").trim().slice(0, 100);
  const description = String(formData.get("description") || "").trim().slice(0, 1000);
  if (!name) return;
  const { supabase, user } = await getUserClient();
  const { error } = await supabase.from("projects").insert({
    owner_id: user.id, name, description,
  });
  if (error) throw new Error("Project could not be saved. Please try again.");
  revalidatePath("/dashboard");
}

export async function createConversation(formData: FormData) {
  const title = String(formData.get("title") || "New chat").trim().slice(0, 160) || "New chat";
  const rawProjectId = String(formData.get("project_id") || "").trim();
  const { supabase, user } = await getUserClient();
  const payload: { owner_id: string; title: string; project_id?: string } = {
    owner_id: user.id, title,
  };
  if (rawProjectId) payload.project_id = rawProjectId;
  const { data, error } = await supabase.from("conversations")
    .insert(payload).select("id").single();
  if (error || !data) throw new Error("Chat could not be created. Apply the Phase 2 database migration first.");
  revalidatePath("/dashboard");
  redirect(`/dashboard/chat/${data.id}`);
}

export async function deleteProject(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return;
  const { supabase } = await getUserClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error("Project could not be deleted.");
  revalidatePath("/dashboard");
}
