import Link from "next/link";
import type { Itinerary } from "@/lib/itineraries";
import { Clock, ArrowRight } from "lucide-react";

function formatINR(n: number) {
  return n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export default function ItineraryCard({ itinerary }: { itinerary: Itinerary }) {
  const min = formatINR(itinerary.priceMinINR);

  return (
    <Link
      href={`/itineraries/${itinerary.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8 backdrop-blur-3xl transition-all duration-500 hover:border-white/10 hover:bg-white/[0.04] hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
            <Clock className="h-3 w-3" />
            <span>3-Hour Experience</span>
          </div>
          <h3 className="text-2xl font-black leading-tight text-white sm:text-3xl">
            {itinerary.title}
          </h3>
        </div>
        <div className="text-right flex flex-col items-end">
          <div className="text-xl font-black tracking-tighter text-primary">
            ₹{min}+
          </div>
          <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/20">Approx Cost</div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {itinerary.tags.map((t) => (
          <span
            key={t}
            className="rounded-full border border-white/5 bg-white/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/50"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-12 flex items-center justify-between border-t border-white/5 pt-6">
        <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-accent transition-colors group-hover:text-white">
          View Detailed Timeline <ArrowRight className="h-3 w-3" />
        </span>
        <div className="h-1 w-12 rounded-full bg-white/5 transition-all group-hover:w-20 group-hover:bg-primary/30" />
      </div>
    </Link>
  );
}

