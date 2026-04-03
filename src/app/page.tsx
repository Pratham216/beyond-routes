"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";
import { Coffee, Map, Image as ImageIcon, Cake } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
} as const;

export default function Home() {
  return (
    <div className="relative bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-56 pb-20">
        {/* Full-Screen Background Image */}
        <div className="absolute inset-0 z-0 scale-105 animate-[pulse_10s_ease-in-out_infinite] blur-[1px]">
          <SafeImage
            src="https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&q=80&w=2000"
            alt="Scenic India landscape"
            fill
            sizes="100vw"
            className="object-cover brightness-[0.35]"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/10 to-black/90" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-10 text-center">
          <motion.div 
            initial="initial"
            animate="animate"
            className="mx-auto max-w-5xl"
          >
            <motion.div
              variants={fadeUp}
              className="mb-8 inline-flex items-center rounded-full border border-white/20 bg-white/5 px-6 py-2 text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 backdrop-blur-md"
            >
              India's hidden stories
            </motion.div>
            
            <motion.h1
              variants={fadeUp}
              className="text-balance text-6xl font-black leading-[0.9] tracking-tighter text-white sm:text-8xl lg:text-[7rem]"
            >
              BEYOND <span className="text-primary italic">ROUTES</span>
            </motion.h1>
            
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-10 max-w-2xl text-xl font-medium leading-relaxed text-white/50"
            >
              Curated escapes to the places Google Maps won't show you. 
              Cinematic, local, and completely authentic.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-14 flex flex-wrap justify-center gap-6">
              <Link
                href="/discover"
                className="group relative flex h-16 items-center justify-center overflow-hidden rounded-full bg-primary px-12 text-[11px] font-black uppercase tracking-[0.2em] text-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(250,204,21,0.2)]"
              >
                Start Exploring
              </Link>
              <Link
                href="/itineraries"
                className="flex h-16 items-center justify-center rounded-full border border-white/10 bg-white/5 px-12 text-[11px] font-black uppercase tracking-[0.2em] text-white backdrop-blur-xl transition-all hover:bg-white/10 hover:border-white/20"
              >
                View Plans
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-3">
            <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-white/20">Explore</span>
            <div className="h-16 w-[1px] bg-linear-to-b from-primary/50 to-transparent" />
          </div>
        </motion.div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-24 pt-20">
        <motion.div {...fadeUp}>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">01 / Explore</h2>
          <h3 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-6xl">
            Vibe check your next <span className="italic text-white/40">escape.</span>
          </h3>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-white/50">
            Pick your poison. We’ve surfaced hidden gems with 3‑hour
            itineraries attached to every single one.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Cafés", tag: "Artisan & Hidden", img: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800&auto=format&fit=crop" },
            { title: "Art spaces", tag: "Galleries", img: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800&auto=format&fit=crop" },
            { title: "Night life", tag: "Jazz & Bars", img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop" },
            { title: "Escapes", tag: "Nature", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop" },
          ].map((c, idx) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className="group relative aspect-[4/5] overflow-hidden rounded-[3rem] border border-white/5 bg-white/5 transition-all duration-700 hover:scale-[1.02]"
            >
              <SafeImage
                src={c.img}
                alt={c.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/20 to-black/80" />
              
              <div className="absolute inset-x-0 bottom-0 p-8">
                <div className="mb-2 inline-flex rounded-full bg-white/10 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-white/80 backdrop-blur-md">
                  {c.tag}
                </div>
                <h4 className="text-3xl font-black text-white">{c.title}</h4>
              </div>

              <Link href="/discover" className="absolute inset-0 z-10" />
            </motion.div>
          ))}
        </div>
      </section>

      <section id="itineraries" className="mx-auto w-full max-w-4xl px-6 pb-32 pt-20">
        <motion.div {...fadeUp} className="text-center">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent">02 / Itineraries</h2>
          <h3 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-6xl">
            Build your perfect <span className="italic text-accent">3-hour escape</span>
          </h3>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed text-white/50">
            Coffee → Walk → Activity → Dessert. Pre-built itineraries or create your own.
          </p>
        </motion.div>

        <div className="mt-20 space-y-12">
          {[
            { time: "6:00 PM", title: "Artisan Coffee", duration: "30 min", icon: <Coffee className="h-6 w-6" /> },
            { time: "6:45 PM", title: "Street Art Walk", duration: "45 min", icon: <Map className="h-6 w-6" /> },
            { time: "7:45 PM", title: "Hidden Gallery", duration: "60 min", icon: <ImageIcon className="h-6 w-6" /> },
            { time: "9:00 PM", title: "Dessert Stop", duration: "30 min", icon: <Cake className="h-6 w-6" /> },
          ].map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className="group relative flex items-center gap-8"
            >
              {idx !== 3 && (
                <div className="absolute left-[27px] top-12 h-20 w-[2px] bg-linear-to-b from-white/10 to-transparent" />
              )}
              
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 text-primary backdrop-blur-xl transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-black group-hover:border-primary">
                {step.icon}
              </div>

              <div className="flex flex-1 items-center justify-between rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8 backdrop-blur-2xl transition-all group-hover:border-white/10 group-hover:bg-white/[0.04]">
                <div>
                  <h4 className="text-xl font-bold text-white sm:text-2xl">{step.title}</h4>
                  <div className="mt-1 flex items-center gap-2 text-sm text-white/40">
                    <span>🕒 {step.duration}</span>
                  </div>
                </div>
                <div className="text-lg font-black tracking-tighter text-white/20 sm:text-xl">
                  {step.time}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeUp} className="mt-20 flex justify-center">
          <Link
            href="/itineraries"
            className="group relative flex h-16 items-center justify-center overflow-hidden rounded-full bg-primary px-12 text-[11px] font-black uppercase tracking-[0.2em] text-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(250,204,21,0.2)]"
          >
            Build Your Itinerary
          </Link>
        </motion.div>
      </section>

      {/* Community Section */}
      <section className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden py-32">
        <div className="absolute inset-0 z-0 text-center">
          <SafeImage
            src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=2000"
            alt="Community"
            fill
            sizes="100vw"
            className="object-cover brightness-[0.3]"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-black" />
        </div>

        <div className="relative z-10 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-5xl font-black tracking-tighter text-white sm:text-7xl">
              REAL PEOPLE, <br />
              <span className="text-white/40 italic">REAL EXPERIENCES.</span>
            </h2>
            <p className="mx-auto mt-8 max-w-xl text-lg font-medium text-white/60">
              Join thousands of travelers discovering their India in a whole new way.
            </p>
            <div className="mt-12">
              <Link
                href="/discover"
                className="inline-flex h-16 items-center justify-center rounded-full bg-white px-12 text-sm font-bold uppercase tracking-widest text-black transition-all hover:scale-105 active:scale-95"
              >
                Start Exploring
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-20 text-center">
        <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">
          Beyond Routes &copy; 2026 • Made for India
        </div>
      </footer>
    </div>
  );
}
