import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { hiddenGemsRaw } from "../data/hidden-gems-raw";
import { connectToDb } from "../src/lib/db";
import { Place, PlaceZod, type PlaceInput } from "../src/lib/models/Place";

const STATES = [
  "Uttarakhand",
  "J&K",
  "HP",
  "Kerala",
  "Karnataka",
  "TN",
  "AP",
  "WB",
  "Assam",
  "Arunachal",
  "Tripura",
  "Nagaland",
  "Meghalaya",
  "Odisha",
  "Jharkhand",
  "Maharashtra",
  "Gujarat",
  "MP",
  "CG",
  "Bihar",
  "Manipur",
  "Daman/Diu",
];

const STATE_TO_REGION: Record<string, PlaceInput["region"]> = {
  Uttarakhand: "north",
  "J&K": "north",
  HP: "north",

  Kerala: "south",
  Karnataka: "south",
  TN: "south",
  AP: "south",

  Maharashtra: "west",
  Gujarat: "west",

  MP: "central",
  CG: "central",

  // Everything else in the dataset is treated as east for MVP filtering.
  Assam: "east",
  Arunachal: "east",
  Tripura: "east",
  Nagaland: "east",
  Meghalaya: "east",
  Odisha: "east",
  Jharkhand: "east",
  WB: "east",
  Bihar: "east",
  Manipur: "east",
  "Daman/Diu": "west",
};

const TYPE_TOKENS = [
  // Common geography types
  "Village",
  "Hamlet",
  "Valley",
  "Town",
  "Hill",
  "Forest",
  "Beach",
  "Heritage",
  "Canyon",
  "Ghost Town",
  "Settlement",
  "Island",
  "Cave",
  "Caves",
  "Geology",
  "Backwater",
  "Meadow",
  "Falls",
  "Landscape",
  "River City",
  "Tea Belt",
  "Coastal",
  "City",
  "Plateau",
  "Border",
  "Peak",
  "Peaks",
  "Cliff",
  "Fort",
  // Culture/misc types from your dataset column
  "Weaving",
  "Nature",
  "Wildlife",
  "Cultural",
  "Spiritual",
  "Sanctuary",
  "Tiger Res.",
];

const TYPE_TO_PLACE_TYPE: Record<string, PlaceInput["placeType"]> = {
  Village: "village",
  Hamlet: "village",
  Settlement: "village",

  Town: "cultural",
  Cultural: "cultural",
  Spiritual: "cultural",
  Weaving: "cultural",
  "River City": "cultural",
  City: "cultural",

  Heritage: "heritage",
  "Ghost Town": "heritage",
  Fort: "heritage",

  Hill: "hill",
  Meadow: "hill",
  "Tea Belt": "hill",
  Plateau: "hill",

  Peak: "mountain",
  Peaks: "mountain",
  Cliff: "mountain",
  Canyon: "mountain",

  Valley: "valley",
  "Landscape": "valley",

  Beach: "beach",
  Coastal: "beach",

  Forest: "forest",
  Nature: "forest",
  Wildlife: "forest",
  Border: "forest",
  Sanctuary: "forest",
  "Tiger Res.": "forest",
  Falls: "forest",

  Cave: "cave",
  Caves: "cave",

  Island: "island",
  Backwater: "island",
  Geology: "heritage",
};

const PLACE_TYPE_IMAGES: Record<PlaceInput["placeType"], string[]> = {
  hill: [
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&q=80&w=800"
  ],
  mountain: [
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1544198365-f5d60b6d8190?auto=format&fit=crop&q=80&w=800"
  ],
  beach: [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1520942702038-7fce81088a04?auto=format&fit=crop&q=80&w=800"
  ],
  village: [
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1516483642777-94943f218320?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1464254786740-b97e5420c299?auto=format&fit=crop&q=80&w=800"
  ],
  cultural: [
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1517373116369-9bdb8cdc9f62?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1526715469125-ed40049f5707?auto=format&fit=crop&q=80&w=800"
  ],
  heritage: [
    "https://images.unsplash.com/photo-1548013146-72479768b921?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=800"
  ],
  forest: [
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80&w=800"
  ],
  valley: [
    "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1506191669917-51c6755a570b?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=800"
  ],
  cave: [
    "https://images.unsplash.com/photo-1502726299822-6f583f972e02?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1536431311719-398b6704ca28?auto=format&fit=crop&q=80&w=800"
  ],
  island: [
    "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1505881502353-a1986add3732?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=800"
  ],
};

function getUniqueImage(name: string, type: PlaceInput["placeType"]): string {
  const images = PLACE_TYPE_IMAGES[type];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % images.length;
  return images[idx];
}

// Best time format seen in your master list (Month–Month) or Year-round.
const BEST_TIME_RE =
  /(?:Year-round|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s*[–-]\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))/g;

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function detectState(raw: string) {
  let best: { state: string; idx: number } | null = null;
  for (const s of STATES) {
    const idx = raw.indexOf(s);
    if (idx === -1) continue;
    if (!best || idx < best.idx) best = { state: s, idx };
  }
  if (!best) throw new Error(`Unable to detect state for: ${raw.slice(0, 80)}`);
  return best;
}

function detectType(raw: string) {
  const matches = TYPE_TOKENS.filter((t) => raw.startsWith(t));
  matches.sort((a, b) => b.length - a.length);
  if (matches.length) return matches[0];
  // Fallback: take the first token before best-time appears.
  const bestTime = raw.match(BEST_TIME_RE)?.[0];
  if (!bestTime) return "Village";
  return raw.slice(0, raw.indexOf(bestTime)).trim();
}

function normalizePlaceType(typeRaw: string): PlaceInput["placeType"] {
  return TYPE_TO_PLACE_TYPE[typeRaw] ?? "cultural";
}

function estimatePrice(input: {
  placeType: PlaceInput["placeType"];
  crowd: PlaceInput["crowd"];
  accessibility: string;
  region: PlaceInput["region"];
}) {
  const base: Record<PlaceInput["placeType"], { min: number; max: number }> = {
    hill: { min: 1699, max: 2899 },
    mountain: { min: 1799, max: 3099 },
    beach: { min: 2199, max: 3599 },
    village: { min: 1499, max: 2599 },
    cultural: { min: 1899, max: 3299 },
    heritage: { min: 1799, max: 3099 },
    forest: { min: 1599, max: 2799 },
    valley: { min: 1699, max: 2899 },
    cave: { min: 1799, max: 3099 },
    island: { min: 2099, max: 3499 },
  };

  let { min, max } = base[input.placeType];

  // Crowds: less known experiences often feel premium; but remote areas can be cheaper.
  if (input.crowd === "Very Low") {
    min -= 150;
    max -= 100;
  } else if (input.crowd === "Moderate") {
    min += 250;
    max += 200;
  }

  // Accessibility distance heuristic.
  const kmMatch = input.accessibility.match(/(\d+)\s*km/i);
  const hrMatch = input.accessibility.match(/(\d+)\s*hr/i);
  const distanceScore =
    kmMatch?.[1] ? Number(kmMatch[1]) : hrMatch?.[1] ? Number(hrMatch[1]) * 40 : null;

  if (distanceScore != null) {
    if (distanceScore >= 200) {
      min -= 200;
      max -= 150;
    } else if (distanceScore <= 50) {
      min += 250;
      max += 180;
    }
  }

  // Region bump (keeps numbers varied for cards).
  if (input.region === "north") {
    min += 50;
    max += 80;
  } else if (input.region === "south") {
    min += 100;
    max += 130;
  }

  min = Math.max(699, Math.round(min));
  max = Math.max(min + 300, Math.round(max));

  return { priceMinINR: min, priceMaxINR: max };
}

function splitIntoRows(raw: string) {
  // Row starts are always like: "<number><CapitalizedName...>"
  // We split on boundaries where a new row begins with digits + uppercase.
  return raw
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?=\d+[A-Z])/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

function normalizeRawRow(row: string): PlaceInput {
  const numberMatch = row.match(/^(\d+)([\s\S]*)$/);
  if (!numberMatch) throw new Error(`Invalid row: ${row.slice(0, 40)}`);
  const afterNumber = numberMatch[2] as string;

  const stateDet = detectState(afterNumber);
  const state = stateDet.state;
  const name = afterNumber.slice(0, stateDet.idx).trim();
  const afterState = afterNumber.slice(stateDet.idx + state.length);

  const typeRaw = detectType(afterState);
  const placeType = normalizePlaceType(typeRaw);

  const bestTimeMatch = afterState.match(BEST_TIME_RE);
  if (!bestTimeMatch?.length) {
    throw new Error(`Unable to find best time in row: ${row.slice(0, 120)}`);
  }
  const bestTime = bestTimeMatch[0].replace(/\s+/g, "");

  const bestTimeIndex = afterState.indexOf(bestTimeMatch[0]);
  const hiddenPart = afterState.slice(typeRaw.length, bestTimeIndex).trim();

  const restAfterBest = afterState.slice(bestTimeIndex + bestTimeMatch[0].length);

  const crowdMatch = restAfterBest.match(/(Very Low|Moderate|Low)/);
  if (!crowdMatch?.[0] || crowdMatch.index == null) {
    throw new Error(`Unable to find crowd in row: ${row.slice(0, 120)}`);
  }
  const crowd = crowdMatch[0] as PlaceInput["crowd"];
  const crowdIndex = crowdMatch.index;

  const accessibility = restAfterBest.slice(0, crowdIndex).trim();
  const whyPeopleDontKnow = restAfterBest.slice(crowdIndex + crowdMatch[0].length).trim();

  const firstPeriod = hiddenPart.indexOf(".");
  const description =
    firstPeriod >= 0 ? hiddenPart.slice(0, firstPeriod + 1).trim() : hiddenPart;
  const keyExperiences =
    firstPeriod >= 0 ? hiddenPart.slice(firstPeriod + 1).trim() : "";

  const region = STATE_TO_REGION[state] ?? "east";

  const { priceMinINR, priceMaxINR } = estimatePrice({
    placeType,
    crowd,
    accessibility,
    region,
  });

  const normalized: PlaceInput = {
    slug: slugify(name),
    name,
    state,
    region,
    placeType,
    description: description || name,
    keyExperiences: keyExperiences || hiddenPart,
    bestTime: bestTime,
    accessibility,
    crowd,
    whyPeopleDontKnow,
    priceMinINR,
    priceMaxINR,
    imageUrl: getUniqueImage(name, placeType),
  };

  return PlaceZod.parse(normalized);
}

export async function seedHiddenGems() {
  const rows = splitIntoRows(hiddenGemsRaw);
  if (rows.length < 100) {
    throw new Error(`Expected ~100 rows but got ${rows.length}`);
  }

  await connectToDb();

  const places = rows
    .slice(0, 100)
    .map((r) => normalizeRawRow(r));

  // Upsert by slug.
  for (const place of places) {
    console.log(`Seeding: ${place.name} (${place.placeType})`);
    await Place.findOneAndUpdate(
      { slug: place.slug },
      place,
      { upsert: true, new: true }
    );
  }
}

// If you want to run manually:
//   node scripts/seedHiddenGems.ts
// (Prefer running with a TS runner like tsx/tsx if configured.)
if (process.env.RUN_SEED === "true") {
  // eslint-disable-next-line no-console
  seedHiddenGems().then(() => console.log("Seed complete")).catch(console.error);
}

