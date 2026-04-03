import mongoose, { Schema } from "mongoose";
import { z } from "zod";

export const BudgetBands = z.enum(["low", "mid", "high"]);
export const MoodBands = z.enum(["date", "chill", "explore"]);

export const UserPreferencesZod = z.object({
  region: z.enum(["north", "south", "east", "west", "central"]).optional(),
  budgetBand: BudgetBands.optional(),
  mood: MoodBands.optional(),
  timeAvailable: z
    .array(z.enum(["morning", "afternoon", "evening"]))
    .optional(),
  discoverable: z.boolean().optional(),
});

export type UserPreferences = z.infer<typeof UserPreferencesZod>;

const PreferencesSchema = new Schema<UserPreferences>(
  {
    region: { type: String },
    budgetBand: { type: String, enum: ["low", "mid", "high"] },
    mood: { type: String, enum: ["date", "chill", "explore"] },
    timeAvailable: { type: [String], enum: ["morning", "afternoon", "evening"] },
    discoverable: { type: Boolean, default: false },
  },
  { _id: false }
);

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    preferences: { type: PreferencesSchema, default: () => ({ discoverable: false }) },
  },
  { timestamps: true }
);

export const User =
  mongoose.models.User || mongoose.model("User", UserSchema);

