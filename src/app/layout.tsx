import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Marvel Creator Cup - BasimZB Tournament",
  description: "Join the ultimate Marvel Rivals tournament hosted by BasimZB on July 26, 2025. Compete for $2600 in prizes!",
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
        <link rel="icon" href="/icon/icon.png" type="image/png" sizes="any" />
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" 
          crossOrigin="anonymous" 
          referrerPolicy="no-referrer" 
        />
      </head>
      <body>
        <NavBar />

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
                  Join the competition on July 26, 2025!
                </p>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <Link href="/" className="block text-gray-400 hover:text-white transition-colors">
                    Home
                  </Link>
                  <Link href="/tournament-info" className="block text-gray-400 hover:text-white transition-colors">
                    Tournament Info
                  </Link>
                  <Link href="/tournament-bracket" className="block text-gray-400 hover:text-white transition-colors">
                    Bracket
                  </Link>
                  <Link href="/draft" className="block text-gray-400 hover:text-white transition-colors">
                    Draft
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

        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
