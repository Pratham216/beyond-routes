import rawItineraries from "../../data/itineraries.json";

export type ItineraryStop = {
  order: number;
  timeLabel: string;
  title: string;
  placeType: string;
  description: string;
};

export type Itinerary = {
  slug: string;
  title: string;
  durationMinutes: number;
  tags: Array<"date" | "chill" | "explore">;
  priceMinINR: number;
  priceMaxINR: number;
  image?: string;
  stops: ItineraryStop[];
};

export const itineraries: Itinerary[] = rawItineraries as Itinerary[];

import type { PlaceInput } from "./models/Place";

export function generateDynamicItinerary(gem: PlaceInput): Itinerary {
  const getStops = (): ItineraryStop[] => {
    switch (gem.placeType) {
      case "hill":
      case "mountain":
        return [
          { order: 1, timeLabel: "00:00", title: "Arrival & Views", placeType: gem.placeType, description: "Arrive at the base, acclimatize, and take in the panoramic views." },
          { order: 2, timeLabel: "01:00", title: "Guided Trek", placeType: "forest", description: "A scenic hike through uncharted paths with a local guide." },
          { order: 3, timeLabel: "02:00", title: "Picnic with a View", placeType: "valley", description: "Enjoy a curated local meal right on the hillside." },
          { order: 4, timeLabel: "02:45", title: "Golden Hour Photography", placeType: gem.placeType, description: "Capture the stunning sunset/sunrise before heading back." }
        ];
      case "village":
      case "cultural":
        return [
          { order: 1, timeLabel: "00:00", title: "Local Meet & Greet", placeType: gem.placeType, description: "Warm welcome, tea, and an introduction to village life." },
          { order: 2, timeLabel: "01:00", title: "Heritage Walk", placeType: "heritage", description: "Guided walk revealing stories hidden in old architecture." },
          { order: 3, timeLabel: "02:00", title: "Artisan Workshop", placeType: "cultural", description: "Watch or participate in traditional local crafts." },
          { order: 4, timeLabel: "02:45", title: "Authentic Meal", placeType: gem.placeType, description: "Taste authentic recipes passed down through generations." }
        ];
      case "beach":
      case "island":
        return [
          { order: 1, timeLabel: "00:00", title: "Coastal Walk", placeType: "beach", description: "Start with a quiet walk along a secluded stretch of sand." },
          { order: 2, timeLabel: "01:00", title: "Water Activity", placeType: gem.placeType, description: "A relaxed boat ride or gentle water exploration." },
          { order: 3, timeLabel: "02:00", title: "Seaside Shack Break", placeType: "cultural", description: "Fresh local catch or snacks with an ocean breeze." },
          { order: 4, timeLabel: "02:45", title: "Sunset Wind Down", placeType: "beach", description: "Settle into the perfect spot to watch the sun dip below the waves." }
        ];
      default:
        return [
          { order: 1, timeLabel: "00:00", title: "Immersion Start", placeType: gem.placeType, description: "Settle in and let the ambiance of the place take over." },
          { order: 2, timeLabel: "01:00", title: "Guided Exploration", placeType: gem.placeType, description: "Deep dive into what makes this spot truly unique." },
          { order: 3, timeLabel: "02:00", title: "Quiet Pause", placeType: "valley", description: "A momentary break to reflect, snack, and recharge." },
          { order: 4, timeLabel: "02:45", title: "Final Discovery", placeType: gem.placeType, description: "One last hidden secret before concluding the journey." }
        ];
    }
  };

  return {
    slug: `${gem.slug}-bundle`,
    title: `3-Hour Private Guided Itinerary: ${gem.name}`,
    durationMinutes: 180,
    tags: ["explore", "chill"],
    priceMinINR: gem.priceMinINR,
    priceMaxINR: gem.priceMaxINR,
    stops: getStops()
  };
}

