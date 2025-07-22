"use client";

import Image from "next/image";
import sponsors from "@/lib/sponsors";

export default function SponsorsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 py-16 px-4 flex flex-col items-center">
      <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 mb-8 drop-shadow-lg animate-pulse">Sponsors</h1>
      <p className="text-xl text-gray-200 mb-12 max-w-2xl text-center animate-fade-in">
        Huge thanks to our amazing sponsors for making the Marvel Creator Cup possible!
      </p>
     
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 w-full max-w-5xl">
          {sponsors.map((sponsor) => (
            <a
              key={sponsor.name}
              href={sponsor.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-white/10 via-purple-700/20 to-black/60 border-2 border-purple-400/30 hover:border-yellow-400/60"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/10 via-pink-500/10 to-purple-500/20 opacity-60 group-hover:opacity-80 transition-opacity duration-300 z-0" />
              <div className="relative z-10 flex flex-col items-center p-8">
                <Image
                  src={sponsor.image}
                  alt={sponsor.name}
                  width={120}
                  height={120}
                  className="rounded-full border-4 border-yellow-400 shadow-xl bg-white/80 mb-6 animate-float"
                />
                <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg group-hover:text-yellow-300 transition-colors duration-200">
                  {sponsor.name}
                </h2>
                <span className="inline-block px-4 py-2 bg-purple-800/80 text-yellow-200 rounded-full text-sm font-semibold shadow-md group-hover:bg-yellow-400 group-hover:text-purple-900 transition-colors duration-200">
                  Visit Website
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 animate-glow" />
            </a>
          ))}
        </div>
    </main>
  );
} 