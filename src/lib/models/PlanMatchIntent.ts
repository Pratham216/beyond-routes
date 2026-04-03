import mongoose, { Schema } from "mongoose";

const PlanMatchIntentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    itinerarySlug: { type: String, required: true, index: true },
    dateISO: { type: String, required: true, index: true }, // YYYY-MM-DD
  },
  { timestamps: true }
);

PlanMatchIntentSchema.index({ userId: 1, itinerarySlug: 1, dateISO: 1 }, { unique: true });

export const PlanMatchIntent =
  mongoose.models.PlanMatchIntent ||
  mongoose.model("PlanMatchIntent", PlanMatchIntentSchema);

