import Link from "next/link";
import { ArrowRight, Bot, Code2, FolderGit2, Rocket, ShieldCheck, Sparkles, TerminalSquare } from "lucide-react";

const features = [
  { icon: Bot, title: "AI Chat", desc: "Bring your own AI provider and keep conversations organised." },
  { icon: Code2, title: "Coding Agent", desc: "Plan changes, review diffs and approve file operations." },
  { icon: TerminalSquare, title: "Workspace", desc: "A future home for editor, terminal and live preview." },
  { icon: Rocket, title: "Deploy", desc: "Connect GitHub and Vercel when you are ready." }
];

export default function Home() {
  return <main className="min-h-screen px-5 py-6 sm:px-8">
    <header className="mx-auto flex max-w-6xl items-center justify-between">
      <Link href="/" className="flex items-center gap-3 font-semibold tracking-wide">
        <span className="grid h-10 w-10 place-items-center rounded-xl border border-indigo-400/30 bg-indigo-500/15 text-indigo-300"><Sparkles size={20}/></span>
        <span>PERSONAL <span className="text-indigo-300">AI STUDIO</span></span>
      </Link>
      <Link href="/login" className="rounded-xl border border-slate-700 px-4 py-2 text-sm hover:border-indigo-400">Sign in <ArrowRight className="ml-2 inline" size={15}/></Link>
    </header>

    <section className="mx-auto grid max-w-6xl gap-12 pb-16 pt-20 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:pt-28">
      <div>
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/25 bg-indigo-500/10 px-3 py-1.5 text-xs text-indigo-200"><span className="h-2 w-2 rounded-full bg-emerald-400"/> Phase 1 · Foundation</div>
        <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">One studio for your <span className="text-indigo-300">AI-powered</span> work.</h1>
        <p className="muted mt-6 max-w-xl text-base leading-7 sm:text-lg">A focused workspace for conversations, projects and coding tools — designed to grow into your personal AI development platform.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/register" className="rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-950/50 hover:bg-indigo-400">Create account <ArrowRight className="ml-2 inline" size={16}/></Link>
          <Link href="/login" className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold hover:border-slate-500">Sign in</Link>
        </div>
        <div className="mt-8 flex items-center gap-2 text-xs muted"><ShieldCheck size={15} className="text-emerald-400"/> Supabase-backed authentication · Row-level security planned in migration</div>
      </div>
      <div className="panel rounded-3xl p-4 shadow-2xl shadow-indigo-950/20 sm:p-6">
        <div className="mb-5 flex items-center justify-between"><div className="text-sm font-medium">Studio overview</div><span className="rounded-full bg-slate-800 px-3 py-1 text-xs muted">Preview</span></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4"><Bot className="mb-5 text-indigo-300"/><div className="text-2xl font-semibold">AI</div><div className="mt-1 text-xs muted">Chat workspace</div></div>
          <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4"><FolderGit2 className="mb-5 text-cyan-300"/><div className="text-2xl font-semibold">Projects</div><div className="mt-1 text-xs muted">Your workspaces</div></div>
          <div className="col-span-2 rounded-2xl border border-slate-700/70 bg-slate-950/80 p-4">
            <div className="mb-3 flex items-center gap-2 text-xs muted"><span className="h-2 w-2 rounded-full bg-emerald-400"/> Workspace status</div>
            <div className="space-y-3">{["Authentication foundation","Project workspace","AI coding agent"].map((x,i)=><div key={x}><div className="mb-1 flex justify-between text-xs"><span>{x}</span><span className="muted">{i===0?"In progress":"Planned"}</span></div><div className="h-1.5 rounded-full bg-slate-800"><div className={`h-1.5 rounded-full ${i===0?"w-2/3 bg-indigo-400":"w-0"}`}/></div></div>)}</div>
          </div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-6xl pb-16">
      <div className="mb-6"><p className="text-xs font-semibold uppercase tracking-[.2em] text-indigo-300">Built in phases</p><h2 className="mt-2 text-2xl font-semibold">A clean foundation first.</h2></div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{features.map(({icon:Icon,title,desc})=><article key={title} className="panel rounded-2xl p-5"><Icon className="mb-4 text-indigo-300" size={21}/><h3 className="font-semibold">{title}</h3><p className="muted mt-2 text-sm leading-6">{desc}</p></article>)}</div>
    </section>
    <footer className="mx-auto max-w-6xl border-t border-slate-800 pt-5 text-xs muted">Personal AI Studio · Foundation build · No external services activated automatically.</footer>
  </main>;
}