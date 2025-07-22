"use client";

import Image from "next/image";
import sponsors from "@/lib/sponsors";

export default function SponsorsPage() {
  return (
    <main className="min-h-screen bg-black bg-gradient-to-b from-black via-gray-900 to-gray-950 py-16 px-4 flex flex-col items-center">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 text-center leading-tight">
          <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
            Sponsors
          </span>
        </h1>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto text-center">
          Huge thanks to our amazing sponsors for making the Marvel Creator Cup possible!
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 w-full max-w-6xl mx-auto">
          {sponsors.map((sponsor) => (
            <a
              key={sponsor.name}
              href={sponsor.link}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card rounded-2xl depth-2 p-8 flex flex-col items-center group transition-all duration-300 hover:scale-105 hover:border-yellow-400/60 border-2 border-white/10 shadow-lg hover:shadow-yellow-400/20 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <div className="relative mb-6">
                <Image
                  src={sponsor.image}
                  alt={sponsor.name}
                  width={120}
                  height={120}
                  className="rounded-full border-4 border-yellow-400 shadow-xl bg-white/80 object-cover"
                />
                <div className="absolute -inset-2 rounded-full pointer-events-none animate-pulse group-hover:animate-none group-hover:shadow-yellow-400/40" style={{boxShadow: '0 0 32px 8px #fde04733'}} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg group-hover:text-yellow-300 transition-colors duration-200 text-center">
                {sponsor.name}
              </h2>
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 text-black font-semibold rounded-full text-sm shadow-md group-hover:bg-yellow-400 group-hover:text-purple-900 transition-colors duration-200 mt-2">
                Visit Website
              </span>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
} 