"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Pacifico } from "next/font/google";
import logoImg from "../../public/logo.png";

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
});

const NavLink = ({ href, children }: { href: string; children: string }) => {
  return (
    <Link
      href={href}
      className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 transition-all hover:text-primary"
    >
      {children}
    </Link>
  );
};

export default function TopNav() {
  const { data: session, status } = useSession();
  
  const isAuth = status === "authenticated";
  const accountText = isAuth && session?.user?.name 
    ? session.user.name.split(" ")[0] 
    : "Sign In";
  const accountHref = isAuth ? "/profile" : "/auth/sign-in?callbackUrl=/profile";

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto w-full px-6 py-4">
        <div className="flex items-center justify-between gap-10 rounded-full border border-white/10 bg-black/40 px-8 py-3 backdrop-blur-3xl">
          <Link href="/" className="group flex items-center gap-2">
            <div className="relative h-12 w-12 transition-transform duration-500 group-hover:scale-105">
              <Image 
                src={logoImg}
                alt="Beyond Routes Logo" 
                fill 
                sizes="48px"
                className="object-contain drop-shadow-md" 
                priority
              />
            </div>
            <div className={`${pacifico.className} flex items-baseline gap-1.5`}>
               <span className="text-2xl text-[#2b4b2c] transition-colors duration-500 group-hover:text-[#386139]">Beyond</span>
               <span className="text-2xl text-[#df5522] transition-colors duration-500 group-hover:text-[#f46833]">Routes</span>
            </div>
          </Link>

          <nav className="hidden items-center sm:flex">
            <NavLink href="/discover">Discover</NavLink>
            <NavLink href="/itineraries">Plans</NavLink>
            <NavLink href="/bookings">Bookings</NavLink>
            <Link 
              href={accountHref}
              className="ml-4 flex items-center justify-center rounded-full bg-[#eab308] px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-black shadow-[0_5px_20px_rgba(234,179,8,0.3)] transition-all hover:scale-105 hover:bg-[#facc15]"
            >
              {accountText}
            </Link>
          </nav>

          <div className="flex items-center sm:hidden">
             <NavLink href="/discover">Explore</NavLink>
          </div>
        </div>
      </div>
    </header>
  );
}

