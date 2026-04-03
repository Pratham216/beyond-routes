"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/bookings";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Automatically sign in upon successful registration
      const signInRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signInRes?.error) {
        setError("Account created, but failed to sign in automatically.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center px-4 pt-32 pb-24 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -left-1/4 -top-1/4 h-[80vh] w-[80vh] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[80vh] w-[80vh] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="z-10 w-full max-w-md">
        <div className="rounded-[3rem] border border-white/5 bg-white/[0.02] p-10 backdrop-blur-3xl shadow-2xl sm:p-12">
          
          <div className="text-center">
            <h1 className="text-3xl font-black tracking-tighter text-white">Create Account</h1>
            <p className="mt-3 text-sm font-medium leading-relaxed text-white/50">
              Join Beyond Routes to securely manage bookings and access exclusive itineraries.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-[1.5rem] border border-white/10 bg-white/5 px-6 py-4 text-sm font-bold text-white outline-none transition-all placeholder:text-white/20 focus:border-primary/50 focus:bg-white/10"
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full rounded-[1.5rem] border border-white/10 bg-white/5 px-6 py-4 text-sm font-bold text-white outline-none transition-all placeholder:text-white/20 focus:border-primary/50 focus:bg-white/10"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full rounded-[1.5rem] border border-white/10 bg-white/5 px-6 py-4 text-sm font-bold text-white outline-none transition-all placeholder:text-white/20 focus:border-primary/50 focus:bg-white/10"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-xs font-bold text-red-500">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 flex h-14 w-full items-center justify-center rounded-full bg-primary text-[11px] font-black uppercase tracking-[0.2em] text-black shadow-[0_15px_40px_rgba(234,179,8,0.2)] transition-all hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(234,179,8,0.35)] disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-10 text-center text-xs font-medium text-white/40">
            Already have an account?{" "}
            <Link href={`/auth/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="font-bold text-primary transition-colors hover:text-white">
               Sign in instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
