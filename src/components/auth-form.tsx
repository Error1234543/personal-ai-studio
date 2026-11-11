"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [busy,setBusy] = useState(false);
  const [message,setMessage] = useState("");
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage(""); setBusy(true);
    try {
      const supabase = createClient();
      const result = mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/auth/callback` } });
      if (result.error) throw result.error;
      if (mode === "register" && !result.data.session) setMessage("Account created. Check your email to verify the address, then sign in.");
      else { router.push("/dashboard"); router.refresh(); }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    } finally { setBusy(false); }
  }

  async function google() {
    setMessage(""); setBusy(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/auth/callback` } });
      if (error) throw error;
    } catch (error) { setMessage(error instanceof Error ? error.message : "Google sign-in failed."); setBusy(false); }
  }

  return <form onSubmit={submit} className="mt-7 space-y-4">
    <label className="block text-sm">Email address<input required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-400"/></label>
    <label className="block text-sm">Password<input required minLength={8} type="password" autoComplete={mode==="login"?"current-password":"new-password"} value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-400"/><span className="muted mt-1 block text-xs">At least 8 characters.</span></label>
    <button disabled={busy} className="w-full rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold disabled:opacity-60">{busy?"Please wait…":mode==="login"?"Sign in":"Create account"}</button>
    <div className="flex items-center gap-3 text-xs muted"><span className="h-px flex-1 bg-slate-700"/>OR<span className="h-px flex-1 bg-slate-700"/></div>
    <button type="button" disabled={busy} onClick={google} className="w-full rounded-xl border border-slate-700 px-4 py-3 text-sm hover:border-slate-500 disabled:opacity-60">Continue with Google</button>
    {message && <p role="status" className="rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-slate-200">{message}</p>}
  </form>;
}