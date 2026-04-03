"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const REGIONS = ["north", "south", "east", "west", "central"] as const;
const BUDGETS = ["low", "mid", "high"] as const;
const MOODS = ["date", "chill", "explore"] as const;
const TIMES = ["morning", "afternoon", "evening"] as const;

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [prefs, setPrefs] = useState({
    region: "",
    budgetBand: "",
    mood: "",
    timeAvailable: [] as string[],
    discoverable: false,
  });

  useEffect(() => {
    if (status !== "authenticated") return;
    setLoading(true);
    fetch("/api/users/me")
      .then((r) => r.json())
      .then((data) => {
        setPrefs({
          region: data?.preferences?.region ?? "",
          budgetBand: data?.preferences?.budgetBand ?? "",
          mood: data?.preferences?.mood ?? "",
          timeAvailable: data?.preferences?.timeAvailable ?? [],
          discoverable: data?.preferences?.discoverable ?? false,
        });
      })
      .finally(() => setLoading(false));
  }, [status]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/sign-in?callbackUrl=/profile");
    }
  }, [status, router]);

  if (status !== "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col px-4 pt-32 pb-24 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 h-[60vh] w-[60vh] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="z-10 mx-auto w-full max-w-3xl">
        <div className="rounded-[3rem] border border-white/5 bg-white/[0.02] p-8 sm:p-12 backdrop-blur-3xl shadow-2xl">
          <h1 className="text-4xl font-black tracking-tighter text-white">
            Your Preferences
          </h1>
          <p className="mt-3 text-sm font-medium leading-relaxed text-white/50 max-w-xl">
            These settings will be used to curate premium matching experiences when your profile is set to discoverable.
          </p>

          {/* Account Details Box */}
          {status === "authenticated" && session?.user && (
            <div className="mt-10 flex flex-col sm:flex-row sm:items-center justify-between rounded-[2rem] border border-white/10 bg-white/5 p-6 sm:px-8 backdrop-blur shadow-inner">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Authenticated As</p>
                <h2 className="text-xl font-bold tracking-tight text-white">{session.user.name}</h2>
                <p className="text-sm font-medium text-white/50 mt-0.5">{session.user.email}</p>
              </div>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/auth/sign-in" })}
                className="mt-6 sm:mt-0 flex h-12 px-8 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-[10px] font-black uppercase tracking-[0.2em] text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)] transition-all hover:bg-red-500/20 hover:border-red-500/50"
              >
                Sign Out
              </button>
            </div>
          )}

          <form
            className="mt-12 space-y-10"
            onSubmit={async (e) => {
              e.preventDefault();
              setSaving(true);
              try {
                await fetch("/api/users/me", {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    region: prefs.region || undefined,
                    budgetBand: prefs.budgetBand || undefined,
                    mood: prefs.mood || undefined,
                    timeAvailable:
                      prefs.timeAvailable.length > 0 ? prefs.timeAvailable : undefined,
                    discoverable: prefs.discoverable,
                  }),
                });
                setShowToast(true);
                setTimeout(() => {
                  setShowToast(false);
                  router.push("/discover");
                }, 2500);
              } finally {
                setSaving(false);
              }
            }}
          >
            <section>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4 mb-4">Region</div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setPrefs((p) => ({ ...p, region: "" }))}
                  className={`rounded-[1.5rem] px-5 py-3 text-xs font-bold transition-all border ${
                    prefs.region === ""
                      ? "border-primary/50 bg-primary/10 text-primary shadow-[0_0_15px_rgba(234,179,8,0.15)]"
                      : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  Any
                </button>
                {REGIONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setPrefs((p) => ({ ...p, region: r }))}
                    className={`rounded-[1.5rem] px-5 py-3 text-xs font-bold transition-all border ${
                      prefs.region === r
                        ? "border-primary/50 bg-primary/10 text-primary shadow-[0_0_15px_rgba(234,179,8,0.15)]"
                        : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:border-white/20"
                    }`}
                  >
                    {r[0].toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4 mb-4">Budget band</div>
              <div className="flex flex-wrap gap-3">
                {BUDGETS.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setPrefs((p) => ({ ...p, budgetBand: b }))}
                    className={`rounded-[1.5rem] px-6 py-3 text-xs font-bold transition-all border flex-grow sm:flex-grow-0 text-center ${
                      prefs.budgetBand === b
                        ? "border-primary/50 bg-primary/10 text-primary shadow-[0_0_15px_rgba(234,179,8,0.15)]"
                        : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:border-white/20"
                    }`}
                  >
                    {b === "low" ? "Low" : b === "mid" ? "Mid" : "High"}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4 mb-4">Mood</div>
              <div className="flex flex-wrap gap-3">
                {MOODS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPrefs((p) => ({ ...p, mood: m }))}
                    className={`rounded-[1.5rem] px-6 py-3 text-xs font-bold transition-all border flex-grow sm:flex-grow-0 text-center ${
                      prefs.mood === m
                        ? "border-primary/50 bg-primary/10 text-primary shadow-[0_0_15px_rgba(234,179,8,0.15)]"
                        : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:border-white/20"
                    }`}
                  >
                    {m === "date" ? "Date" : m[0].toUpperCase() + m.slice(1)}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4 mb-4">Time available</div>
              <div className="flex flex-wrap gap-3">
                {TIMES.map((t) => {
                  const on = prefs.timeAvailable.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() =>
                        setPrefs((p) => ({
                          ...p,
                          timeAvailable: on
                            ? p.timeAvailable.filter((x) => x !== t)
                            : [...p.timeAvailable, t],
                        }))
                      }
                      className={`rounded-[1.5rem] px-6 py-3 text-xs font-bold transition-all border flex-grow sm:flex-grow-0 text-center ${
                        on
                          ? "border-primary/50 bg-primary/10 text-primary shadow-[0_0_15px_rgba(234,179,8,0.15)]"
                          : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:border-white/20"
                      }`}
                    >
                      {t[0].toUpperCase() + t.slice(1)}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-white/5 pt-8">
              <div className="ml-4 sm:ml-0">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">
                  Discoverable for matching
                </div>
                <div className="text-xs font-medium text-white/40 max-w-xs">
                  Only when enabled, other users can connect with you.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPrefs((p) => ({ ...p, discoverable: !p.discoverable }))}
                className={`flex h-12 w-28 items-center justify-center rounded-[1.5rem] border text-xs font-black uppercase tracking-widest transition-all ${
                  prefs.discoverable
                    ? "border-primary/50 bg-primary/10 text-primary shadow-[0_0_15px_rgba(234,179,8,0.15)]"
                    : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                {prefs.discoverable ? "On" : "Off"}
              </button>
            </section>

            <div className="pt-8">
              <button
                disabled={saving || loading}
                className="flex h-14 w-full sm:w-1/2 ml-auto items-center justify-center rounded-full bg-primary text-[11px] font-black uppercase tracking-[0.2em] text-black shadow-[0_15px_40px_rgba(234,179,8,0.2)] transition-all hover:scale-105 hover:shadow-[0_20px_50px_rgba(234,179,8,0.35)] disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
                type="submit"
              >
                {saving ? "Saving..." : "Save Preferences"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 rounded-full bg-[#eab308] px-6 py-4 shadow-[0_20px_50px_rgba(234,179,8,0.3)]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black">
              <svg className="h-4 w-4 text-[#eab308]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-black uppercase tracking-widest text-black">
              Preferences Saved
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

