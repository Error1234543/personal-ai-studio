"use client";
import { useState, useRef, useEffect, FormEvent } from "react";

type Message = { id?: string; role: "user" | "assistant"; content: string };
export default function ChatClient({ conversationId, initialMessages }: { conversationId: string; initialMessages: Message[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottom = useRef<HTMLDivElement>(null);
  useEffect(() => { bottom.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
  async function send(event: FormEvent) {
    event.preventDefault();
    const content = text.trim();
    if (!content || loading) return;
    setText(""); setError(""); setMessages((items) => [...items, { role: "user", content }]); setLoading(true);
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ conversationId, content }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Message failed.");
      setMessages((items) => [...items, data.message]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setText(content);
    } finally { setLoading(false); }
  }
  return <section className="panel mt-6 rounded-2xl p-4 sm:p-5">
    <div className="min-h-64 space-y-4">
      {messages.map((message, index) => <article key={message.id ?? index} className="rounded-xl border border-slate-800 p-4">
        <p className="mb-2 text-xs uppercase tracking-wide text-indigo-300">{message.role}</p>
        <p className="whitespace-pre-wrap break-words text-sm leading-6">{message.content}</p>
      </article>)}
      {loading && <p role="status" className="muted animate-pulse text-sm">AI is thinking…</p>}
      <div ref={bottom}/>
    </div>
    {error && <p role="alert" className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p>}
    <form onSubmit={send} className="mt-5 flex flex-col gap-3 sm:flex-row">
      <textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={12000} rows={3} placeholder="Message your AI assistant…" className="min-w-0 flex-1 resize-y rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm outline-none focus:border-indigo-400" />
      <button disabled={loading || !text.trim()} className="rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50">{loading ? "Sending…" : "Send"}</button>
    </form>
  </section>;
}
