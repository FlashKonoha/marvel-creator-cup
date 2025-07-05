'use client'

import Image from 'next/image'

interface Player {
  id: number
  twitchName: string
  twitchImage: string
  twitchLink: string
}

interface PlayerCardProps {
  player: Player
}

export default function PlayerCard({ player }: PlayerCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-500 transition-colors">
      <div className="flex flex-col items-center text-center">
        <Image 
          src={player.twitchImage} 
          alt={player.twitchName}
          width={64}
          height={64}
          className="w-16 h-16 rounded-full mb-3 object-cover"
        />
        <h3 className="font-semibold text-white text-sm mb-2">
          {player.twitchName}
        </h3>
        <a 
          href={player.twitchLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 text-xs transition-colors"
        >
          View on Twitch
        </a>
      </div>
    </div>
  )
} 