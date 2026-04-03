import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import crypto from "crypto";
import Razorpay from "razorpay";
import { authOptions } from "@/lib/authOptions";
import { connectToDb } from "@/lib/db";
import { Booking } from "@/lib/models/Booking";

const bodySchema = z.object({
  bookingId: z.string().min(1),
  razorpayPaymentId: z.string().min(1).optional(),
  razorpayOrderId: z.string().min(1).optional(),
  razorpaySignature: z.string().min(1).optional(),
  mock: z.boolean().optional(),
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
  const booking = await Booking.findById(parsed.data.bookingId);
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (booking.userId.toString() !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const keyId = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;

  // If we are in mock-mode or missing keys, treat as paid for MVP progress.
  if (parsed.data.mock || !keyId || !secret) {
    await Booking.findByIdAndUpdate(parsed.data.bookingId, {
      $set: {
        paymentStatus: "paid",
        status: "confirmed",
        razorpayPaymentId: parsed.data.razorpayPaymentId ?? booking.razorpayPaymentId ?? "mock_payment",
        razorpayOrderId: parsed.data.razorpayOrderId ?? booking.razorpayOrderId ?? "mock_order",
      },
    });
    return NextResponse.json({ ok: true, confirmed: true });
  }

  const orderId = parsed.data.razorpayOrderId;
  const paymentId = parsed.data.razorpayPaymentId;
  const signature = parsed.data.razorpaySignature;

  if (!orderId || !paymentId || !signature) {
    return NextResponse.json({ error: "Missing payment verification params" }, { status: 400 });
  }

  // Verify using Razorpay signature formula: HMAC_SHA256(orderId|paymentId).
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  if (expectedSignature !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  await Booking.findByIdAndUpdate(parsed.data.bookingId, {
    $set: {
      paymentStatus: "paid",
      status: "confirmed",
      razorpayPaymentId: paymentId,
      razorpayOrderId: orderId,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _rzp = new Razorpay({ key_id: keyId, key_secret: secret });

  return NextResponse.json({ ok: true, confirmed: true });
}

