import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAISettingsStatus } from "@/lib/ai-config";
import { updateAISettings } from "../actions";

export default async function AISettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  if (user.app_metadata?.role !== "admin") redirect("/dashboard");
  let settings = null;
  let warning = "";
  try { settings = await getAISettingsStatus(); } catch { warning = "Server configuration is incomplete. Add the required server environment variables."; }
  const { saved } = await searchParams;
  return <main className="mx-auto min-h-screen max-w-3xl px-5 py-8 sm:px-8">
    <Link href="/dashboard" className="text-sm text-indigo-300">← Back to workspace</Link>
    <section className="mt-8"><p className="text-xs uppercase tracking-[.2em] text-indigo-300">Administrator</p><h1 className="mt-2 text-3xl font-semibold">AI provider settings</h1><p className="muted mt-2 text-sm">Credentials are encrypted on the server and are never returned to the browser.</p></section>
    {saved === "1" && <p role="status" className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm">Settings saved securely.</p>}
    {warning && <p role="alert" className="mt-5 rounded-xl border border-amber-500/30 p-3 text-sm">{warning}</p>}
    <form action={updateAISettings} className="panel mt-6 space-y-4 rounded-2xl p-5">
      <label className="block text-sm">Provider name<input name="provider" required maxLength={60} defaultValue={settings?.provider ?? "OpenAI-compatible"} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3"/></label>
      <label className="block text-sm">API Base URL<input name="baseUrl" type="url" required defaultValue={settings?.base_url ?? "https://api.openai.com/v1"} placeholder="https://api.openai.com/v1" className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3"/></label>
      <label className="block text-sm">Model<input name="model" required maxLength={160} defaultValue={settings?.model ?? ""} placeholder="e.g. gpt-4o-mini" className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3"/></label>
      <label className="block text-sm">API Key<input name="apiKey" type="password" required autoComplete="new-password" minLength={8} maxLength={4096} placeholder="Paste provider API key (not displayed again)" className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3"/></label>
      <p className="muted text-xs">Current configuration: {settings ? settings.provider + " · " + settings.model + " · updated " + new Date(settings.updated_at).toLocaleString() : "Not configured"}. Saving a new key replaces the existing key.</p>
      <button className="w-full rounded-xl bg-indigo-500 px-4 py-3 font-semibold hover:bg-indigo-400">Save AI configuration</button>
    </form>
  </main>;
}
