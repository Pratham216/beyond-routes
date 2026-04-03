import mongoose, { Schema } from "mongoose";
import { z } from "zod";

export const PlaceZod = z.object({
  slug: z.string(),
  name: z.string(),
  state: z.string(),
  region: z.enum(["north", "south", "east", "west", "central"]),
  placeType: z.enum([
    "hill",
    "mountain",
    "beach",
    "village",
    "cultural",
    "heritage",
    "forest",
    "valley",
    "cave",
    "island",
  ]),
  description: z.string(),
  keyExperiences: z.string(),
  bestTime: z.string(),
  accessibility: z.string(),
  crowd: z.enum(["Low", "Very Low", "Moderate"]),
  whyPeopleDontKnow: z.string(),
  priceMinINR: z.number().int().positive(),
  priceMaxINR: z.number().int().positive(),
  imageUrl: z.string().url().optional(),
});

export type PlaceInput = z.infer<typeof PlaceZod>;

const PlaceSchema = new Schema<PlaceInput>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    state: { type: String, required: true },
    region: { type: String, required: true, index: true },
    placeType: { type: String, required: true, index: true },
    description: { type: String, required: true },
    keyExperiences: { type: String, required: true },
    bestTime: { type: String, required: true },
    accessibility: { type: String, required: true },
    crowd: { type: String, required: true, index: true },
    whyPeopleDontKnow: { type: String, required: true },
    priceMinINR: { type: Number, required: true },
    priceMaxINR: { type: Number, required: true },
    imageUrl: { type: String, required: false },
  },
  { timestamps: true }
);

export const Place = mongoose.models.Place || mongoose.model("Place", PlaceSchema);

