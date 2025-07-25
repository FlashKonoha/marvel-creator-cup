'use client'

import Link from 'next/link'
import PlayerCard from '@/components/PlayerCard'
import TeamStack from '@/components/TeamStack'
import { useSocketDraftState } from '@/hooks/useSocketDraftState'

export default function DraftPage() {
  const { state, loading, error, isConnected } = useSocketDraftState()
  const { teams, players } = state

  if (loading) {
    return (
      <main className="min-h-screen bg-black py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-white text-xl mt-4">Loading draft state...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-black py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-400 text-xl mb-4">Error loading draft: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="glass-button text-white px-4 py-2 rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </main>
    )
  }

  // Calculate draft statistics
  const totalPlayers = 40
  const draftedPlayers = teams.reduce((total, team) => total + team.players.length, 0)
  const remainingPlayers = totalPlayers - draftedPlayers
  const draftProgress = totalPlayers > 0 ? Math.round((draftedPlayers / totalPlayers) * 100) : 0

  return (
    <main className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <Link href="/" className="text-white hover:text-gray-300 transition-colors mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Team Draft
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Live draft progress and team compositions
          </p>
          
          {/* Connection Status */}
          <div className="mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium glass-card ${
              isConnected 
                ? 'text-white' 
                : 'text-gray-300'
            }`}>
              <span className={`w-2 h-2 rounded-full mr-2 ${
                isConnected ? 'bg-white' : 'bg-gray-400'
              }`}></span>
              {isConnected ? 'Live Updates' : 'Static Mode'}
            </span>
          </div>
          
          {/* Draft Progress */}
          <div className="glass-card rounded-lg p-4 mb-6 max-w-md mx-auto depth-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-semibold">Draft Progress</span>
              <span className="text-white font-bold">{draftProgress}%</span>
            </div>
            <div className="w-full bg-black/30 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500" 
                style={{ width: `${draftProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>{draftedPlayers} drafted</span>
              <span>{remainingPlayers} remaining</span>
            </div>
          </div>
        </div>

        {/* Available Players */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            Available Players ({players.length})
          </h2>
          {players.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg">All players have been drafted!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
              {players.map((player) => (
                <div key={player.id} className="w-full">
                  <PlayerCard player={player} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Team Stacks */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Team Stacks</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teams.map((team) => (
              <TeamStack 
                key={team.id} 
                team={team} 
                onRemovePlayer={() => {}} // No-op for read-only view
              />
            ))}
          </div>
        </div>

      </div>
    </main>
  )
} 