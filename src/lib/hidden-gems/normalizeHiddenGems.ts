import { hiddenGemsRaw } from "../../../data/hidden-gems-raw";
import { PlaceZod, type PlaceInput } from "../models/Place";

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
  Landscape: "valley",

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

const PLACE_TYPE_IMAGE_POOLS: Record<PlaceInput["placeType"], string[]> = {
  hill: [
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&q=80&w=1200",
  ],
  mountain: [
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&q=80&w=1200",
  ],
  beach: [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1501959915551-4e8b0d2f5d9d?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&q=80&w=1200",
  ],
  village: [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1530878902700-5ad4f9e4c318??auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=1200",
  ],
  cultural: [
    "https://images.unsplash.com/photo-1519267126373-acc2bc994784?auto=format&fit=crop&q=80&w=1200", // Swapped Taj Mahal for Hampi
    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1200",
  ],
  heritage: [
    "https://images.unsplash.com/photo-1601825915519-0dd631a2d58d??auto=format&fit=crop&q=80&w=1200", // qE6BF2CA0I0 (Chand Baori)
    "https://images.unsplash.com/photo-1616428090830-59bd09d9f272??auto=format&fit=crop&q=80&w=1200", // Amer Fort
    "https://images.unsplash.com/photo-1606207703250-3954855894cd??auto=format&fit=crop&q=80&w=1200", // R9EjMAM0agY (Hampi)
    "https://images.unsplash.com/photo-1582510003544-4d00b7f74220??auto=format&fit=crop&q=80&w=1200", // 18i8kmonZWs (Qutub/Tower)
    "https://images.unsplash.com/photo-1575980377979-86bcfaf7f3b4??auto=format&fit=crop&q=80&w=1200", // XCpAG-JK_JU (Hampi Water)
  ],
  forest: [
    "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1473447198193-69ec0a38f5c9?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200",
  ],
  valley: [
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=1200",
  ],
  cave: [
    "https://images.unsplash.com/photo-1526779259212-756e4c0c4d0d?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1473447198193-69ec0a38f5c9?auto=format&fit=crop&q=80&w=1200",
  ],
  island: [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1501959915551-4e8b0d2f5d9d?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80&w=1200",
  ],
};

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

  if (input.crowd === "Very Low") {
    min -= 150;
    max -= 100;
  } else if (input.crowd === "Moderate") {
    min += 250;
    max += 200;
  }

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
  const compact = raw.replace(/\s+/g, " ").trim();
  const matches = compact.match(/\d{1,3}[A-Z][\s\S]*?(?=\d{1,3}[A-Z]|$)/g) ?? [];
  return matches.map((m) => m.trim()).filter(Boolean);
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
  const bestTimeRaw = bestTimeMatch[0];
  const bestTime = bestTimeRaw.replace(/\s+/g, "");

  const bestTimeIndex = afterState.indexOf(bestTimeRaw);
  const hiddenPart = afterState.slice(typeRaw.length, bestTimeIndex).trim();

  const restAfterBest = afterState.slice(bestTimeIndex + bestTimeRaw.length);

  const crowdMatch = restAfterBest.match(/(Very Low|Moderate|Low)/);
  if (!crowdMatch?.[0] || crowdMatch.index == null) {
    throw new Error(`Unable to find crowd in row: ${row.slice(0, 120)}`);
  }
  const crowd = crowdMatch[0] as PlaceInput["crowd"];
  const crowdIndex = crowdMatch.index;

  const accessibility = restAfterBest.slice(0, crowdIndex).trim();
  const whyPeopleDontKnow = restAfterBest
    .slice(crowdIndex + crowdMatch[0].length)
    .trim();

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

  const slug = slugify(name);
  const pool = PLACE_TYPE_IMAGE_POOLS[placeType];
  const imageIndex = Math.abs(slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % pool.length;
  const imageUrl = pool[imageIndex];

  const normalized: PlaceInput = {
    slug,
    name,
    state,
    region,
    placeType,
    description: description || name,
    keyExperiences: keyExperiences || hiddenPart,
    bestTime,
    accessibility,
    crowd,
    whyPeopleDontKnow,
    priceMinINR,
    priceMaxINR,
    imageUrl,
  };

  return PlaceZod.parse(normalized);
}

let cached: PlaceInput[] | null = null;

export function normalizeHiddenGems(): PlaceInput[] {
  if (cached) return cached;
  const rows = splitIntoRows(hiddenGemsRaw);
  const normalized: PlaceInput[] = [];
  for (const row of rows) {
    if (normalized.length >= 100) break;
    try {
      const parsed = normalizeRawRow(row);
      normalized.push(parsed);
    } catch {
      // Ignore malformed rows so discovery API stays resilient in dev.
    }
  }
  cached = normalized;
  return normalized;
}

