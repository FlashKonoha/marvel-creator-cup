'use client'

import { useEffect, useState } from 'react'
import AdminDraft from '@/components/AdminDraft'
import AdminLogin from '@/components/AdminLogin'
import { useSocketDraftState } from '@/hooks/useSocketDraftState'

export default function AdminDraftPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const { state, loading, updateState } = useSocketDraftState()
  const { teams, players } = state

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

  const handleStateChange = (newTeams: Team[], newPlayers: Player[]) => {
    updateState({ teams: newTeams, players: newPlayers })
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
            <p className="text-white text-xl mt-4">Loading admin console...</p>
          </div>
        </div>
      </main>
    )
  }

  // Show error if data loading failed
  // Note: Error handling is done in the useSocketDraftState hook

  // Show admin console
  return (
    <main className="min-h-screen bg-black py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Admin Console</h1>
          <div className="flex gap-4">
            <a
              href="/admin/players"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
            >
              Player Management
            </a>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
        <AdminDraft
          teams={teams}
          players={players}
          onStateChange={handleStateChange}
        />
      </div>
    </main>
  )
}

// Types for reference
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