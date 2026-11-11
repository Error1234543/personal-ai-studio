import Link from "next/link";
import AuthForm from "@/components/auth-form";

export default function LoginPage() {
  return <main className="grid min-h-screen place-items-center px-5 py-10"><div className="w-full max-w-md">
    <Link href="/" className="text-sm text-indigo-300">← Personal AI Studio</Link>
    <div className="panel mt-6 rounded-3xl p-7"><p className="text-xs uppercase tracking-[.2em] text-indigo-300">Welcome back</p><h1 className="mt-2 text-3xl font-semibold">Sign in</h1><p className="muted mt-2 text-sm">Continue to your workspace.</p><AuthForm mode="login"/></div>
    <p className="muted mt-5 text-center text-sm">New here? <Link className="text-indigo-300" href="/register">Create an account</Link></p>
  </div></main>;
}