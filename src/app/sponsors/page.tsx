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
        <div className="max-w-3xl mx-auto mb-16">
          <div className="glass-card rounded-2xl depth-2 overflow-hidden flex flex-col items-center border-2 border-yellow-400/60 shadow-lg p-8">
            <Image
              src={sponsors[0].image}
              alt={sponsors[0].name}
              width={320}
              height={120}
              className="object-contain mb-6 drop-shadow-lg"
              style={{ background: '#111' }}
            />
            <h2 className="text-3xl font-bold text-yellow-300 mb-2 text-center drop-shadow-lg">
              {sponsors[0].name}
            </h2>
            <p className="text-lg text-gray-200 mb-4 text-center">
              {sponsors[0].description}
            </p>
            <a
              href={sponsors[0].link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 px-6 py-2 bg-yellow-400 text-black font-bold rounded-full shadow-lg hover:bg-yellow-300 transition-colors"
            >
              Visit DSB Media
            </a>
          </div>
        </div>
        <div className="max-w-2xl mx-auto mt-12">
          <div className="glass-card rounded-2xl overflow-hidden flex flex-col items-center border-2 border-white/10 shadow p-6 opacity-60">
            <Image
              src={sponsors[1].image}
              alt={sponsors[1].name}
              width={80}
              height={80}
              className="object-contain mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-300 mb-2 text-center">
              {sponsors[1].name}
            </h3>
            <p className="text-gray-400 text-center">
              {sponsors[1].description}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 