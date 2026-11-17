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

  const setupWarning = chatResult.error
    ? "Chat history database is not ready yet. In Supabase → SQL Editor, run supabase/migrations/0002_projects_and_chat_history.sql from the GitHub branch. Your existing account and projects are not changed by this message."
    : projectResult.error ? "Projects could not be loaded. Check the Supabase connection and database permissions." : undefined;

  return <Workspace
    email={user.email ?? "Signed in"}
    projects={projectResult.error ? [] : (projectResult.data ?? [])}
    conversations={chatResult.error ? [] : (chatResult.data ?? [])}
    setupWarning={setupWarning}
  />;
}
