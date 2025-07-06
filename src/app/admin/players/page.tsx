'use client'

import { useEffect, useState } from 'react'
import AdminLogin from '@/components/AdminLogin'
import { useSocketDraftState } from '@/hooks/useSocketDraftState'
import Image from 'next/image'

interface Player {
  id: number
  twitchName: string
  twitchImage: string
  twitchLink: string
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

  const savePlayerEdit = async (playerId: number, twitchName: string, twitchImage: string, twitchLink: string) => {
    const updatedPlayers = players.map(player => {
      if (player.id === playerId) {
        return {
          ...player,
          twitchName,
          twitchImage,
          twitchLink: twitchLink || '' // Make twitch link optional
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
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
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
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
            >
              Draft Admin
            </a>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
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
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors"
            >
              <div className="flex flex-col items-center text-center mb-4">
                {player.twitchImage.startsWith('/api/image/') ? (
                  <img 
                    src={player.twitchImage} 
                    alt={player.twitchName}
                    className="w-20 h-20 rounded-full mb-3 object-cover border-2 border-gray-600"
                  />
                ) : (
                  <Image 
                    src={player.twitchImage} 
                    alt={player.twitchName}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full mb-3 object-cover border-2 border-gray-600"
                  />
                )}
                <h3 className="font-semibold text-white text-lg mb-1">
                  {player.twitchName}
                </h3>
                {player.twitchLink && (
                  <a 
                    href={player.twitchLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    View on Twitch
                  </a>
                )}
                {!player.twitchLink && (
                  <span className="text-gray-500 text-sm">No Twitch link</span>
                )}
              </div>
              <button
                onClick={() => openEditModal(player)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
              >
                Edit Player
              </button>
            </div>
          ))}
        </div>

        {/* Player Edit Modal */}
        {showEditModal && editingPlayer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-8 rounded-lg border border-gray-700 max-w-md w-full mx-4">
              <h3 className="text-2xl font-bold text-white mb-4">Edit Player</h3>
              <form onSubmit={async (e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const twitchName = formData.get('twitchName') as string
                const twitchLink = formData.get('twitchLink') as string
                const imageFile = formData.get('imageFile') as File
                
                let twitchImage = editingPlayer.twitchImage // Keep existing image by default
                
                // Upload new image if provided
                if (imageFile && imageFile.size > 0) {
                  try {
                    setUploadingImage(true)
                    setUploadError(null)
                    twitchImage = await uploadImage(imageFile)
                  } catch (error) {
                    setUploadError(error instanceof Error ? error.message : 'Upload failed')
                    setUploadingImage(false)
                    return
                  } finally {
                    setUploadingImage(false)
                  }
                }
                
                await savePlayerEdit(editingPlayer.id, twitchName, twitchImage, twitchLink)
              }}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Twitch Name *
                  </label>
                  <input
                    type="text"
                    name="twitchName"
                    defaultValue={editingPlayer.twitchName}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Player Image *
                  </label>
                  <div className="mb-3">
                    <div className="flex items-center space-x-3 mb-2">
                      {editingPlayer.twitchImage.startsWith('/api/image/') ? (
                        <img 
                          src={editingPlayer.twitchImage} 
                          alt="Current image"
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
                        />
                      ) : (
                        <Image 
                          src={editingPlayer.twitchImage} 
                          alt="Current image"
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
                        />
                      )}
                      <span className="text-gray-400 text-sm">Current image</span>
                    </div>
                  </div>
                  <input
                    type="file"
                    name="imageFile"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer cursor-pointer focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <p className="text-gray-400 text-xs mt-1">Max size: 2MB. Supported: JPEG, PNG, GIF, WebP. Images are stored in Redis.</p>
                  {uploadError && (
                    <p className="text-red-400 text-xs mt-1">{uploadError}</p>
                  )}
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Twitch Link (Optional)
                  </label>
                  <input
                    type="url"
                    name="twitchLink"
                    defaultValue={editingPlayer.twitchLink}
                    placeholder="https://twitch.tv/username"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <p className="text-gray-400 text-xs mt-1">Leave empty if no Twitch link is available</p>
                </div>
                
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={uploadingImage}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
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