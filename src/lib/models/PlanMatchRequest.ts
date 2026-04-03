import mongoose, { Schema } from "mongoose";

const PlanMatchRequestSchema = new Schema(
  {
    fromUserId: { type: Schema.Types.ObjectId, required: true, index: true },
    toUserId: { type: Schema.Types.ObjectId, required: true, index: true },
    itinerarySlug: { type: String, required: true, index: true },
    dateISO: { type: String, required: true, index: true }, // YYYY-MM-DD

    status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending", index: true },
  },
  { timestamps: true }
);

export const PlanMatchRequest =
  mongoose.models.PlanMatchRequest ||
  mongoose.model("PlanMatchRequest", PlanMatchRequestSchema);

