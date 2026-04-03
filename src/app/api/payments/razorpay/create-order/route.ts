import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import Razorpay from "razorpay";
import crypto from "crypto";
import { authOptions } from "@/lib/authOptions";
import { connectToDb } from "@/lib/db";
import { Booking } from "@/lib/models/Booking";

const bodySchema = z.object({
  bookingId: z.string().min(1),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string | undefined;

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  await connectToDb();
  const booking = await Booking.findById(parsed.data.bookingId).lean();
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (booking.userId.toString() !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Dev/devout behavior: if keys are missing, return mock order data.
  const keyId = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !secret) {
    const mockOrderId = `mock_order_${parsed.data.bookingId}_${crypto
      .randomBytes(4)
      .toString("hex")}`;
    await Booking.findByIdAndUpdate(parsed.data.bookingId, { $set: { razorpayOrderId: mockOrderId } });

    return NextResponse.json({
      mock: true,
      bookingId: parsed.data.bookingId,
      orderId: mockOrderId,
      amountINR: booking.amountINR,
      currency: "INR",
      keyId: "",
    });
  }

  const razorpay = new Razorpay({ key_id: keyId, key_secret: secret });
  const amountPaise = Math.round(booking.amountINR * 100);

  const order = await razorpay.orders.create({
    amount: amountPaise,
    currency: "INR",
    receipt: `rcpt_${booking._id.toString()}`,
    payment_capture: true,
    notes: { bookingId: booking._id.toString() },
  });

  await Booking.findByIdAndUpdate(parsed.data.bookingId, { $set: { razorpayOrderId: order.id } });

  return NextResponse.json({
    mock: false,
    bookingId: parsed.data.bookingId,
    orderId: order.id,
    amountINR: booking.amountINR,
    currency: order.currency,
    keyId,
    amountPaise,
  });
}

