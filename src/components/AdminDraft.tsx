'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import PlayerCard from './PlayerCard'
import TeamStack from './TeamStack'

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

interface AdminDraftProps {
  teams: Team[]
  players: Player[]
  onStateChange: (teams: Team[], players: Player[]) => void
}

export default function AdminDraft({ teams, players, onStateChange }: AdminDraftProps) {
  const [draggedPlayer, setDraggedPlayer] = useState<Player | null>(null)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [saving, setSaving] = useState(false)



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
    
    setSaving(true)
    await onStateChange(updatedTeams, updatedPlayers)
    setSaving(false)
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
    setSaving(true)
    await onStateChange(updatedTeams, updatedPlayers)
    setSaving(false)
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

    setSaving(true)
    await onStateChange(updatedTeams, players)
    setSaving(false)
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
            {saving && (
              <div className="flex items-center space-x-2 mt-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="text-blue-400 text-sm">Saving...</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Available Players */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <h2 className="text-2xl font-bold text-white mb-4">Available Players</h2>
                              <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {players.map((player) => (
                    <div
                      key={player.id}
                      className="bg-gray-800 rounded-lg p-4 border border-gray-700 cursor-grab active:cursor-grabbing hover:border-blue-500 hover:shadow-lg transition-all duration-200"
                      draggable
                      onDragStart={(e) => handleDragStart(e, player)}
                    >
                      <div className="flex flex-col items-center text-center">
                        <img 
                          src={player.twitchImage} 
                          alt={player.twitchName}
                          className="w-16 h-16 rounded-full mb-3 object-cover border-2 border-gray-600"
                        />
                        <h3 className="font-semibold text-white text-sm mb-2">
                          {player.twitchName}
                        </h3>
                        <a 
                          href={player.twitchLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-xs"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View on Twitch
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
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
                      <img 
                        src={team.image} 
                        alt={team.name}
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
                    <div className="flex items-center justify-between bg-gray-700 rounded p-3 py-5">
                      <div className="flex items-center space-x-2">
                        <img 
                          src={team.captain.twitchImage} 
                          alt={team.captain.twitchName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-white text-sm">{team.captain.twitchName}</span>
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
                              <img 
                                src={player.twitchImage} 
                                alt={player.twitchName}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <span className="text-white text-sm">{player.twitchName}</span>
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
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false)
                      setEditingTeam(null)
                    }}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
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