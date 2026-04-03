import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectToDb } from "@/lib/db";
import { Booking } from "@/lib/models/Booking";
import { itineraries, generateDynamicItinerary } from "@/lib/itineraries";
import { normalizeHiddenGems } from "@/lib/hidden-gems/normalizeHiddenGems";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function BookingsDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/sign-in?callbackUrl=/bookings");
  }

  const userId = (session.user as any).id;

  await connectToDb();
  
  // Fetch all user bookings and sort by the most recent first
  const userBookings = await Booking.find({ userId })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="flex min-h-screen w-full flex-col px-4 pt-32 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 h-[60vh] w-[60vh] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="z-10 w-full max-w-5xl mx-auto">
        <h1 className="text-4xl font-black tracking-tighter text-white">Your Bookings</h1>
        <p className="mt-4 text-sm font-medium leading-relaxed text-white/50 max-w-2xl">
          Review your upcoming cinematic experiences and past adventures. Each reservation is tailored specifically for you.
        </p>

        <div className="mt-16 space-y-8">
          {userBookings.length === 0 ? (
            <div className="rounded-[3rem] border border-white/5 bg-white/[0.02] p-12 text-center backdrop-blur-3xl shadow-xl">
               <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
                 <svg className="h-6 w-6 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                 </svg>
               </div>
               <h3 className="mt-6 text-lg font-black text-white tracking-tight">No Bookings Yet</h3>
               <p className="mt-3 text-sm text-white/40 max-w-sm mx-auto">You haven't made any reservations yet. Discover the hidden gems of India to get started.</p>
               <a href="/discover" className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-[11px] font-black uppercase tracking-[0.2em] text-black transition-all hover:scale-105">
                 Explore Now
               </a>
            </div>
          ) : (
            userBookings.map((bk: any) => {
              let itinerary = itineraries.find(i => i.slug === bk.itinerarySlug);
              if (!itinerary && bk.itinerarySlug.endsWith("-bundle")) {
                const gemSlug = bk.itinerarySlug.replace("-bundle", "");
                const gem = normalizeHiddenGems().find(p => p.slug === gemSlug);
                if (gem) {
                  itinerary = generateDynamicItinerary(gem);
                  itinerary.image = gem.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200";
                }
              }
              if (!itinerary) return null;

              const dt = new Date(bk.dateISO);
              const formattedDate = dt.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
              const isConfirmed = bk.status === "confirmed" || bk.status === "pending_payment"; // Using pending_payment as confirmed for mock flow

              return (
                <div key={bk._id.toString()} className="group relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-md shadow-2xl transition-all hover:bg-white/[0.04] hover:border-white/10">
                  <div className="grid md:grid-cols-[280px_1fr] gap-6">
                    <div className="relative aspect-[4/3] md:aspect-auto md:h-full w-full overflow-hidden sm:rounded-l-[2.5rem]">
                       <Image src={itinerary.image ?? "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&q=80&w=800"} alt={itinerary.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                       <div className="absolute inset-0 bg-linear-to-r from-black/40 to-transparent" />
                       <div className="absolute top-4 left-4 rounded-full bg-black/60 px-4 py-2 backdrop-blur-md text-[9px] font-black uppercase tracking-widest text-primary border border-white/10">
                         {isConfirmed ? "Confirmed" : "Processing"}
                       </div>
                    </div>
                    
                    <div className="flex flex-col justify-between p-8 md:p-10 md:pl-4">
                      <div>
                        <h2 className="text-2xl font-black text-white tracking-tight">{itinerary.title}</h2>
                        <div className="mt-5 grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:gap-8">
                           <div>
                             <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Date</p>
                             <p className="mt-2 text-sm font-bold text-white/90">{formattedDate}</p>
                           </div>
                           <div>
                             <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Time Slot</p>
                             <p className="mt-2 text-sm font-bold text-white/90">{bk.slotStartISO.split('T')[1]} - {bk.slotEndISO.split('T')[1]}</p>
                           </div>
                           <div>
                             <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Total Paid</p>
                             <p className="mt-2 text-sm font-bold text-primary">₹{(bk.amountINR).toLocaleString("en-IN")}</p>
                           </div>
                        </div>
                      </div>

                      <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
                        <div className="text-[11px] font-medium text-white/40">
                           Booking ID: <span className="font-mono text-white/60 ml-2">{bk._id.toString()}</span>
                        </div>
                        <a href={`/itineraries/${itinerary.slug}`} className="text-xs font-bold text-primary hover:text-white transition-colors">
                          View Details →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
