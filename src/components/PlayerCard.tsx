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
    <div className="glass-card rounded-lg p-4 depth-1 hover:depth-2 transition-all duration-200">
      <a className="flex flex-col items-center text-center"  
        href={player.twitchLink}
        target="_blank"
        rel="noopener noreferrer">
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
        {/* <a 
          href={player.twitchLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-gray-300 text-xs transition-colors"
        >
          View on Twitch
        </a> */}
      </a>
    </div>
  )
} 