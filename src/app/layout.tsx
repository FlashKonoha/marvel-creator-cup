import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Marvel Creator Cup - BasimZB Tournament",
  description: "Join the ultimate Marvel Rivals tournament hosted by BasimZB on July 25, 2025. Compete for $2350 in prizes!",
  keywords: "Marvel Rivals, tournament, BasimZB, gaming, esports, competition",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Navigation Header */}
        <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
                MARVEL CREATOR CUP
              </Link>
              
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
                <Link href="/tournament-info" className="text-gray-300 hover:text-white transition-colors">
                  Tournament Info
                </Link>
                <a 
                  href="https://www.twitch.tv/basimzb" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                  </svg>
                  BasimZB
                </a>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button className="text-gray-300 hover:text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {children}

        {/* Footer */}
        <footer className="bg-black border-t border-gray-800 py-8">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-white font-bold text-lg mb-4">Marvel Creator Cup</h3>
                <p className="text-gray-400 text-sm">
                  The ultimate Marvel Rivals tournament hosted by BasimZB. 
                  Join the competition on July 25, 2025!
                </p>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <Link href="/" className="block text-gray-400 hover:text-white text-sm transition-colors">
                    Home
                  </Link>
                  <Link href="/tournament-info" className="block text-gray-400 hover:text-white text-sm transition-colors">
                    Tournament Info
                  </Link>
                </div>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-4">Connect</h3>
                <div className="space-y-2">
                  <a 
                    href="https://www.twitch.tv/basimzb" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-purple-400 hover:text-purple-300 text-sm transition-colors"
                  >
                    Watch on Twitch
                  </a>
                  <p className="text-gray-400 text-sm">
                    tournament@marvelcreatorcup.com
                  </p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center">
              <p className="text-gray-400 text-sm">
                © 2025 Marvel Creator Cup. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
