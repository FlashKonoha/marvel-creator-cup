import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

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
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" 
          crossOrigin="anonymous" 
          referrerPolicy="no-referrer" 
        />
      </head>
      <body>
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
                <Link href="/tournament-bracket" className="text-gray-400 hover:text-white transition-colors">
                  Bracket
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
                <button className="text-gray-400 hover:text-white">
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
        <footer className="glass border-t border-white/10 py-8">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Image src="/logo.png" alt="Marvel Creator Cup Logo" width={32} height={32} className="w-8 h-8 rounded-full glass-card" />
                  <h3 className="text-white font-bold text-lg">Marvel Creator Cup</h3>
                </div>
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
                    className="block text-white hover:text-gray-300 text-sm transition-colors"
                  >
                    Watch on Twitch
                  </a>
                  <p className="text-gray-400 text-sm">
                    basimzb@outlook.com
                  </p>
                </div>
              </div>
            </div>
            <div className="border-t border-white/10 mt-8 pt-8 text-center">
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
