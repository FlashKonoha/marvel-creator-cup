'use client'

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 glass border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3 text-2xl font-bold text-white hover:text-gray-300 transition-colors">
              <Image src="/logo.png" alt="Marvel Creator Cup Logo" width={40} height={40} className="w-10 h-10 rounded-full glass-card" />
              <span>MARVEL CREATOR CUP</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/tournament-info" className="text-gray-400 hover:text-white transition-colors">
                Tournament Info
              </Link>
              <a href="https://challonge.com/BasimZBCreatorCup" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                Bracket
              </a>
              <Link href="/draft" className="text-gray-400 hover:text-white transition-colors">
                Draft
              </Link>
              <Link href="/sponsors" className="text-yellow-400 hover:text-white transition-colors font-bold animate-pulse">
                Sponsors
              </Link>
              <a 
                href="https://www.twitch.tv/basimzb" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                </svg>
                BasimZB
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                className="text-gray-400 hover:text-white focus:outline-none"
                aria-label="Open menu"
                onClick={() => setMobileMenuOpen(true)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-end md:hidden">
          <div className="w-64 bg-[#111] h-full shadow-lg p-6 flex flex-col">
            <button
              className="self-end text-gray-400 hover:text-white mb-8 focus:outline-none"
              aria-label="Close menu"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Link href="/" className="text-gray-200 hover:text-white text-lg mb-6" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link href="/tournament-info" className="text-gray-200 hover:text-white text-lg mb-6" onClick={() => setMobileMenuOpen(false)}>
              Tournament Info
            </Link>
            <a href="https://challonge.com/BasimZBCreatorCup" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-white text-lg mb-6">
              Bracket
            </a>
            <Link href="/draft" className="text-gray-200 hover:text-white text-lg mb-6" onClick={() => setMobileMenuOpen(false)}>
              Draft
            </Link>
            <Link href="/sponsors" className="text-yellow-400 hover:text-white text-lg mb-6 font-bold animate-pulse" onClick={() => setMobileMenuOpen(false)}>
              Sponsors
            </Link>
            <a 
              href="https://www.twitch.tv/basimzb" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 text-lg flex items-center gap-2 mt-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
              </svg>
              BasimZB
            </a>
          </div>
          {/* Clickable overlay to close menu */}
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
} 