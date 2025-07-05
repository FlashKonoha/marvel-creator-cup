'use client'

import Link from 'next/link'
import TournamentBracket from '../components/TournamentBracket'
import { useTeams } from '../hooks/useTeams'
import { createTournamentBracket } from '../lib/tournamentUtils'

export default function Home() {
  const { teams, loading, error } = useTeams()
  
  // Transform teams data into bracket format
  const bracketData = createTournamentBracket(teams)

  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            <span className="text-blue-400">MARVEL</span> CREATOR CUP
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join the ultimate Marvel Rivals tournament hosted by BasimZB
          </p>
          <div className="flex justify-center items-center gap-4">
            <Link 
              href="/tournament-info" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Tournament Info
            </Link>
            <Link 
              href="/draft" 
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Team Draft
            </Link>
          </div>
        </div>
      </section>

      {/* Tournament Details */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Tournament Details</h2>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-lg"><strong>Date:</strong> July 25, 2025</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-lg"><strong>Host:</strong> BasimZB</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-lg"><strong>Game:</strong> Marvel Rivals</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-lg"><strong>Format:</strong> BO3 Winners/Losers Bracket</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-lg"><strong>Teams:</strong> 6-8 Teams</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-lg"><strong>Draft:</strong> July 18, 2025 (Team Selection)</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-4">Prize Pool</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-yellow-400">🥇 1st Place</span>
                  <span className="text-white font-bold">$2000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">🥈 2nd Place</span>
                  <span className="text-white font-bold">$250</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-amber-400">🥉 3rd Place</span>
                  <span className="text-white font-bold">$100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tournament Bracket Section */}
      <section className="py-16 bg-black">
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
              <div className="text-red-400 text-lg">Error loading tournament data: {error}</div>
            )}
            {teams.length > 0 && (
              <div className="text-sm text-gray-400 mb-4">
                <p>Registered Teams: {teams.length}</p>
                <p>Status: Registration Open</p>
              </div>
            )}
          </div>
          
          {!loading && !error && teams.length > 0 && (
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
              <TournamentBracket 
                upperBracket={bracketData.upperBracket}
                lowerBracket={bracketData.lowerBracket}
              />
            </div>
          )}
          
          {!loading && !error && teams.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-white mb-4">No Teams Registered Yet</h3>
                <p className="text-gray-300 mb-6">
                  The tournament bracket will appear here once teams start registering for the tournament.
                </p>
                <Link 
                  href="/draft" 
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Join the Draft
                </Link>
              </div>
            </div>
          )}
          
          <div className="text-center mt-8">
            <Link 
              href="/tournament-bracket" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              View Full Bracket
            </Link>
          </div>
        </div>
      </section>

      {/* Host Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Meet Your Host</h2>
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-4">BasimZB</h3>
              <p className="text-gray-300 mb-6">
                Join us for an epic Marvel Rivals tournament hosted by the legendary BasimZB! 
                Experience intense competition, amazing gameplay, and incredible prizes.
              </p>
              <a 
                href="https://www.twitch.tv/basimzb" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
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

      {/* CTA Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Tournament Information</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Get all the details about the ultimate Marvel Rivals tournament!
          </p>
          <Link 
            href="/tournament-info" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-lg font-bold text-xl transition-colors"
          >
            View Tournament Details
          </Link>
        </div>
      </section>
    </main>
  )
}
