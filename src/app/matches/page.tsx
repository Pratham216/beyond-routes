"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { itineraries } from "@/lib/itineraries";

type Suggestion = {
  id: string;
  name: string;
  email: string;
  preferences: any;
};

export default function MatchesPage() {
  const { status } = useSession();

  const itineraryOptions = useMemo(() => itineraries, []);
  const [itinerarySlug, setItinerarySlug] = useState(
    itineraryOptions[0]?.slug ?? ""
  );
  const [dateISO, setDateISO] = useState(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  });

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const [requests, setRequests] = useState<any[]>([]);

  const refreshRequests = async () => {
    const r = await fetch("/api/matches/requests");
    const data = await r.json();
    setRequests(data.items ?? []);
  };

  useEffect(() => {
    if (status !== "authenticated") return;
    refreshRequests().catch(() => {});
  }, [status]);

  if (status !== "authenticated") {
    return (
      <div className="mx-auto w-full max-w-md px-4 pb-24 pt-16">
        <div className="rounded-[28px] border border-white/10 bg-white/4 p-6 backdrop-blur">
          <div className="text-sm font-medium text-white/70">Sign in required</div>
          <div className="mt-2 text-sm text-white/65">
            Matching needs an account so we can connect you safely.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-24 pt-10">
      <div className="rounded-[28px] border border-white/10 bg-white/4 p-6 backdrop-blur">
        <h1 className="text-3xl font-semibold tracking-tight text-white/92">
          Similar plans & dates
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-white/65">
          Choose an itinerary and date. If you have enabled discoverability
          in your profile, we’ll suggest compatible people.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_220px_160px]">
          <div>
            <div className="text-xs font-medium text-white/70">Itinerary</div>
            <select
              value={itinerarySlug}
              onChange={(e) => setItinerarySlug(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none"
            >
              {itineraryOptions.map((it) => (
                <option key={it.slug} value={it.slug}>
                  {it.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="text-xs font-medium text-white/70">Date</div>
            <input
              value={dateISO}
              onChange={(e) => setDateISO(e.target.value)}
              type="date"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none"
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                try {
                  await fetch("/api/matches/intents", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ itinerarySlug, dateISO }),
                  });

                  const r = await fetch(
                    `/api/matches/suggest?itinerarySlug=${encodeURIComponent(
                      itinerarySlug
                    )}&dateISO=${encodeURIComponent(dateISO)}`
                  );
                  const data = await r.json();
                  setSuggestions(data.items ?? []);
                  await refreshRequests();
                } finally {
                  setLoading(false);
                }
              }}
              className="w-full rounded-full bg-linear-to-r from-[#7a5cff]/35 via-[#2de1fc]/30 to-[#c6a15d]/30 px-4 py-3 text-sm font-medium text-white/90 backdrop-blur transition hover:from-[#7a5cff]/50 hover:to-[#c6a15d]/40 disabled:opacity-60"
            >
              {loading ? "Searching..." : "Find matches"}
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-black/20 p-5 backdrop-blur">
            <div className="text-sm font-semibold text-white/90">Suggestions</div>
            <div className="mt-2 text-xs text-white/60">
              People who set discoverability and match your preferences.
            </div>

            <div className="mt-4 space-y-3">
              {suggestions.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/4 p-4 text-sm text-white/60">
                  No suggestions yet. Try enabling discoverability in profile.
                </div>
              ) : (
                suggestions.map((s) => (
                  <div
                    key={s.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-white/92">
                          {s.name}
                        </div>
                        <div className="mt-1 text-xs text-white/60">
                          {s.preferences?.region
                            ? `${s.preferences.region[0].toUpperCase()}${s.preferences.region.slice(1)} • `
                            : ""}
                          Budget: {s.preferences?.budgetBand ?? "Any"} • Mood:{" "}
                          {s.preferences?.mood ?? "Any"}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-medium text-white/80 transition hover:bg-black/30"
                        onClick={async () => {
                          await fetch("/api/matches/request", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              toUserId: s.id,
                              itinerarySlug,
                              dateISO,
                            }),
                          });
                          await refreshRequests();
                        }}
                      >
                        Connect
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-5 backdrop-blur">
            <div className="text-sm font-semibold text-white/90">
              Incoming requests
            </div>
            <div className="mt-2 text-xs text-white/60">
              Accept or decline to keep matching private.
            </div>

            <div className="mt-4 space-y-3">
              {requests.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/4 p-4 text-sm text-white/60">
                  Nothing right now.
                </div>
              ) : (
                requests.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-white/92">
                          {r.from?.name}
                        </div>
                        <div className="mt-1 text-xs text-white/60">
                          {r.itinerarySlug} • {r.dateISO}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="rounded-full bg-linear-to-r from-[#2de1fc]/25 via-[#7a5cff]/20 to-[#c6a15d]/25 px-4 py-2 text-xs font-medium text-white/90 backdrop-blur transition hover:from-[#2de1fc]/35"
                          onClick={async () => {
                            await fetch("/api/matches/requests/update", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                requestId: r.id,
                                action: "accepted",
                              }),
                            });
                            await refreshRequests();
                          }}
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-medium text-white/80 transition hover:bg-black/30"
                          onClick={async () => {
                            await fetch("/api/matches/requests/update", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                requestId: r.id,
                                action: "declined",
                              }),
                            });
                            await refreshRequests();
                          }}
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

