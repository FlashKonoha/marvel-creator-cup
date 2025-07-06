'use client'

import Link from 'next/link'
import TournamentBracket from '../components/TournamentBracket'
import { useTournamentBracket, TournamentState } from '../hooks/useTournamentBracket'
import { useTeams } from '../hooks/useTeams'

export default function Home() {
  const { bracketState, loading, error } = useTournamentBracket()
  const { teams } = useTeams()
  
  // Transform bracket state into the format expected by TournamentBracket component
  const isTeam = (obj: unknown): obj is { id: number|string, name: string, image: string } => {
    return !!obj && typeof obj === 'object' && 'name' in obj && 'image' in obj;
  };
  const transformBracketData = (state: TournamentState | null) => {
    if (!state) return { upperBracket: [], lowerBracket: [] };

    const upperBracket = [
      {
        label: 'Upper Quarterfinals',
        matches: state.brackets.upper.quarterfinals.map((match) => ({
          id: match.id,
          title: `${isTeam(match.team1) ? match.team1.name : 'TBD'} vs ${isTeam(match.team2) ? match.team2.name : 'TBD'}`,
          href: `/match/${match.id}`,
          team1: {
            id: isTeam(match.team1) ? match.team1.id?.toString() : 'tbd',
            name: isTeam(match.team1) ? match.team1.name : 'TBD',
            logo: isTeam(match.team1) ? match.team1.image : 'https://picsum.photos/200/200',
            score: match.team1Score,
            isWinner: match.winner === match.team1,
            isLoser: match.loser === match.team1
          },
          team2: {
            id: isTeam(match.team2) ? match.team2.id?.toString() : 'tbd',
            name: isTeam(match.team2) ? match.team2.name : 'TBD',
            logo: isTeam(match.team2) ? match.team2.image : 'https://picsum.photos/200/200',
            score: match.team2Score,
            isWinner: match.winner === match.team2,
            isLoser: match.loser === match.team2
          },
          time: match.status === 'completed' ? 'Completed' : 'TBD',
          hasVideo: false
        }))
      },
      {
        label: 'Upper Semifinals',
        matches: state.brackets.upper.semifinals.map((match) => ({
          id: match.id,
          title: `${isTeam(match.team1) ? match.team1.name : 'TBD'} vs ${isTeam(match.team2) ? match.team2.name : 'TBD'}`,
          href: `/match/${match.id}`,
          team1: {
            id: isTeam(match.team1) ? match.team1.id?.toString() : 'tbd',
            name: isTeam(match.team1) ? match.team1.name : 'TBD',
            logo: isTeam(match.team1) ? match.team1.image : 'https://picsum.photos/200/200',
            score: match.team1Score,
            isWinner: match.winner === match.team1,
            isLoser: match.loser === match.team1
          },
          team2: {
            id: isTeam(match.team2) ? match.team2.id?.toString() : 'tbd',
            name: isTeam(match.team2) ? match.team2.name : 'TBD',
            logo: isTeam(match.team2) ? match.team2.image : 'https://picsum.photos/200/200',
            score: match.team2Score,
            isWinner: match.winner === match.team2,
            isLoser: match.loser === match.team2
          },
          time: match.status === 'completed' ? 'Completed' : 'TBD',
          hasVideo: false
        }))
      },
      {
        label: 'Upper Final',
        matches: state.brackets.upper.final.map((match) => ({
          id: match.id,
          title: `${isTeam(match.team1) ? match.team1.name : 'TBD'} vs ${isTeam(match.team2) ? match.team2.name : 'TBD'}`,
          href: `/match/${match.id}`,
          team1: {
            id: isTeam(match.team1) ? match.team1.id?.toString() : 'tbd',
            name: isTeam(match.team1) ? match.team1.name : 'TBD',
            logo: isTeam(match.team1) ? match.team1.image : 'https://picsum.photos/200/200',
            score: match.team1Score,
            isWinner: match.winner === match.team1,
            isLoser: match.loser === match.team1
          },
          team2: {
            id: isTeam(match.team2) ? match.team2.id?.toString() : 'tbd',
            name: isTeam(match.team2) ? match.team2.name : 'TBD',
            logo: isTeam(match.team2) ? match.team2.image : 'https://picsum.photos/200/200',
            score: match.team2Score,
            isWinner: match.winner === match.team2,
            isLoser: match.loser === match.team2
          },
          time: match.status === 'completed' ? 'Completed' : 'TBD',
          hasVideo: false
        }))
      }
    ];

    const lowerBracket = [
      {
        label: 'Lower Round 1',
        matches: state.brackets.lower.round1.map((match) => ({
          id: match.id,
          title: `${isTeam(match.team1) ? match.team1.name : 'TBD'} vs ${isTeam(match.team2) ? match.team2.name : 'TBD'}`,
          href: `/match/${match.id}`,
          team1: {
            id: isTeam(match.team1) ? match.team1.id?.toString() : 'tbd',
            name: isTeam(match.team1) ? match.team1.name : 'TBD',
            logo: isTeam(match.team1) ? match.team1.image : 'https://picsum.photos/200/200',
            score: match.team1Score,
            isWinner: match.winner === match.team1,
            isLoser: match.loser === match.team1
          },
          team2: {
            id: isTeam(match.team2) ? match.team2.id?.toString() : 'tbd',
            name: isTeam(match.team2) ? match.team2.name : 'TBD',
            logo: isTeam(match.team2) ? match.team2.image : 'https://picsum.photos/200/200',
            score: match.team2Score,
            isWinner: match.winner === match.team2,
            isLoser: match.loser === match.team2
          },
          time: match.status === 'completed' ? 'Completed' : 'TBD',
          hasVideo: false
        }))
      },
      {
        label: 'Lower Round 2',
        matches: state.brackets.lower.round2.map((match) => ({
          id: match.id,
          title: `${isTeam(match.team1) ? match.team1.name : 'TBD'} vs ${isTeam(match.team2) ? match.team2.name : 'TBD'}`,
          href: `/match/${match.id}`,
          team1: {
            id: isTeam(match.team1) ? match.team1.id?.toString() : 'tbd',
            name: isTeam(match.team1) ? match.team1.name : 'TBD',
            logo: isTeam(match.team1) ? match.team1.image : 'https://picsum.photos/200/200',
            score: match.team1Score,
            isWinner: match.winner === match.team1,
            isLoser: match.loser === match.team1
          },
          team2: {
            id: isTeam(match.team2) ? match.team2.id?.toString() : 'tbd',
            name: isTeam(match.team2) ? match.team2.name : 'TBD',
            logo: isTeam(match.team2) ? match.team2.image : 'https://picsum.photos/200/200',
            score: match.team2Score,
            isWinner: match.winner === match.team2,
            isLoser: match.loser === match.team2
          },
          time: match.status === 'completed' ? 'Completed' : 'TBD',
          hasVideo: false
        }))
      },
      {
        label: 'Lower Round 3',
        matches: state.brackets.lower.round3.map((match) => ({
          id: match.id,
          title: `${isTeam(match.team1) ? match.team1.name : 'TBD'} vs ${isTeam(match.team2) ? match.team2.name : 'TBD'}`,
          href: `/match/${match.id}`,
          team1: {
            id: isTeam(match.team1) ? match.team1.id?.toString() : 'tbd',
            name: isTeam(match.team1) ? match.team1.name : 'TBD',
            logo: isTeam(match.team1) ? match.team1.image : 'https://picsum.photos/200/200',
            score: match.team1Score,
            isWinner: match.winner === match.team1,
            isLoser: match.loser === match.team1
          },
          team2: {
            id: isTeam(match.team2) ? match.team2.id?.toString() : 'tbd',
            name: isTeam(match.team2) ? match.team2.name : 'TBD',
            logo: isTeam(match.team2) ? match.team2.image : 'https://picsum.photos/200/200',
            score: match.team2Score,
            isWinner: match.winner === match.team2,
            isLoser: match.loser === match.team2
          },
          time: match.status === 'completed' ? 'Completed' : 'TBD',
          hasVideo: false
        }))
      },
      {
        label: 'Lower Final',
        matches: state.brackets.lower.final.map((match) => ({
          id: match.id,
          title: `${isTeam(match.team1) ? match.team1.name : 'TBD'} vs ${isTeam(match.team2) ? match.team2.name : 'TBD'}`,
          href: `/match/${match.id}`,
          team1: {
            id: isTeam(match.team1) ? match.team1.id?.toString() : 'tbd',
            name: isTeam(match.team1) ? match.team1.name : 'TBD',
            logo: isTeam(match.team1) ? match.team1.image : 'https://picsum.photos/200/200',
            score: match.team1Score,
            isWinner: match.winner === match.team1,
            isLoser: match.loser === match.team1
          },
          team2: {
            id: isTeam(match.team2) ? match.team2.id?.toString() : 'tbd',
            name: isTeam(match.team2) ? match.team2.name : 'TBD',
            logo: isTeam(match.team2) ? match.team2.image : 'https://picsum.photos/200/200',
            score: match.team2Score,
            isWinner: match.winner === match.team2,
            isLoser: match.loser === match.team2
          },
          time: match.status === 'completed' ? 'Completed' : 'TBD',
          hasVideo: false
        }))
      }
    ];

    return { upperBracket, lowerBracket };
  };

  const bracketData = transformBracketData(bracketState)

  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden h-[180svh] flex items-start pt-50 -mb-360">
        {/* Smooth gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 via-gray-800 to-gray-900 to-transparent h-[300%]"></div>
        
        {/* Subtle radial overlay for depth */}
        <div className="absolute inset-0 bg-radial-gradient from-white/5 via-transparent to-transparent h-[300%]"></div>
        
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
      <section className="relative py-40 pb-80 -mt-240">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="glass-card p-8 rounded-lg depth-2">
              <h2 className="text-3xl font-bold text-white mb-6">Tournament Details</h2>
              <div className="space-y-4 text-gray-300">
                <div className="text-lg text-white"><strong>Date:</strong> July 25, 2025</div>
                <div className="text-lg text-white"><strong>Host:</strong> BasimZB</div>
                <div className="text-lg text-white"><strong>Game:</strong> Marvel Rivals</div>
                <div className="text-lg text-white"><strong>Format:</strong> BO3 Winners/Losers Bracket</div>
                <div className="text-lg text-white"><strong>Teams:</strong> 6-8 Teams</div>
                <div className="text-lg text-white"><strong>Draft:</strong> July 18, 2025 (Team Selection)</div>
              </div>
            </div>
            <div className="glass-card p-8 rounded-lg depth-2">
              <h3 className="text-2xl font-bold text-white mb-4">Prize Pool</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white">🥇 1st Place</span>
                  <span className="text-white font-bold">$2000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">🥈 2nd Place</span>
                  <span className="text-white font-bold">$250</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">🥉 3rd Place</span>
                  <span className="text-white font-bold">$100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tournament Bracket Section */}
      <section className="py-16 relative bg-black">
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
                <p>Available Teams: {teams.length}</p>
                <p>Last Updated: {bracketState.lastUpdated ? new Date(bracketState.lastUpdated).toLocaleString() : 'N/A'}</p>
              </div>
            )}
          </div>
          
          {!loading && !error && bracketState && bracketState.tournament.status === 'active' && (
            <div className="glass-card p-6 rounded-lg depth-2">
              <TournamentBracket 
                upperBracket={bracketData.upperBracket}
                lowerBracket={bracketData.lowerBracket}
              />
            </div>
          )}
          
          {!loading && !error && (!bracketState || bracketState.tournament.status !== 'active') && (
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
          
          <div className="text-center mt-8">
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
      <section className="py-16">
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

      {/* CTA Section */}
      <section className="py-16 mb-20 border-box">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Tournament Information</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Get all the details about the ultimate Marvel Rivals tournament!
          </p>
          <Link 
            href="/tournament-info" 
            className="glass-button text-white px-10 py-4 rounded-lg font-bold text-xl"
          >
            View Tournament Details
          </Link>
        </div>
      </section>
    </main>
  )
}
