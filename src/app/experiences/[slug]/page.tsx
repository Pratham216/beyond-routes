import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";
import { notFound } from "next/navigation";
import { itineraries } from "@/lib/itineraries";
import { normalizeHiddenGems } from "@/lib/hidden-gems/normalizeHiddenGems";

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const place = normalizeHiddenGems().find((p) => p.slug === slug);
  if (!place) notFound();

  if (!place) notFound();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-24 pt-56">
      <div className="group relative overflow-hidden rounded-[3rem] border border-white/5 bg-white/[0.02] p-8 backdrop-blur-3xl sm:p-12">
        {/* Featured Image */}
        <div className="relative mb-12 aspect-21/9 w-full overflow-hidden rounded-[2.5rem] border border-white/5 shadow-2xl">
          <SafeImage
            src={place.imageUrl || ""}
            alt={place.name}
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#050805] via-black/20 to-transparent opacity-60" />
        </div>
        <div className="absolute inset-0 opacity-80">
          <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-[#7a5cff]/20 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-[#2de1fc]/15 blur-3xl" />
        </div>

        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/discover"
              className="rounded-full border border-white/5 bg-white/5 px-4 py-2 text-xs font-bold text-white backdrop-blur transition hover:bg-white/10"
            >
              ← Back to discover
            </Link>

            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/90">
              Bundle cost:{" "}
              <span className="text-[#2de1fc]">
                From ₹{place.priceMinINR.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <h1 className="mt-8 text-3xl font-semibold tracking-tight text-white/92 sm:text-5xl">
            {place.name}
          </h1>

          <div className="mt-3 text-sm text-white/70">
            {place.state} • {place.placeType} • {place.region.toUpperCase()}
          </div>

          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-white/70 sm:text-base">
            {place.description}
          </p>

          <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-5">
            <div className="text-xs font-medium text-white/70">
              Key experiences
            </div>
            <div className="mt-2 text-sm leading-relaxed text-white/85">
              {place.keyExperiences}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-white/60">Best time</div>
                <div className="mt-1 text-sm text-white/90">{place.bestTime}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-white/60">Accessibility</div>
                <div className="mt-1 text-sm text-white/90">
                  {place.accessibility}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-white/60">Crowd</div>
                <div className="mt-1 text-sm text-white/90">{place.crowd}</div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-sm leading-relaxed text-white/65">
            Why people don't know: {place.whyPeopleDontKnow}
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              href={`/itineraries/${place.slug}-bundle`}
              className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-10 text-[11px] font-black uppercase tracking-[0.2em] text-black shadow-[0_10px_30px_rgba(250,204,21,0.2)] transition-all hover:scale-105 hover:shadow-[0_15px_40px_rgba(250,204,21,0.4)]"
            >
              View 3-hour bundles →
            </Link>
            <Link
              href="/discover"
              className="inline-flex h-14 items-center justify-center rounded-full border border-white/10 bg-white/5 px-10 text-[11px] font-black uppercase tracking-[0.2em] text-white backdrop-blur transition-all hover:bg-white/10"
            >
              Explore similar gems
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

