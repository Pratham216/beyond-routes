import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ThreeHourTimeline from "@/components/timeline/ThreeHourTimeline";
import { itineraries, generateDynamicItinerary } from "@/lib/itineraries";
import { normalizeHiddenGems } from "@/lib/hidden-gems/normalizeHiddenGems";

const HERO_IMAGE_FALLBACK = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200";

export default async function ItineraryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  let itinerary = itineraries.find((i) => i.slug === slug);
  let heroImage = HERO_IMAGE_FALLBACK;

  if (!itinerary && slug.endsWith("-bundle")) {
    const gemSlug = slug.replace("-bundle", "");
    const gem = normalizeHiddenGems().find((p) => p.slug === gemSlug);
    if (gem) {
      itinerary = generateDynamicItinerary(gem);
      heroImage = gem.imageUrl || HERO_IMAGE_FALLBACK;
    }
  }

  if (!itinerary) notFound();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-24 pt-56">
      <div className="group relative overflow-hidden rounded-[3rem] border border-white/5 bg-white/[0.02] p-8 backdrop-blur-3xl sm:p-12">
        {/* Cinematic Hero */}
        <div className="relative mb-12 aspect-21/9 w-full overflow-hidden rounded-[2.5rem] border border-white/5 shadow-2xl">
          <Image
            src={heroImage}
            alt={itinerary.title}
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#050805] via-black/20 to-transparent opacity-60" />
        </div>
        <div className="absolute inset-0 opacity-70">
          <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-[#2de1fc]/10 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-[#7a5cff]/10 blur-3xl" />
        </div>

        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/itineraries"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white backdrop-blur transition hover:bg-white/10"
            >
              ← Back to plans
            </Link>

            <div className="rounded-full border border-white/5 bg-white/5 px-4 py-2 text-sm text-white/90">
              Bundle cost:{" "}
              <span className="font-bold text-primary">
                ₹{itinerary.priceMinINR.toLocaleString("en-IN")}+
              </span>
            </div>
          </div>

          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-white/92 sm:text-5xl">
            {itinerary.title}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
            Timeline UI with smart scheduling (buffer logic) is coming soon.
            For now, preview the flow and tap into the hidden gem types
            recommended by each stop.
          </p>

          <div className="mt-8">
            <ThreeHourTimeline itinerary={itinerary} />
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Link
              href={`/bookings/${itinerary.slug}`}
              className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-10 text-[11px] font-black uppercase tracking-[0.2em] text-black shadow-[0_10px_30px_rgba(250,204,21,0.2)] transition-all hover:scale-105 hover:shadow-[0_15px_40px_rgba(250,204,21,0.4)] px-8"
            >
              Book now (UPI one-click)
            </Link>
            <Link
              href="/discover"
              className="inline-flex h-14 items-center justify-center rounded-full border border-white/10 bg-white/5 px-10 text-[11px] font-black uppercase tracking-[0.2em] text-white backdrop-blur transition-all hover:bg-white/10"
            >
              Explore matching hidden gems →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

