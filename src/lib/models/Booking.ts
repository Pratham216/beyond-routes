import mongoose, { Schema } from "mongoose";
import { z } from "zod";

export const BookingStatusZod = z.enum([
  "pending_payment",
  "confirmed",
  "cancelled",
]);

export const PaymentStatusZod = z.enum(["unpaid", "paid", "failed"]);

const BookingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    itinerarySlug: { type: String, required: true, index: true },
    dateISO: { type: String, required: true, index: true }, // YYYY-MM-DD
    slotStartISO: { type: String, required: true, index: true }, // ISO string
    slotEndISO: { type: String, required: true },
    seats: { type: Number, required: true, default: 1 },

    status: { type: String, enum: ["pending_payment", "confirmed", "cancelled"], default: "pending_payment", index: true },
    paymentStatus: { type: String, enum: ["unpaid", "paid", "failed"], default: "unpaid" },

    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    amountINR: { type: Number, required: true },
  },
  { timestamps: true }
);

export type BookingDoc = mongoose.InferSchemaType<typeof BookingSchema>;

export const Booking =
  mongoose.models.Booking || mongoose.model("Booking", BookingSchema);

