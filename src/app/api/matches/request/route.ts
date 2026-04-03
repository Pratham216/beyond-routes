import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/authOptions";
import { connectToDb } from "@/lib/db";
import { PlanMatchRequest } from "@/lib/models/PlanMatchRequest";

const bodySchema = z.object({
  toUserId: z.string().min(1),
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

  if (parsed.data.toUserId === fromUserId) {
    return NextResponse.json({ error: "Cannot request yourself" }, { status: 400 });
  }

  await connectToDb();

  const existing = await PlanMatchRequest.findOne({
    fromUserId,
    toUserId: parsed.data.toUserId,
    itinerarySlug: parsed.data.itinerarySlug,
    dateISO: parsed.data.dateISO,
    status: "pending",
  }).lean();

  if (existing) return NextResponse.json({ ok: true, alreadyRequested: true });

  await PlanMatchRequest.create({
    fromUserId,
    toUserId: parsed.data.toUserId,
    itinerarySlug: parsed.data.itinerarySlug,
    dateISO: parsed.data.dateISO,
    status: "pending",
  });

  return NextResponse.json({ ok: true });
}

