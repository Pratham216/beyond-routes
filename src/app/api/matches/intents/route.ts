import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/authOptions";
import { connectToDb } from "@/lib/db";
import { PlanMatchIntent } from "@/lib/models/PlanMatchIntent";
import { User } from "@/lib/models/User";

const bodySchema = z.object({
  itinerarySlug: z.string().min(1),
  dateISO: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const fromUserId = (session.user as any).id as string | undefined;
  if (!fromUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  await connectToDb();

  // Ensure user is discoverable to participate in matching suggestions.
  const user = await User.findById(fromUserId).lean();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (!user.preferences?.discoverable) {
    return NextResponse.json({ error: "Set discoverable = On in Profile" }, { status: 403 });
  }

  await PlanMatchIntent.findOneAndUpdate(
    { userId: fromUserId, itinerarySlug: parsed.data.itinerarySlug, dateISO: parsed.data.dateISO },
    { userId: fromUserId, itinerarySlug: parsed.data.itinerarySlug, dateISO: parsed.data.dateISO },
    { upsert: true, new: true }
  );

  return NextResponse.json({ ok: true });
}

