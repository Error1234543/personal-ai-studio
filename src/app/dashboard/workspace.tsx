import Link from "next/link";
import { createProject, createConversation, deleteProject, signOut } from "./actions";

type Project = { id: string; name: string; description: string; updated_at: string };
type Conversation = { id: string; title: string; updated_at: string; project_id: string | null };

export default function Workspace({ projects, conversations, email, setupWarning, isAdmin = false }: {
  projects: Project[]; conversations: Conversation[]; email: string; setupWarning?: string; isAdmin?: boolean; isAdmin?: boolean;
}) {
  return <main className="mx-auto max-w-6xl px-5 py-7 sm:px-8">
    <header className="flex flex-wrap items-center justify-between gap-4">
      <Link href="/" className="font-semibold tracking-wide">PERSONAL <span className="text-indigo-300">AI STUDIO</span></Link>
      <div className="flex items-center gap-3 text-sm">{isAdmin && <Link href="/dashboard/admin/ai-settings" className="rounded-xl border border-indigo-400/40 px-3 py-2 text-indigo-200">AI Settings</Link>}<span className="muted hidden sm:inline">{email}</span><form action={signOut}><button className="rounded-xl border border-slate-700 px-3 py-2">Sign out</button></form></div>
    </header>
    <section className="pt-10">
      <p className="text-xs uppercase tracking-[.2em] text-indigo-300">Your workspace</p>
      <h1 className="mt-2 text-3xl font-semibold">Projects & conversations</h1>
      <p className="muted mt-2 text-sm">Your projects and chat history are private to your account.</p>
    </section>
    {setupWarning && <div role="status" className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-6 text-amber-100">{setupWarning}</div>}
    <section className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
      <div className="panel rounded-2xl p-5">
        <div className="flex items-center justify-between gap-3"><h2 className="text-lg font-semibold">Projects</h2><span className="muted text-xs">{projects.length} saved</span></div>
        <form action={createProject} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1.2fr_auto]">
          <input name="name" required maxLength={100} placeholder="Project name" className="min-w-0 rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm outline-none focus:border-indigo-400"/>
          <input name="description" maxLength={1000} placeholder="Short description (optional)" className="min-w-0 rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm outline-none focus:border-indigo-400"/>
          <button className="rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold hover:bg-indigo-400">Create</button>
        </form>
        <div className="mt-5 space-y-3">
          {projects.length ? projects.map(project=><article key={project.id} className="flex items-start justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <div className="min-w-0"><h3 className="font-medium">{project.name}</h3><p className="muted mt-1 break-words text-sm">{project.description || "No description yet."}</p><p className="muted mt-2 text-xs">Updated {new Date(project.updated_at).toLocaleDateString()}</p></div>
            <form action={deleteProject}><input type="hidden" name="id" value={project.id}/><button aria-label={`Delete ${project.name}`} className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-rose-300">Delete</button></form>
          </article>) : <p className="muted rounded-xl border border-dashed border-slate-700 p-6 text-center text-sm">No projects yet. Create your first project above.</p>}
        </div>
      </div>
      <div className="panel rounded-2xl p-5">
        <div className="flex items-center justify-between gap-3"><h2 className="text-lg font-semibold">Chat history</h2><span className="muted text-xs">{conversations.length} saved</span></div>
        <form action={createConversation} className="mt-4 grid gap-3">
          <input name="title" maxLength={160} placeholder="Chat title (e.g. Website planning)" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm outline-none focus:border-indigo-400"/>
          <select name="project_id" defaultValue="" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm"><option value="">General conversation</option>{projects.map(project=><option key={project.id} value={project.id}>{project.name}</option>)}</select>
          <button className="rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold hover:bg-indigo-400">Create chat</button>
        </form>
        <div className="mt-5 space-y-2">
          {conversations.length ? conversations.map(chat=><Link key={chat.id} href={`/dashboard/chat/${chat.id}`} className="block rounded-xl border border-slate-800 p-4 hover:border-indigo-400/60"><p className="font-medium">{chat.title}</p><p className="muted mt-1 text-xs">Updated {new Date(chat.updated_at).toLocaleDateString()}</p></Link>) : <p className="muted rounded-xl border border-dashed border-slate-700 p-6 text-center text-sm">Your saved conversations will appear here.</p>}
        </div>
      </div>
    </section>
    <section className="panel mt-5 rounded-2xl p-5">
      <h2 className="font-semibold">AI assistant & coding agent</h2>
      <p className="muted mt-2 text-sm leading-6">Project and chat storage is connected. AI responses, code editing, live preview and secure provider settings are separate development steps. Do not add API credentials until the secure settings page is ready.</p>
    </section>
  </main>;
}
