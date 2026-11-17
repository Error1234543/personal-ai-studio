import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateAISettings } from "../actions";

export default async function AISettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  if (user.app_metadata?.role !== "admin") redirect("/dashboard");
  const [{ data: settings, error }, { data: health }] = await Promise.all([
    supabase.from("ai_provider_settings").select("model,updated_at").eq("id", 1).maybeSingle(),
    Promise.resolve({ data: { provider: process.env.AI_PROVIDER || "OpenAI-compatible", configured: Boolean(process.env.AI_API_KEY && process.env.AI_BASE_URL) } }),
  ]);
  const { saved } = await searchParams;
  return <main className="mx-auto min-h-screen max-w-3xl px-5 py-8 sm:px-8">
    <Link href="/dashboard" className="text-sm text-indigo-300">← Back to workspace</Link>
    <section className="mt-8"><p className="text-xs uppercase tracking-[.2em] text-indigo-300">Administrator</p><h1 className="mt-2 text-3xl font-semibold">AI model settings</h1><p className="muted mt-2 text-sm">Change the model used by AI Chat. Provider credentials and API URL are managed privately in Vercel Environment Variables.</p></section>
    {saved === "1" && <p role="status" className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm">AI model updated successfully.</p>}
    {error && <p role="alert" className="mt-5 rounded-xl border border-rose-500/30 p-3 text-sm">Could not load model settings. Apply the latest Supabase migration.</p>}
    <section className="panel mt-6 rounded-2xl p-5">
      <h2 className="font-semibold">Provider connection</h2>
      <p className="muted mt-2 text-sm">Provider: {health.provider}</p>
      <p className="mt-1 text-sm">Credentials: <span className={health.configured ? "text-emerald-300" : "text-amber-300"}>{health.configured ? "Environment variables detected" : "Vercel environment setup required"}</span></p>
      <p className="muted mt-2 text-xs">API key and base URL are never displayed or sent to the browser.</p>
    </section>
    <form action={updateAISettings} className="panel mt-5 space-y-4 rounded-2xl p-5">
      <label className="block text-sm">AI Model ID<input name="model" required maxLength={160} defaultValue={settings?.model ?? ""} placeholder="e.g. llama-3.3-70b-versatile" className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3"/></label>
      <p className="muted text-xs">Enter the exact model identifier supported by your provider. Current model: {settings?.model ?? "Not configured"}{settings?.updated_at ? " · Updated " + new Date(settings.updated_at).toLocaleString() : ""}</p>
      <button disabled={!health.configured} className="w-full rounded-xl bg-indigo-500 px-4 py-3 font-semibold hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50">Save model</button>
    </form>
  </main>;
}
