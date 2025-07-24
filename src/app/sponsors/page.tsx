"use client";

import Image from "next/image";
import sponsors from "@/lib/sponsors";

export default function SponsorsPage() {
  const dsb = sponsors[0];
  const partner = sponsors[1];
  return (
    <main className="min-h-screen bg-black bg-gradient-to-b from-black via-gray-900 to-gray-950 py-16 px-4 flex flex-col items-center">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-12 md:mb-24 text-left leading-tight">
          Sponsors
        </h1>
        {/* DSB Media Section - Minimal, Monotone, Large Logo with Solid Black Background */}
        <section className="max-w-5xl mx-auto flex flex-col md:flex-row items-stretch gap-10 mb-16 md:mb-24">
          {/* Left: Large Logo with Solid Black Background */}
          <div className="flex-shrink-0 flex items-center justify-center md:justify-start w-full md:w-[340px] md:h-auto relative">
            <div className="w-full md:w-[340px] h-[180px] md:h-full flex items-center justify-center relative">
              {/* Solid black background */}
              <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{ background: 'black' }}
              />
              <Image
                src={dsb.image}
                alt={dsb.name}
                fill={false}
                width={0}
                height={0}
                sizes="100vw"
                className="object-contain w-full h-full max-h-[340px] md:max-h-none md:h-full md:w-full z-10"
                style={{ aspectRatio: '1/1', minHeight: '180px', minWidth: '180px' }}
                priority
              />
            </div>
          </div>
          {/* Right: Description & Stats */}
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {dsb.name}
            </h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              {dsb.description}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="flex flex-col items-start">
                <span className="text-2xl font-extrabold text-white">$2.2M+</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Earned for Creators</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-2xl font-extrabold text-white">1,500+</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Creators</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-2xl font-extrabold text-white">8.5M+</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Followers Gained</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-2xl font-extrabold text-white">10,000+</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Streams</span>
              </div>
            </div>
            <a
              href={dsb.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-8 px-6 py-2 bg-white text-black font-semibold rounded shadow hover:bg-gray-200 transition-colors text-base"
            >
              Visit DSB Media
            </a>
          </div>
        </section>
        {/* BasimZB Quote Section - Emphasized */}
        <section className="w-screen relative left-1/2 right-1/2 -mx-[50vw] px-0 bg-white py-16 flex justify-center items-center md:mb-24">
          <div className="w-full max-w-5xl mx-auto flex flex-col items-center px-4">
            {/* Large quote icon */}
            <svg className="w-16 h-16 md:w-24 md:h-24 text-gray-900 mb-8 self-start" fill="none" viewBox="0 0 64 64" aria-hidden="true">
              <path d="M16 32c0-8.837 7.163-16 16-16v8c-4.418 0-8 3.582-8 8h8v16H16V32zm24 0c0-8.837 7.163-16 16-16v8c-4.418 0-8 3.582-8 8h8v16H40V32z" fill="currentColor"/>
            </svg>
            <blockquote className="text-3xl md:text-5xl font-extrabold italic text-gray-700 mb-10 leading-tight text-left md:pl-5 max-w-5xl">
              DSB Media has been instrumental in elevating the Marvel Creator Cup. Their support and expertise empower creators to reach new heights.
            </blockquote>
            <div className="flex items-center justify-start gap-4 mt-2 w-full md:pl-5">
              <Image
                src="/logo.png"
                alt="BasimZB Logo"
                width={48}
                height={48}
                className="rounded-full bg-black border border-gray-700"
              />
              <div className="text-left">
                <span className="block text-xl font-bold text-gray-600">BasimZB</span>
                <span className="block text-base text-gray-500">Host and Organizer, Marvel Creator Cup</span>
              </div>
            </div>
          </div>
        </section>
        {/* Production Partner Placeholder - Minimal */}
        <section className="max-w-2xl mx-auto flex flex-col items-start mt-8">
          <div className="flex items-center mb-2">
            <Image
              src={partner.image}
              alt={partner.name}
              width={40}
              height={40}
              className="object-contain mr-3 bg-[#111] rounded"
            />
            <h3 className="text-lg font-semibold text-gray-300">
              {partner.name}
            </h3>
          </div>
          <p className="text-gray-500 text-base">
            {partner.description}
          </p>
        </section>
      </div>
    </main>
  );
} 