"use client";

import Link from "next/link";
import { itineraries } from "@/lib/itineraries";
import ItineraryCard from "@/components/itineraries/ItineraryCard";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";

export default function ItinerariesPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 pb-24 pt-56">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="text-balance text-6xl font-black tracking-tight text-white sm:text-8xl">
          CURATED <span className="text-primary italic">EXPERIENCES</span>
        </h1>
        <p className="mt-8 max-w-2xl text-lg font-medium leading-relaxed text-white/50">
          Pre-built itineraries with premium pacing. Each one pairs perfectly with
          India&apos;s most exclusive hidden gems.
        </p>
      </motion.div>

      <div className="mt-20 grid gap-8 lg:grid-cols-3">
        {itineraries.map((it) => (
          <ItineraryCard key={it.slug} itinerary={it} />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="mt-20 rounded-[3rem] border border-white/10 bg-white/[0.02] p-12 text-center backdrop-blur-3xl"
      >
        <h2 className="text-3xl font-black text-white sm:text-4xl">Want to build your own?</h2>
        <p className="mt-4 mx-auto max-w-xl text-lg text-white/40">
          Our dynamic timeline builder is coming soon. For now, explore our curated gems 
          and pick the ones that match your vibe.
        </p>
        <div className="mt-10 flex justify-center">
          <Link
            href="/discover"
            className="group flex items-center gap-4 rounded-full bg-primary px-10 py-5 text-sm font-bold uppercase tracking-widest text-black transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(250,204,21,0.3)]"
          >
            Explore all gems <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
