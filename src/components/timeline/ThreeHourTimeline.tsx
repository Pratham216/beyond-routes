"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { Itinerary, ItineraryStop } from "@/lib/itineraries";

function formatTag(tag: string) {
  const t = tag.trim().toLowerCase();
  if (t === "date") return "Date";
  if (t === "chill") return "Chill";
  if (t === "explore") return "Explore";
  return t;
}

export default function ThreeHourTimeline({
  itinerary,
}: {
  itinerary: Itinerary;
}) {
  const stops: ItineraryStop[] = itinerary.stops;
  const [activeIndex, setActiveIndex] = useState(0);

  const active = stops[activeIndex] ?? stops[0];

  const tags = useMemo(() => itinerary.tags.map(formatTag), [itinerary.tags]);

  return (
    <div className="overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/[0.03] p-6 backdrop-blur-3xl sm:p-10">
      <div className="flex flex-wrap items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">Experience Flow</div>
          <div className="mt-2 text-xl font-black tracking-tight text-white">
            3-Hour Private Guided Itinerary
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/5 bg-white/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40 backdrop-blur"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[15px] top-6 bottom-6 w-[2px] bg-white/5" />

          <div className="space-y-3">
            {stops.map((s, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={s.order}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`group relative flex w-full items-start gap-5 rounded-2xl p-4 text-left transition-all duration-300 ${
                    isActive ? "bg-white/5" : "hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="relative z-10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center">
                    <motion.div
                      animate={{ 
                        scale: isActive ? 1.2 : 1,
                        backgroundColor: isActive ? "#facc15" : "rgba(255,255,255,0.2)"
                      }}
                      className="h-2 w-2 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.3)] transition-all"
                    />
                    {isActive && (
                      <motion.div
                        layoutId="active-ring"
                        className="absolute inset-0 rounded-full border border-primary/30"
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <div className={`text-sm font-bold tracking-tight transition-colors ${isActive ? "text-primary" : "text-white/80 group-hover:text-white"}`}>
                        {s.title}
                      </div>
                      <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest leading-none">
                        {s.timeLabel}
                      </div>
                    </div>
                    <div className={`mt-1 text-xs leading-relaxed transition-colors ${isActive ? "text-white/70" : "text-white/40 group-hover:text-white/60"}`}>
                      {s.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-[2rem] border border-white/5 bg-white/[0.04] p-8 backdrop-blur-3xl">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Now Previewing</div>
            <div className="mt-4 text-xl font-black tracking-tight text-white">
              {active.title}
            </div>
            <p className="mt-3 text-sm italic leading-relaxed text-white/60">
              {active.description}
            </p>

            <div className="mt-8 rounded-2xl border border-white/5 bg-white/5 p-6">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Recommended Gem Type</div>
              <div className="mt-3 inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-bold text-primary">
                {active.placeType}
              </div>
              <p className="mt-4 text-[11px] leading-relaxed text-white/40 font-medium">
                We've curated specific hidden gems that pair perfectly with this {active.title} session.
              </p>
            </div>
          </div>

          <div className="px-4 text-[10px] font-medium leading-relaxed text-white/20 italic">
            * Our dynamic timeline builder is rolling out soon. This view is optimized for quick itinerary previews.
          </div>
        </div>
      </div>
    </div>
  );
}

