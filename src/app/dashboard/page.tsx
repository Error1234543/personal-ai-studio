import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Workspace from "./workspace";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [projectResult, chatResult] = await Promise.all([
    supabase.from("projects").select("id,name,description,updated_at")
      .eq("owner_id", user.id).order("updated_at", { ascending: false }),
    supabase.from("conversations").select("id,title,updated_at,project_id")
      .eq("owner_id", user.id).order("updated_at", { ascending: false }).limit(30),
  ]);

  return <Workspace
    email={user.email ?? "Signed in"}
    projects={projectResult.error ? [] : (projectResult.data ?? [])}
    conversations={chatResult.error ? [] : (chatResult.data ?? [])}
  />;
}
