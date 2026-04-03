import { NextResponse } from "next/server";
import { normalizeHiddenGems } from "@/lib/hidden-gems/normalizeHiddenGems";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const regions = url.searchParams.getAll("region");
  const placeTypes = url.searchParams.getAll("placeType");
  const q = (url.searchParams.get("q") || "").trim().toLowerCase();

  let items = normalizeHiddenGems();

  if (regions.length > 0) {
    items = items.filter((p) => regions.includes(p.region));
  }
  if (placeTypes.length > 0) {
    items = items.filter((p) => placeTypes.includes(p.placeType));
  }
  if (q) {
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  // Randomize order for discovery
  items = items.sort(() => Math.random() - 0.5);

  return NextResponse.json({ items });
}

