'use client'

import Link from 'next/link'
import { useTournamentBracket } from '../hooks/useTournamentBracket'

export default function Home() {
  const { bracketState, loading, error } = useTournamentBracket()

  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden h-[180svh] flex items-start pt-50 md:-mb-360">
        {/* Smooth gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 via-gray-800 to-gray-900 to-transparent h-[100%]"></div>
        
        {/* Subtle radial overlay for depth */}
        <div className="absolute inset-0 bg-radial-gradient from-white/5 via-transparent to-transparent h-[100%]"></div>
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                MARVEL
              </span>
              <br />
              <span className="bg-gradient-to-r from-gray-300 to-white bg-clip-text text-transparent">
                CREATOR CUP
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join the ultimate Marvel Rivals tournament hosted by BasimZB
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <Link 
                href="/tournament-info" 
                className="glass-button text-white px-10 py-5 rounded-xl font-semibold text-lg shadow-2xl hover:scale-105 transition-transform duration-300"
              >
                Tournament Info
              </Link>
              <Link 
                href="/draft" 
                className="glass-button text-white px-10 py-5 rounded-xl font-semibold text-lg shadow-2xl hover:scale-105 transition-transform duration-300"
              >
                Team Draft
              </Link>
            </div>
          </div>
        </div>
        
        {/* Smooth fade to next section */}
        <div className="absolute -bottom-20 left-0 right-0 h-96 bg-gradient-to-t from-black to-transparent"></div>
      </section>

      {/* Tournament Details */}
      <section className="relative pt-40 -mt-150 md:-mt-240">
        <div className="w-full bg-white text-black py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-20 lg:gap-40 items-center">
              {/* Number of Creators */}
              <div className="text-center">
                <div className="text-8xl md:text-9xl font-bold text-black mb-6">48</div>
                <p className="text-xl md:text-2xl text-black font-medium">Elite Marvel Rivals creators competing for glory in this epic tournament showdown.</p>
              </div>
              
              {/* Prize Pool for Winner */}
              <div className="text-center">
                <div className="text-8xl md:text-9xl font-bold text-black mb-6">$2000</div>
                <p className="text-xl md:text-2xl text-black font-medium">Grand prize awaits the ultimate champion who conquers all opponents.</p>
              </div>
              
              {/* Tournament Date */}
              <div className="text-center">
                <div className="text-8xl md:text-9xl font-bold text-black mb-6">07/26</div>
                <p className="text-xl md:text-2xl text-black font-medium">July 26, 2025 06:00PM EST marks the date when legends will be made and history will be written.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tournament Bracket Section */}
      <section className="py-25 relative bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Tournament Bracket</h2>
            <p className="text-xl text-gray-300 mb-6">
              Follow the tournament progress with our live bracket
            </p>
            {loading && (
              <div className="text-white text-lg">Loading tournament data...</div>
            )}
            {error && (
              <div className="text-gray-400 text-lg">Error loading tournament data: {error}</div>
            )}
            {bracketState && (
              <div className="text-sm text-gray-400 mb-4">
                <p>Tournament Status: {bracketState.tournament.status}</p>
                <p>Available Teams: {bracketState.groupStage.groups.reduce((total, group) => total + group.teams.length, 0)}</p>
                <p>Last Updated: {bracketState.tournament.lastUpdated ? new Date(bracketState.tournament.lastUpdated).toLocaleString() : 'N/A'}</p>
              </div>
            )}
          </div>
          
          {!loading && !error && bracketState && (bracketState.tournament.status === 'group_stage' || bracketState.tournament.status === 'final_stage') && (
            <div className="glass-card p-6 rounded-lg depth-2">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Tournament in Progress</h3>
                <p className="text-gray-300 mb-6">
                  The tournament is currently in the {bracketState.tournament.status === 'group_stage' ? 'group stage' : 'final stage'}.
                </p>
                <Link 
                  href="/tournament-bracket" 
                  className="glass-button text-white px-6 py-3 rounded-lg font-semibold"
                >
                  View Live Bracket
                </Link>
              </div>
            </div>
          )}
          
          {!loading && !error && (!bracketState || bracketState.tournament.status === 'pending') && (
            <div className="text-center py-12">
              <div className="glass-card p-8 rounded-lg depth-2 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-white mb-4">Tournament Not Started</h3>
                <p className="text-gray-300 mb-6">
                  The tournament bracket will appear here once the tournament has been initialized by an admin.
                </p>
                <div className="flex justify-center">
                  <Link 
                    href="/draft" 
                    className="glass-button text-white px-6 py-3 rounded-lg font-semibold"
                  >
                    Join the Draft
                  </Link>
                </div>
              </div>
            </div>
          )}
          
          <div className="text-center mt-22">
            <Link 
              href="/tournament-bracket" 
              className="glass-button text-white px-8 py-4 rounded-lg font-semibold text-lg"
            >
              View Full Bracket
            </Link>
          </div>
        </div>
      </section>

      {/* Host Section */}
      <section className="py-16 border-t-2 border-white/20 shadow-[0_0_15px_4px_rgba(255,255,255,0.1)]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Meet Your Host</h2>
          <div className="max-w-2xl mx-auto">
            <div className="glass-card p-8 rounded-lg depth-2">
              <h3 className="text-2xl font-bold text-white mb-4">BasimZB</h3>
              <p className="text-gray-300 mb-6">
                Join us for an epic Marvel Rivals tournament hosted by the legendary BasimZB! 
                Experience intense competition, amazing gameplay, and incredible prizes.
              </p>
              <a 
                href="https://www.twitch.tv/basimzb" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 glass-button text-white px-6 py-3 rounded-lg font-semibold"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                </svg>
                Watch on Twitch
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
