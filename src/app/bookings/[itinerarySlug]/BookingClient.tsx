"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import SafeImage from "@/components/ui/SafeImage";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import type { Itinerary } from "@/lib/itineraries";

const SLOTS = [
  { label: "10:00 AM", start: "10:00", end: "11:30" },
  { label: "12:30 PM", start: "12:30", end: "14:00" },
  { label: "4:00 PM", start: "16:00", end: "17:30" },
  { label: "7:00 PM", start: "19:00", end: "20:30" },
];

function formatINR(n: number) {
  return n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export default function BookingClient({
  itinerary,
  heroImage,
}: {
  itinerary: Itinerary;
  heroImage: string;
}) {
  const router = useRouter();
  const { status } = useSession();

  const [dateISO, setDateISO] = useState(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlotStart, setSelectedSlotStart] = useState<string>(SLOTS[0].start);
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  
  // Custom Flow States
  const [showQR, setShowQR] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const selectedSlot = useMemo(() => {
    const s = SLOTS.find((x) => x.start === selectedSlotStart) ?? SLOTS[0];
    return s;
  }, [selectedSlotStart]);

  const refreshAvailability = async () => {
    const entries = await Promise.all(
      SLOTS.map(async (slot) => {
        const slotStartISO = `${dateISO}T${slot.start}`;
        const r = await fetch(
          `/api/availability?itinerarySlug=${encodeURIComponent(
            itinerary.slug
          )}&dateISO=${encodeURIComponent(dateISO)}&slotStartISO=${encodeURIComponent(
            slotStartISO
          )}`
        );
        const data = await r.json();
        return [slot.start, Boolean(data.available)] as const;
      })
    );
    setAvailability(Object.fromEntries(entries));
  };

  useEffect(() => {
    if (status !== "authenticated") return;
    refreshAvailability().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, dateISO, itinerary.slug]);

  const handleManualBooking = async () => {
    setError(null);
    setLoading(true);
    try {
      const slotStartISO = `${dateISO}T${selectedSlot.start}`;
      const slotEndISO = `${dateISO}T${selectedSlot.end}`;

      const createRes = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itinerarySlug: itinerary.slug,
          dateISO,
          slotStartISO,
          slotEndISO,
          seats: 1,
        }),
      });
      
      if (!createRes.ok) {
        const createData = await createRes.json();
        throw new Error(createData?.error ?? "Booking failed");
      }
      
      setShowQR(false);
      setShowSuccessToast(true);
      await refreshAvailability();
      
      // Auto Hide Toast
      setTimeout(() => {
        setShowSuccessToast(false);
        router.push("/bookings");
      }, 3000);
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto w-full max-w-5xl px-6 pb-24 pt-56">
        <div className="group relative overflow-hidden rounded-[3rem] border border-white/5 bg-white/[0.02] p-8 backdrop-blur-3xl sm:p-12">
          <div className="relative mb-12 aspect-21/9 w-full overflow-hidden rounded-[2.5rem] border border-white/5 shadow-2xl">
            <SafeImage
              src={heroImage}
              alt={itinerary.title}
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#050805] via-black/20 to-transparent opacity-60" />
          </div>

          <div className="absolute inset-0 opacity-80 pointer-events-none">
            <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl opacity-50" />
            <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl opacity-50" />
          </div>

          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-6 border-b border-white/5 pb-12">
              <button
                type="button"
                onClick={() => router.push("/itineraries")}
                className="rounded-full border border-white/5 bg-white/5 px-6 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-white backdrop-blur transition-all hover:bg-white/10"
              >
                ← Back to plans
              </button>

              <div className="rounded-full border border-white/5 bg-white/5 px-6 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-white/50">
                Bundle cost:{" "}
                <span className="font-bold text-primary">
                  ₹{formatINR(itinerary.priceMinINR)}+
                </span>
              </div>
            </div>

            <div className="mt-12">
              <h1 className="text-3xl font-black tracking-tighter text-white sm:text-5xl lg:text-6xl">
                {itinerary.title}
              </h1>
              <p className="mt-6 max-w-3xl text-[13px] leading-relaxed text-white/50 font-medium sm:text-base">
                Secure your slot for this cinematic 3-hour experience. Our one-click UPI checkout ensures a seamless reservation process.
              </p>
            </div>

            <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_400px]">
              <section className="rounded-[2.5rem] border border-white/5 bg-white/[0.04] p-8 backdrop-blur-3xl">
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                  <span className="h-[2px] w-4 bg-primary/30" />
                  Pick a date
                </div>
                <div className="mt-6 relative">
                  <input
                    type="date"
                    value={dateISO}
                    onChange={(e) => {
                      setDateISO(e.target.value);
                      setAvailability({});
                    }}
                    className="w-full rounded-[1.5rem] border border-white/5 bg-white/5 px-6 py-4 text-sm font-bold text-white outline-none ring-0 focus:border-primary/50 focus:bg-white/10 transition-all cursor-pointer box-border"
                  />
                </div>

                <div className="mt-12 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                  <span className="h-[2px] w-4 bg-primary/30" />
                  Available slots
                </div>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {SLOTS.map((slot) => {
                    const available = availability[slot.start] ?? (loading ? false : true);
                    const on = selectedSlotStart === slot.start;
                    return (
                      <button
                        key={slot.start}
                        type="button"
                        disabled={!available}
                        onClick={() => {
                           if (available) setSelectedSlotStart(slot.start)
                        }}
                        className={`relative flex items-center justify-between gap-4 rounded-2xl border px-6 py-5 transition-all duration-300 ${
                          on
                            ? "border-primary/50 bg-primary/10 text-white"
                            : available
                              ? "border-white/5 bg-white/5 text-white/70 hover:bg-white/10"
                              : "border-white/5 bg-white/[0.02] text-white/20 opacity-50 cursor-not-allowed"
                        }`}
                      >
                        <span className="text-sm font-black tracking-tight">{slot.label}</span>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${on ? "text-primary" : available ? "text-accent/50" : "text-white/20"}`}>
                          {available ? "Available" : "Booked"}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-10 rounded-2xl bg-white/[0.02] p-5 text-[11px] font-medium leading-relaxed text-white/20 border border-white/5 italic">
                  * Slot availability is updated in real-time. Selecting a slot reserves it temporarily during the checkout process.
                </div>
              </section>

              <aside className="flex flex-col gap-6">
                <div className="rounded-[2.5rem] border border-white/5 bg-white/[0.04] p-8 backdrop-blur-3xl">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Reservation Summary</div>
                  <div className="mt-8 flex flex-col gap-4">
                    <div className="rounded-2xl border border-white/5 bg-white/5 p-6">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Selected Slot</div>
                      <div className="mt-4 text-lg font-black tracking-tight text-white">
                        {selectedSlot.label}
                      </div>
                      <div className="mt-2 text-xs font-bold text-primary italic">
                        {new Date(dateISO).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-white/5 p-6">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Payment Method</div>
                      <div className="mt-4 text-xs font-bold text-white/70">
                        Google Pay / PhonePe / BHIM UPI
                      </div>
                      <div className="mt-2 text-[9px] font-black uppercase tracking-widest text-[#2de1fc]/50">
                        Standard Merchant Rates Apply
                      </div>
                    </div>
                  </div>

                  <div className="mt-12">
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => {
                        if (status !== "authenticated") {
                          router.push(`/auth/sign-in?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
                        } else {
                          setShowQR(true);
                        }
                      }}
                      className="w-full h-16 flex items-center justify-center rounded-full bg-primary text-[11px] font-black uppercase tracking-[0.2em] text-black shadow-[0_15px_40px_rgba(234,179,8,0.2)] transition-all hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(234,179,8,0.35)] disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
                    >
                      {loading ? "Initializing..." : status !== "authenticated" ? "Sign In to Book" : "Book with UPI (one-click)"}
                    </button>
                    
                    {error ? (
                      <p className="mt-4 text-center text-xs font-bold text-red-500/80 tracking-wide">
                        {error}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="px-6 text-[10px] font-medium leading-relaxed text-white/20 italic">
                  * Cancellation policy: Full refund up to 24 hours before your slot. By booking, you agree to our terms.
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>

      {/* Custom UPI Payment Workflow */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="relative w-full max-w-[420px] overflow-hidden rounded-[3rem] border border-white/5 bg-[#0a0c0a] shadow-2xl"
            >
              <div className="absolute inset-0 bg-linear-to-b from-primary/10 to-transparent opacity-20 pointer-events-none" />
              <div className="relative p-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                
                <h3 className="mt-6 text-2xl font-black text-white tracking-tight">Complete Payment</h3>
                <p className="mt-3 text-sm text-white/50 leading-relaxed font-medium">Scan the QR code below or tap to pay directly via any UPI app on your phone.</p>

                <div className="mx-auto mt-8 flex aspect-square w-56 items-center justify-center overflow-hidden rounded-3xl bg-white p-4 shadow-[0_10px_30px_rgba(234,179,8,0.15)] relative">
                    <Image src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=1&data=upi%3A%2F%2Fpay%3Fpa%3D9654574335%40pthdfc%26pn%3DBeyondRoutes%26cu%3DINR`} width={200} height={200} alt="UPI QR Code" />
                </div>

                <div className="mt-6">
                    <p className="text-xs font-bold text-white/30 uppercase tracking-widest">
                       Verify UPI ID
                       <br/><span className="text-primary mt-1 inline-block text-sm lowercase tracking-normal">9654574335@pthdfc</span>
                    </p>
                </div>

                <div className="mt-10 flex flex-col gap-4">
                  <a href="upi://pay?pa=9654574335@pthdfc&pn=BeyondRoutes&cu=INR" className="flex w-full h-14 items-center justify-center rounded-full border border-primary/20 bg-primary/5 text-[11px] font-black uppercase tracking-wider text-primary transition-all hover:bg-primary/20 md:hidden">
                    Pay via UPI App →
                  </a>
                  <button 
                    disabled={loading}
                    onClick={handleManualBooking} 
                    className="w-full h-14 flex items-center justify-center rounded-full bg-primary text-[11px] font-black uppercase tracking-[0.2em] text-black transition-all hover:scale-[1.02] disabled:opacity-50"
                  >
                    {loading ? "Confirming..." : "Done (Payment Completed)"}
                  </button>
                  <button onClick={() => setShowQR(false)} className="mt-2 text-[10px] font-bold uppercase tracking-widest text-white/20 transition-all hover:text-white/60">
                     Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: 20, scale: 0.95, x: "-50%" }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed bottom-12 left-1/2 z-[100] flex min-w-[320px] items-center gap-5 rounded-full border border-primary/30 bg-[#0a0c0a]/95 px-6 py-4 shadow-[0_20px_50px_rgba(234,179,8,0.3)] backdrop-blur-xl"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-black">
               <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
               </svg>
            </div>
            <div className="pr-4">
               <p className="text-[13px] font-black uppercase tracking-wider text-white">Booking Confirmed</p>
               <p className="text-xs font-medium text-white/60 mt-0.5">Slot booked for {itinerary.title}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
