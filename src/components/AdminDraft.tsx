'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Player {
  id: number
  twitchName: string
  twitchImage: string
  twitchLink: string
  rank: string
  preferredRole: string[]
  heroes: string[]
}

interface Team {
  id: number
  name: string
  image: string
  captain: Player
  players: Player[]
}

interface AdminDraftProps {
  teams: Team[]
  players: Player[]
  onStateChange: (teams: Team[], players: Player[]) => void
}

export default function AdminDraft({ teams, players, onStateChange }: AdminDraftProps) {
  const [draggedPlayer, setDraggedPlayer] = useState<Player | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)

  const getRankImage = (rank: string) => {
    if (rank.includes('One Above All')) return '/One_Above_All_Rank.webp'
    if (rank.includes('Eternity')) return '/Eternity_Rank.webp'
    if (rank.includes('Celestial 1') || rank.includes('Celestial 2') || rank.includes('Celestial 3')) return '/Celestial_Rank.webp'
    if (rank.includes('Grandmaster')) return '/Grandmaster_Rank.webp'
    if (rank.includes('Diamond')) return '/Diamond_Rank.webp'
    if (rank.includes('Platinum')) return '/Platinum_Rank.webp'
    if (rank.includes('Gold')) return '/Gold_Rank.webp'
    if (rank.includes('Silver')) return '/Silver_Rank.webp'
    if (rank.includes('Bronze')) return '/Bronze_Rank.webp'
    return '/Bronze_Rank.webp' // default
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Strategist': return 'bg-blue-500'
      case 'Vanguard': return 'bg-green-500'
      case 'Duelist': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const handleDragStart = (e: React.DragEvent, player: Player) => {
    setDraggedPlayer(player)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, teamId: number) => {
    e.preventDefault()
    if (!draggedPlayer) return

    const updatedTeams = teams.map(team => {
      if (team.id === teamId && team.players.length < 5) {
        return {
          ...team,
          players: [...team.players, draggedPlayer]
        }
      }
      return team
    })

    const updatedPlayers = players.filter(player => player.id !== draggedPlayer.id)
    await onStateChange(updatedTeams, updatedPlayers)
    setDraggedPlayer(null)
  }

  const removePlayerFromTeam = async (teamId: number, playerId: number) => {
    const team = teams.find(t => t.id === teamId)
    if (!team) return

    const player = team.players.find(p => p.id === playerId)
    if (!player) return

    const updatedTeams = teams.map(t => {
      if (t.id === teamId) {
        return {
          ...t,
          players: t.players.filter(p => p.id !== playerId)
        }
      }
      return t
    })

    const updatedPlayers = [...players, player]
    await onStateChange(updatedTeams, updatedPlayers)
  }

  const openEditModal = (team: Team) => {
    setEditingTeam(team)
    setShowEditModal(true)
  }

  const saveTeamEdit = async (teamName: string, teamImage: string) => {
    if (!editingTeam) return

    const updatedTeams = teams.map(team => {
      if (team.id === editingTeam.id) {
        return {
          ...team,
          name: teamName,
          image: teamImage
        }
      }
      return team
    })

    await onStateChange(updatedTeams, players)
    setShowEditModal(false)
    setEditingTeam(null)
  }

  return (
    <main className="min-h-screen bg-black py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/draft" className="text-blue-400 hover:text-blue-300 transition-colors mb-2 inline-block">
              ← Back to Draft View
            </Link>
            <h1 className="text-4xl font-bold text-white">Admin Draft Console</h1>
          </div>
          <div className="text-right">
            <p className="text-gray-300">Available Players: {players.length}</p>
            <p className="text-gray-300">Teams: {teams.length}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Available Players */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Available Players</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {players.map((player) => (
                <div
                  key={player.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, player)}
                  className="bg-gray-800 rounded-lg p-4 border-2 border-dashed border-gray-600 cursor-move hover:border-blue-500 transition-colors h-20"
                >
                  <div className="flex items-center space-x-3 h-full">
                    <Image 
                      src={player.twitchImage} 
                      alt={player.twitchName}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-sm line-clamp-1">{player.twitchName}</h3>
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
                              className={`${getRoleColor(role)} text-white text-xs px-2 py-1 rounded-full`}
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      )}
                      {/* Heroes */}
                      {player.heroes && player.heroes.length > 0 && (
                        <div className="text-xs text-gray-300 mt-1 line-clamp-1">
                          {player.heroes.slice(0, 2).join(', ')}
                          {player.heroes.length > 2 && '...'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Stacks */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-6">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="bg-gray-800 rounded-lg p-6 border-2 border-dashed border-blue-500 min-h-[400px]"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, team.id)}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <Image 
                        src={team.image} 
                        alt={team.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="text-lg font-bold text-white">{team.name}</h3>
                        <p className="text-sm text-gray-400">Players: {team.players.length}/5</p>
                      </div>
                    </div>
                    <button
                      onClick={() => openEditModal(team)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Edit Team
                    </button>
                  </div>

                  {/* Captain */}
                  <div className="mb-4">
                    <h4 className="text-white font-semibold mb-3">Captain</h4>
                    <div className="flex items-center justify-between bg-gray-700 rounded p-3 py-5">
                      <div className="flex items-center space-x-2">
                        <Image 
                          src={team.captain.twitchImage} 
                          alt={team.captain.twitchName}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <span className="text-white text-sm">{team.captain.twitchName}</span>
                          {/* Rank */}
                          {team.captain.rank && (
                            <div className="flex items-center mt-1">
                              <Image 
                                src={getRankImage(team.captain.rank)} 
                                alt={team.captain.rank}
                                width={16}
                                height={16}
                                className="w-4 h-4 object-contain mr-1"
                              />
                              <span className="text-xs text-gray-300">{team.captain.rank}</span>
                            </div>
                          )}
                          {/* Preferred Roles */}
                          {team.captain.preferredRole && team.captain.preferredRole.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {team.captain.preferredRole.map((role) => (
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
                          {team.captain.heroes && team.captain.heroes.length > 0 && (
                            <div className="text-xs text-gray-300 mt-1">
                              {team.captain.heroes.slice(0, 2).join(', ')}
                              {team.captain.heroes.length > 2 && '...'}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full inline-block mb-2">
                        CAPTAIN
                      </div>
                    </div>
                  </div>

                  {/* Players */}
                  <div>
                    <h4 className="text-white font-semibold mb-3">Players</h4>
                    {team.players.length === 0 ? (
                      <div className="text-center py-8 border-2 border-dashed border-gray-600 rounded-lg bg-gray-700/50">
                        <p className="text-gray-400 text-sm mb-2">Drop players here</p>
                        <p className="text-gray-500 text-xs">Drag from available players above</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {team.players.map((player) => (
                          <div key={player.id} className="flex items-center justify-between bg-gray-700 rounded p-3">
                            <div className="flex items-center space-x-3">
                              <Image 
                                src={player.twitchImage} 
                                alt={player.twitchName}
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div>
                                <span className="text-white text-sm">{player.twitchName}</span>
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
                            <button
                              onClick={() => removePlayerFromTeam(team.id, player.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Edit Modal */}
        {showEditModal && editingTeam && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-8 rounded-lg border border-gray-700 max-w-md w-full mx-4">
              <h3 className="text-2xl font-bold text-white mb-4">Edit Team</h3>
              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                saveTeamEdit(
                  formData.get('teamName') as string,
                  formData.get('teamImage') as string
                )
              }}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Team Name
                  </label>
                  <input
                    type="text"
                    name="teamName"
                    defaultValue={editingTeam.name}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Team Image URL
                  </label>
                  <input
                    type="url"
                    name="teamImage"
                    defaultValue={editingTeam.image}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false)
                      setEditingTeam(null)
                    }}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  )
} 