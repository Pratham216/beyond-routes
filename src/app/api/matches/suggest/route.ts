import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectToDb } from "@/lib/db";
import { PlanMatchIntent } from "@/lib/models/PlanMatchIntent";
import { User } from "@/lib/models/User";
import { z } from "zod";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const fromUserId = (session.user as any).id as string | undefined;
  if (!fromUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const itinerarySlug = url.searchParams.get("itinerarySlug") || "";
  const dateISO = url.searchParams.get("dateISO") || "";

  const schema = z.object({
    itinerarySlug: z.string().min(1),
    dateISO: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  });
  const parsed = schema.safeParse({ itinerarySlug, dateISO });
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query params" }, { status: 400 });
  }

  await connectToDb();

  const requester = await User.findById(fromUserId).lean();
  if (!requester) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const intents = await PlanMatchIntent.find({
    itinerarySlug,
    dateISO,
  }).lean();

  const toIds = intents.map((i) => i.userId.toString());

  const users = await User.find({
    _id: { $in: toIds },
    "preferences.discoverable": true,
  }).lean();

  const reqPrefs = requester.preferences ?? {};

  const filtered = users
    .filter((u) => u._id.toString() !== fromUserId)
    .filter((u) => {
      const p = u.preferences ?? {};

      if (reqPrefs.budgetBand && p.budgetBand && reqPrefs.budgetBand !== p.budgetBand) {
        return false;
      }
      if (reqPrefs.mood && p.mood && reqPrefs.mood !== p.mood) {
        return false;
      }
      if (reqPrefs.region && p.region && reqPrefs.region !== p.region) {
        return false;
      }

      if (Array.isArray(reqPrefs.timeAvailable) && reqPrefs.timeAvailable.length > 0) {
        const overlap = reqPrefs.timeAvailable.filter((t: string) =>
          (p.timeAvailable ?? []).includes(t)
        );
        if (overlap.length === 0) return false;
      }

      return true;
    })
    .slice(0, 20)
    .map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      preferences: u.preferences ?? {},
    }));

  return NextResponse.json({ items: filtered });
}

