import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ChatClient from "./chat-client";

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: chat, error } = await supabase.from("conversations")
    .select("id,title").eq("id", id).eq("owner_id", user.id).maybeSingle();
  if (error || !chat) notFound();
  const { data: messages, error: messagesError } = await supabase.from("messages")
    .select("id,role,content").eq("conversation_id", id).eq("owner_id", user.id)
    .in("role", ["user", "assistant"]).order("created_at", { ascending: true });
  return <main className="mx-auto min-h-screen max-w-4xl px-5 py-7 sm:px-8">
    <Link href="/dashboard" className="text-sm text-indigo-300">← Back to workspace</Link>
    <section className="mt-8"><p className="text-xs uppercase tracking-[.2em] text-indigo-300">AI conversation</p><h1 className="mt-2 text-3xl font-semibold">{chat.title}</h1><p className="muted mt-2 text-sm">Private conversation · only you can access these messages</p></section>
    {messagesError ? <p role="alert" className="mt-6 rounded-xl border border-rose-500/30 p-4 text-sm">Chat history could not be loaded. Refresh and try again.</p> :
      <ChatClient conversationId={chat.id} initialMessages={messages ?? []}/>}
  </main>;
}
