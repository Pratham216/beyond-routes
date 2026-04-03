"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { type PlaceInput } from "@/lib/models/Place";
import PlaceCard from "@/components/places/PlaceCard";
import RegionFilter from "@/components/filters/RegionFilter";
import TypeFilter from "@/components/filters/TypeFilter";

export default function DiscoverPage() {
  const [regions, setRegions] = useState<string[]>([]);
  const [placeTypes, setPlaceTypes] = useState<string[]>([]);
  const [q, setQ] = useState<string>("");
  const [items, setItems] = useState<PlaceInput[]>([]);
  const [loading, setLoading] = useState(true);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    regions.forEach((r) => params.append("region", r));
    placeTypes.forEach((t) => params.append("placeType", t));
    if (q.trim()) params.set("q", q.trim());
    return params.toString();
  }, [regions, placeTypes, q]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(`/api/places?${query}`)
      .then(async (r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setItems(data.items ?? []);
      })
      .catch(() => {
        if (cancelled) return;
        setItems([]);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <div className="mx-auto w-full max-w-7xl px-6 pb-24 pt-44">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" as any }}
      >
        <h1 className="text-balance text-6xl font-black tracking-tight text-white sm:text-8xl">
          EXPLORE <span className="text-primary italic">INDIA</span>
        </h1>
        <p className="mt-8 max-w-2xl text-lg font-medium leading-relaxed text-white/50">
          The best-kept secrets, curated by locals. Use the filters to find
          your next cinematic escape.
        </p>
      </motion.div>

      <div className="mt-20 grid gap-12 lg:grid-cols-[300px_1fr]">
        <aside className="sticky top-44 h-fit">
          <div className="max-h-[calc(100vh-220px)] overflow-y-auto pr-2 scrollbar-none rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-6 backdrop-blur-3xl">
            <div className="space-y-8">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Search</div>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Where to next?"
                  className="mt-3 w-full border-b border-white/5 bg-transparent py-3 text-lg font-bold text-white placeholder:text-white/10 focus:border-primary focus:outline-none transition-all"
                />
              </div>

              <div>
                <RegionFilter values={regions} onChange={setRegions} />
              </div>

              <div>
                <TypeFilter values={placeTypes} onChange={setPlaceTypes} />
              </div>
            </div>
          </div>
        </aside>

        <section>
          {loading ? (
            <div className="grid gap-8 sm:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-video animate-pulse rounded-[2.5rem] border border-white/5 bg-white/5"
                />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-[3rem] border border-white/5 bg-white/[0.02] p-24 text-center backdrop-blur-3xl">
              <div className="text-2xl font-black text-white">NO GEMS FOUND</div>
              <div className="mt-4 font-medium text-white/40">
                Try adjusting your filters or searching for something else.
              </div>
            </div>
          ) : (
            <motion.div
              layout
              className="grid gap-8 sm:grid-cols-2"
            >
              {items.map((place, idx) => (
                <motion.div
                  key={place.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: idx * 0.05 }}
                >
                  <PlaceCard place={place} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
}

