import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDb } from "@/lib/db";
import { Booking } from "@/lib/models/Booking";

const querySchema = z.object({
  itinerarySlug: z.string().min(1),
  dateISO: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  slotStartISO: z.string().min(1),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = querySchema.safeParse({
    itinerarySlug: url.searchParams.get("itinerarySlug") ?? "",
    dateISO: url.searchParams.get("dateISO") ?? "",
    slotStartISO: url.searchParams.get("slotStartISO") ?? "",
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query params" }, { status: 400 });
  }

  await connectToDb();

  const taken = await Booking.exists({
    itinerarySlug: parsed.data.itinerarySlug,
    dateISO: parsed.data.dateISO,
    slotStartISO: parsed.data.slotStartISO,
    status: { $in: ["pending_payment", "confirmed"] },
  });

  return NextResponse.json({ available: !taken });
}

