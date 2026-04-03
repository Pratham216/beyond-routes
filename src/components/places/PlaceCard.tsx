import Link from "next/link";
import Image from "next/image";
import { type PlaceInput } from "@/lib/models/Place";

function formatINR(n: number) {
  return n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export default function PlaceCard({ place }: { place: PlaceInput }) {
  return (
    <Link
      href={`/experiences/${place.slug}`}
      className="group block overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-3xl transition-all duration-700 hover:border-white/10 hover:bg-white/[0.04] hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={place.imageUrl || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1200"}
          alt={place.name}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80" />
        <div className="absolute bottom-4 left-5">
          <div className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[9px] font-bold tracking-[0.2em] text-primary uppercase backdrop-blur-md">
            {place.placeType}
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-black tracking-tight text-white transition-colors group-hover:text-primary">
              {place.name}
            </h3>
            <div className="mt-1 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
              {place.state}
            </div>
          </div>

          <div className="text-lg font-black tracking-tighter text-primary">
            ₹{formatINR(place.priceMinINR)}+
          </div>
        </div>

        <p className="mt-4 line-clamp-2 text-sm font-medium leading-relaxed text-white/50">
          {place.description}
        </p>

        <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Best Experience</span>
            <span className="text-xs font-bold text-white/70">{place.bestTime}</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Vibe</span>
            <span className="text-xs font-bold text-white/70 italic">{place.crowd}</span>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-primary opacity-0 transition-all duration-500 group-hover:translate-x-2 group-hover:opacity-100">
          View Experience <span>→</span>
        </div>
      </div>
    </Link>
  );
}

