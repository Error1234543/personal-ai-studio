import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: chat, error } = await supabase.from("conversations")
    .select("id,title,created_at").eq("id", id).eq("owner_id", user.id).maybeSingle();
  if (error || !chat) notFound();
  const { data: messages } = await supabase.from("messages")
    .select("id,role,content,created_at").eq("conversation_id", id)
    .eq("owner_id", user.id).order("created_at", { ascending: true });
  return <main className="mx-auto min-h-screen max-w-4xl px-5 py-7 sm:px-8">
    <Link href="/dashboard" className="text-sm text-indigo-300">← Back to workspace</Link>
    <section className="mt-8"><p className="text-xs uppercase tracking-[.2em] text-indigo-300">Saved conversation</p><h1 className="mt-2 text-3xl font-semibold">{chat.title}</h1></section>
    <section className="panel mt-6 min-h-64 rounded-2xl p-5">
      {messages?.length ? <div className="space-y-4">{messages.map(message=><article key={message.id} className="rounded-xl border border-slate-800 p-4"><p className="mb-2 text-xs uppercase tracking-wide text-indigo-300">{message.role}</p><p className="whitespace-pre-wrap break-words text-sm leading-6">{message.content}</p></article>)}</div> : <div className="grid min-h-52 place-items-center text-center"><div><p className="font-medium">This chat is saved and ready.</p><p className="muted mt-2 max-w-md text-sm leading-6">AI replies are not active yet. The secure provider settings and chat engine are the next development phase. No API credentials are needed right now.</p></div></div>}
    </section>
  </main>;
}
