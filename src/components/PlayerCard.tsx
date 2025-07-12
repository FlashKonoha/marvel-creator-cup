'use client'

import Image from 'next/image'
import { getRankImage } from '@/lib/tournamentUtils'

interface Player {
  id: number
  twitchName: string
  twitchImage: string
  twitchLink: string
  rank?: string
  preferredRole?: string[]
  heroes?: string[]
}

interface PlayerCardProps {
  player: Player
}

export default function PlayerCard({ player }: PlayerCardProps) {

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Strategist': return 'bg-blue-500'
      case 'Vanguard': return 'bg-green-500'
      case 'Duelist': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="glass-card rounded-lg p-4 depth-1 hover:depth-2 transition-all duration-200 h-60 flex flex-col">
      <a className="flex flex-col items-center text-center h-full"  
        href={player.twitchLink}
        target="_blank"
        rel="noopener noreferrer">
        <div className="flex items-center justify-center mb-3">
          <Image 
            src={player.twitchImage} 
            alt={player.twitchName}
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover flex-shrink-0"
          />
          {/* Rank Image */}
          {player.rank && (
            <Image 
              src={getRankImage(player.rank)} 
              alt={player.rank}
              width={64}
              height={64}
              className="w-16 h-16 object-contain ml-2"
            />
          )}
        </div>
        <h3 className="font-semibold text-white text-sm mb-2 line-clamp-1">
          {player.twitchName}
        </h3>
        
        {/* Preferred Roles */}
        {player.preferredRole && player.preferredRole.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2 justify-center">
            {player.preferredRole.map((role) => (
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
        {player.heroes && player.heroes.length > 0 && (
          <div className="text-xs text-gray-300 flex-1 flex items-center justify-center w-full">
            <div className="line-clamp-3">
              {player.heroes.join(", ")}
            </div>
          </div>
        )}
      </a>
    </div>
  )
} 