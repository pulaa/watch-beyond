"use client";
import { Navbar } from "./navbar";
import { Spotlight } from "./spotlight-new";

export function HeroHighlightSection() {
  return (
    <div className=" h-[40rem] w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight />
      <div className="flex flex-col items-center justify-center h-full w-full px-4">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          Watch Beyond Borders with a VPN.
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
          Find where movies and TV shows are available across countries — and
          connect with a VPN to start watching.
        </p>
        <Navbar />
      </div>
    </div>
  );
}
