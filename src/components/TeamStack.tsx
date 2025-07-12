'use client'

import Image from 'next/image'
import { getRankImage } from '@/lib/tournamentUtils'
// import PlayerCard from './PlayerCard'

interface Player {
  id: number
  twitchName: string
  twitchImage: string
  twitchLink: string
  rank?: string
  preferredRole?: string[]
  heroes?: string[]
}

interface Team {
  id: number
  name: string
  image: string
  captain: Player
  players: Player[]
}

interface TeamStackProps {
  team: Team
  onRemovePlayer?: (playerId: number) => void
}

export default function TeamStack({ team, onRemovePlayer }: TeamStackProps) {

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Strategist': return 'bg-blue-500'
      case 'Vanguard': return 'bg-green-500'
      case 'Duelist': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="glass-card rounded-lg p-6 depth-2">
      <div className="text-center mb-6">
        <Image 
          src={team.image} 
          alt={team.name}
          width={80}
          height={80}
          className="w-20 h-20 rounded-lg mx-auto mb-4 object-cover"
        />
        <h3 className="text-xl font-bold text-white mb-2">{team.name}</h3>
        
        {/* Captain - Player Card Style */}
        <div className="mb-4">
          <div className="glass-card rounded-lg p-4 depth-1 hover:depth-2 transition-all duration-200 h-48 flex flex-col relative">
            <a className="flex flex-col items-center text-center h-full"  
              href={team.captain.twitchLink}
              target="_blank"
              rel="noopener noreferrer">
              <div className="flex items-center justify-center mb-3">
                <Image 
                  src={team.captain.twitchImage} 
                  alt={team.captain.twitchName}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                />
                {/* Rank Image */}
                {team.captain.rank && (
                  <Image 
                    src={getRankImage(team.captain.rank)} 
                    alt={team.captain.rank}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-contain ml-2"
                  />
                )}
              </div>
              <h3 className="font-semibold text-white text-sm mb-2 line-clamp-1">
                {team.captain.twitchName}
              </h3>
              
              {/* Preferred Roles */}
              {team.captain.preferredRole && team.captain.preferredRole.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2 justify-center">
                  {team.captain.preferredRole.map((role) => (
                    <span
                      key={role}
                      className={`${getRoleColor(role)} text-white text-xs px-2 py-1 rounded-full`}
                    >
                      {role}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Heroes - takes remaining space */}
              {team.captain.heroes && team.captain.heroes.length > 0 && (
                <div className="text-xs text-gray-300 flex-1 flex items-center justify-center w-full">
                  <div className="line-clamp-3">
                    {team.captain.heroes.join(", ")}
                  </div>
                </div>
              )}
            </a>
            {/* Crown icon */}
            <div className="absolute top-2 right-2">
              <svg 
                className="w-6 h-6 text-yellow-400" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M5 16L3 6H21L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19M7 6V4H17V6H7Z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Players */}
      <div>
        <h4 className="text-white font-semibold mb-3">Players ({team.players.length}/5)</h4>
        {team.players.length === 0 ? (
          <p className="text-gray-400 text-sm text-center">No players drafted yet</p>
        ) : (
          <div className="space-y-2">
            {team.players.map((player) => (
              <div key={player.id} className="flex items-center justify-between bg-black/20 rounded p-2">
                <div className="flex items-center space-x-3">
                  <Image 
                    src={player.twitchImage} 
                    alt={player.twitchName}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-white text-sm">{player.twitchName}</p>
                    {/* Rank */}
                    {player.rank && (
                      <div className="flex items-center mt-1">
                        <Image 
                          src={getRankImage(player.rank)} 
                          alt={player.rank}
                          width={16}
                          height={16}
                          className="w-4 h-4 object-contain mr-1"
                        />
                        <span className="text-xs text-gray-300">{player.rank}</span>
                      </div>
                    )}
                    {/* Preferred Roles */}
                    {player.preferredRole && player.preferredRole.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {player.preferredRole.map((role) => (
                          <span
                            key={role}
                            className={`${getRoleColor(role)} text-white text-xs px-1 py-0.5 rounded-full`}
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    )}
                    {/* Heroes */}
                    {player.heroes && player.heroes.length > 0 && (
                      <div className="text-xs text-gray-300 mt-1">
                        {player.heroes.slice(0, 2).join(', ')}
                        {player.heroes.length > 2 && '...'}
                      </div>
                    )}
                  </div>
                </div>
                {onRemovePlayer && (
                  <button
                    onClick={() => onRemovePlayer(player.id)}
                    className="bg-black/40 hover:bg-black/60 text-white px-2 py-1 rounded text-xs transition-colors"
                    title="Remove player"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 