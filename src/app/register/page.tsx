import Link from "next/link";
import AuthForm from "@/components/auth-form";

export default function RegisterPage() {
  return <main className="grid min-h-screen place-items-center px-5 py-10"><div className="w-full max-w-md">
    <Link href="/" className="text-sm text-indigo-300">← Personal AI Studio</Link>
    <div className="panel mt-6 rounded-3xl p-7"><p className="text-xs uppercase tracking-[.2em] text-indigo-300">Get started</p><h1 className="mt-2 text-3xl font-semibold">Create account</h1><p className="muted mt-2 text-sm">Your workspace starts here.</p><AuthForm mode="register"/></div>
    <p className="muted mt-5 text-center text-sm">Already registered? <Link className="text-indigo-300" href="/login">Sign in</Link></p>
  </div></main>;
}