import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import TopNav from "@/components/TopNav";
import "./globals.css";
import LenisClient from "@/components/LenisClient";
import AppProviders from "@/components/AppProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Beyond routes",
    template: "%s | Beyond routes",
  },
  description: "Discover India beyond Google Maps",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
    >
      <body className="min-h-screen flex flex-col text-foreground overflow-x-hidden selection:bg-primary/20">
        <AppProviders>
          <div className="fixed inset-0 z-[-1] pointer-events-none bg-[#050805]">
            <div 
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(circle at 50% -20%, rgba(34, 197, 94, 0.15) 0%, transparent 80%),
                  radial-gradient(circle at 0% 100%, rgba(34, 211, 238, 0.05) 0%, transparent 50%)
                `
              }}
            />
          </div>
          <LenisClient />
          <TopNav />
          <main className="relative flex-1">
            {children}
          </main>
        </AppProviders>
      </body>
    </html>
  );
}
