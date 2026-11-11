import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Bot, Code2, FolderKanban, LogOut, Settings } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  async function signOut() {
    "use server";
    const client = await createClient();
    await client.auth.signOut();
    redirect("/login");
  }
  return <main className="min-h-screen px-5 py-7 sm:px-8">
    <header className="mx-auto flex max-w-6xl items-center justify-between"><Link href="/" className="font-semibold">PERSONAL <span className="text-indigo-300">AI STUDIO</span></Link><form action={signOut}><button className="flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-sm"><LogOut size={15}/> Sign out</button></form></header>
    <section className="mx-auto max-w-6xl pt-12"><p className="text-xs uppercase tracking-[.2em] text-indigo-300">Your workspace</p><h1 className="mt-2 text-3xl font-semibold">Welcome back</h1><p className="muted mt-2 text-sm">{user.email}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[{icon:Bot,title:"AI Chat",desc:"Provider setup and chat history arrive in Phase 2."},{icon:Code2,title:"Coding Agent",desc:"Plan, review and approve code changes in a later phase."},{icon:FolderKanban,title:"Projects",desc:"Project workspaces are part of Phase 3."}].map(({icon:Icon,title,desc})=><article key={title} className="panel rounded-2xl p-5"><Icon className="mb-5 text-indigo-300"/><h2 className="font-semibold">{title}</h2><p className="muted mt-2 text-sm leading-6">{desc}</p><span className="mt-4 inline-block rounded-full bg-slate-800 px-3 py-1 text-xs muted">Coming in planned phase</span></article>)}
      </div>
      <div className="panel mt-6 flex items-center gap-3 rounded-2xl p-5"><Settings className="text-indigo-300"/><div><h2 className="font-medium">Account security</h2><p className="muted mt-1 text-sm">Authentication is connected to your Supabase project once environment variables are configured.</p></div></div>
    </section>
  </main>;
}