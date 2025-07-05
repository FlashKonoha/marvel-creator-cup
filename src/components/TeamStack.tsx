'use client'

import Image from 'next/image'
import PlayerCard from './PlayerCard'

interface Player {
  id: number
  twitchName: string
  twitchImage: string
  twitchLink: string
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
}

export default function TeamStack({ team }: TeamStackProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="text-center mb-6">
        <img 
          src={team.image} 
          alt={team.name}
          className="w-20 h-20 rounded-lg mx-auto mb-4 object-cover"
        />
        <h3 className="text-xl font-bold text-white mb-2">{team.name}</h3>
        
        {/* Captain */}
        <div className="mb-4">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-500 transition-colors relative">
            <div className="flex items-center space-x-3 bg-gray-700 rounded p-2 text-left">
              <img 
                src={team.captain.twitchImage} 
                alt={team.captain.twitchName}
               className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1">
              <p className="text-white text-sm">
                {team.captain.twitchName}
              </p>
              <a 
                href={team.captain.twitchLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-xs"
              >
                View on Twitch
              </a>
              </div>
            </div>
            {/* Crown icon */}
            <div className="absolute top-8 right-10">
              <svg 
                className="w-5 h-5 text-yellow-400" 
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
              <div key={player.id} className="flex items-center space-x-3 bg-gray-700 rounded p-2">
                <img 
                  src={player.twitchImage} 
                  alt={player.twitchName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="text-white text-sm">{player.twitchName}</p>
                  <a 
                    href={player.twitchLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-xs"
                  >
                    View on Twitch
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 