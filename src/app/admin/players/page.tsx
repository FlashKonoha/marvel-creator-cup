'use client'

import { useEffect, useState } from 'react'
import AdminLogin from '@/components/AdminLogin'
import { useSocketDraftState } from '@/hooks/useSocketDraftState'
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

export default function AdminPlayersPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const { state, loading, updateState } = useSocketDraftState()
  const { players } = state
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth')
      const data = await response.json()
      setIsAuthenticated(data.authenticated)
    } catch {
      setIsAuthenticated(false)
    } finally {
      setCheckingAuth(false)
    }
  }

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' })
      setIsAuthenticated(false)
    } catch {
      console.error('Logout error')
    }
  }

  const openEditModal = (player: Player) => {
    setEditingPlayer(player)
    setShowEditModal(true)
  }

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Upload failed')
    }

    const result = await response.json()
    return result.url
  }



  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Strategist': return 'bg-blue-500'
      case 'Vanguard': return 'bg-green-500'
      case 'Duelist': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const savePlayerEdit = async (
    playerId: number, 
    twitchName: string, 
    twitchImage: string, 
    twitchLink: string,
    rank: string,
    preferredRole: string[],
    heroes: string[]
  ) => {
    const updatedPlayers = players.map(player => {
      if (player.id === playerId) {
        return {
          ...player,
          twitchName,
          twitchImage,
          twitchLink: twitchLink || '', // Make twitch link optional
          rank,
          preferredRole,
          heroes
        }
      }
      return player
    })

    await updateState({ ...state, players: updatedPlayers })
    setShowEditModal(false)
    setEditingPlayer(null)
    setUploadError(null)
  }

  // Show loading while checking authentication
  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-black py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
            <p className="text-white text-xl mt-4">Verifying access...</p>
          </div>
        </div>
      </main>
    )
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />
  }

  // Show loading while fetching data
  if (loading) {
    return (
      <main className="min-h-screen bg-black py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
            <p className="text-white text-xl mt-4">Loading player management...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">Player Management</h1>
            <p className="text-gray-300 mt-2">Manage player information, Twitch names, images, and links</p>
          </div>
          <div className="flex gap-4">
            <a
              href="/draft/admin"
              className="glass-button text-white px-4 py-2 rounded"
            >
              Draft Admin
            </a>
            <button
              onClick={handleLogout}
              className="glass-button text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Player Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {players.map((player) => (
            <div
              key={player.id}
              className="glass-card rounded-lg p-6 depth-1 hover:depth-2 transition-all duration-200 h-80 flex flex-col"
            >
              <div className="flex flex-col items-center text-center mb-4 flex-1">
                {player.twitchImage.startsWith('/api/image/') ? (
                  <Image 
                    src={player.twitchImage} 
                    alt={player.twitchName}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full mb-3 object-cover border-2 border-gray-600 flex-shrink-0"
                  />
                ) : (
                  <Image 
                    src={player.twitchImage} 
                    alt={player.twitchName}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full mb-3 object-cover border-2 border-gray-600 flex-shrink-0"
                  />
                )}
                <h3 className="font-semibold text-white text-lg mb-1 line-clamp-1">
                  {player.twitchName}
                </h3>
                
                {/* Rank */}
                {player.rank && (
                  <div className="mb-2 flex-shrink-0">
                    <Image 
                      src={getRankImage(player.rank)} 
                      alt={player.rank}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                )}
                
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
                
                {/* Heroes */}
                {player.heroes && player.heroes.length > 0 && (
                  <div className="text-xs text-gray-300 mb-2 line-clamp-2">
                    {player.heroes.slice(0, 2).join(', ')}
                    {player.heroes.length > 2 && '...'}
                  </div>
                )}
                
                {player.twitchLink && (
                  <a 
                    href={player.twitchLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 text-sm mt-auto"
                  >
                    View on Twitch
                  </a>
                )}
                {!player.twitchLink && (
                  <span className="text-gray-500 text-sm mt-auto">No Twitch link</span>
                )}
              </div>
              <button
                onClick={() => openEditModal(player)}
                className="w-full glass-button text-white px-4 py-2 rounded mt-auto"
              >
                Edit Player
              </button>
            </div>
          ))}
        </div>

        {/* Edit Player Modal */}
        {showEditModal && editingPlayer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-8 rounded-lg border border-gray-700 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-white mb-6">Edit Player: {editingPlayer.twitchName}</h3>
              <form onSubmit={async (e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                
                let imageUrl = editingPlayer.twitchImage
                const form = e.currentTarget as HTMLFormElement
                const imageFileInput = form.elements.namedItem('imageFile') as HTMLInputElement
                const imageFile = imageFileInput?.files?.[0]
                
                if (imageFile) {
                  try {
                    setUploadingImage(true)
                    imageUrl = await uploadImage(imageFile)
                  } catch (error) {
                    setUploadError(error instanceof Error ? error.message : 'Upload failed')
                    return
                  } finally {
                    setUploadingImage(false)
                  }
                }

                const rank = formData.get('rank') as string
                const preferredRole = (formData.get('preferredRole') as string).split(',').map(r => r.trim()).filter(r => r)
                const heroes = (formData.get('heroes') as string).split(',').map(h => h.trim()).filter(h => h)

                await savePlayerEdit(
                  editingPlayer.id,
                  formData.get('twitchName') as string,
                  imageUrl,
                  formData.get('twitchLink') as string,
                  rank,
                  preferredRole,
                  heroes
                )
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Twitch Name
                    </label>
                    <input
                      type="text"
                      name="twitchName"
                      defaultValue={editingPlayer.twitchName}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Twitch Link
                    </label>
                    <input
                      type="url"
                      name="twitchLink"
                      defaultValue={editingPlayer.twitchLink}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Rank
                    </label>
                    <select
                      name="rank"
                      defaultValue={editingPlayer.rank || 'Celestial 3'}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    >
                      <option value="One Above All">One Above All</option>
                      <option value="Eternity">Eternity</option>
                      <option value="Celestial 1">Celestial 1</option>
                      <option value="Celestial 2">Celestial 2</option>
                      <option value="Celestial 3">Celestial 3</option>
                      <option value="Grand Master 1">Grand Master 1</option>
                      <option value="Grand Master 2">Grand Master 2</option>
                      <option value="Grand Master 3">Grand Master 3</option>
                      <option value="Diamond 1">Diamond 1</option>
                      <option value="Diamond 2">Diamond 2</option>
                      <option value="Diamond 3">Diamond 3</option>
                      <option value="Platinum 1">Platinum 1</option>
                      <option value="Platinum 2">Platinum 2</option>
                      <option value="Platinum 3">Platinum 3</option>
                      <option value="Gold 1">Gold 1</option>
                      <option value="Gold 2">Gold 2</option>
                      <option value="Gold 3">Gold 3</option>
                      <option value="Silver 1">Silver 1</option>
                      <option value="Silver 2">Silver 2</option>
                      <option value="Silver 3">Silver 3</option>
                      <option value="Bronze 1">Bronze 1</option>
                      <option value="Bronze 2">Bronze 2</option>
                      <option value="Bronze 3">Bronze 3</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Preferred Roles (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="preferredRole"
                      defaultValue={editingPlayer.preferredRole?.join(', ') || ''}
                      placeholder="Strategist, Vanguard, Duelist"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Heroes (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="heroes"
                      defaultValue={editingPlayer.heroes?.join(', ') || ''}
                      placeholder="Iron Man, Captain America, Spider-Man"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Profile Image
                    </label>
                    <input
                      type="file"
                      name="imageFile"
                      accept="image/*"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <p className="text-xs text-gray-400 mt-1">Leave empty to keep current image</p>
                  </div>
                </div>

                {uploadError && (
                  <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded-lg">
                    <p className="text-red-400 text-sm">{uploadError}</p>
                  </div>
                )}

                <div className="flex gap-4 mt-6">
                  <button
                    type="submit"
                    disabled={uploadingImage}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    {uploadingImage ? 'Uploading...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false)
                      setEditingPlayer(null)
                      setUploadError(null)
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