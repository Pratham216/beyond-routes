import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/authOptions";
import { connectToDb } from "@/lib/db";
import { Booking } from "@/lib/models/Booking";
import { itineraries, generateDynamicItinerary } from "@/lib/itineraries";
import { normalizeHiddenGems } from "@/lib/hidden-gems/normalizeHiddenGems";

const bodySchema = z.object({
  itinerarySlug: z.string().min(1),
  dateISO: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  slotStartISO: z.string().min(1),
  slotEndISO: z.string().min(1),
  seats: z.number().int().min(1).max(10).default(1),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id as string | undefined;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  let itinerary = itineraries.find((i) => i.slug === parsed.data.itinerarySlug);
  if (!itinerary && parsed.data.itinerarySlug.endsWith("-bundle")) {
    const gemSlug = parsed.data.itinerarySlug.replace("-bundle", "");
    const gem = normalizeHiddenGems().find(p => p.slug === gemSlug);
    if (gem) {
      itinerary = generateDynamicItinerary(gem);
    }
  }

  if (!itinerary) return NextResponse.json({ error: "Unknown itinerary" }, { status: 404 });

  await connectToDb();

  const taken = await Booking.exists({
    itinerarySlug: parsed.data.itinerarySlug,
    dateISO: parsed.data.dateISO,
    slotStartISO: parsed.data.slotStartISO,
    status: { $in: ["pending_payment", "confirmed"] },
  });
  if (taken) return NextResponse.json({ error: "Slot not available" }, { status: 409 });

  const amountINR = itinerary.priceMinINR * parsed.data.seats;
  const booking = await Booking.create({
    userId,
    itinerarySlug: parsed.data.itinerarySlug,
    dateISO: parsed.data.dateISO,
    slotStartISO: parsed.data.slotStartISO,
    slotEndISO: parsed.data.slotEndISO,
    seats: parsed.data.seats,
    status: "pending_payment",
    paymentStatus: "unpaid",
    amountINR,
  });

  return NextResponse.json({
    bookingId: booking._id.toString(),
    amountINR,
  });
}

