import BookingClient from "./BookingClient";
import { notFound } from "next/navigation";
import { itineraries, generateDynamicItinerary } from "@/lib/itineraries";
import { normalizeHiddenGems } from "@/lib/hidden-gems/normalizeHiddenGems";

const HERO_IMAGE_FALLBACK = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ itinerarySlug: string }>;
}) {
  const { itinerarySlug } = await params;
  
  let itinerary = itineraries.find((i) => i.slug === itinerarySlug);
  let heroImage = HERO_IMAGE_FALLBACK;

  if (!itinerary && itinerarySlug.endsWith("-bundle")) {
    const gemSlug = itinerarySlug.replace("-bundle", "");
    const gem = normalizeHiddenGems().find(p => p.slug === gemSlug);
    if (gem) {
      itinerary = generateDynamicItinerary(gem);
      heroImage = gem.imageUrl || HERO_IMAGE_FALLBACK;
    }
  }

  if (!itinerary) {
    return (
      <div className="mx-auto w-full max-w-md px-4 pb-24 pt-56">
        <div className="rounded-[3rem] border border-white/5 bg-white/[0.02] p-12 backdrop-blur-3xl">
          <div className="text-sm font-black text-white/40 uppercase tracking-widest">Not Found</div>
          <div className="mt-4 text-white/70 italic">Unknown itinerary. Please try another selection.</div>
        </div>
      </div>
    );
  }

  return <BookingClient itinerary={itinerary} heroImage={heroImage} />;
}
