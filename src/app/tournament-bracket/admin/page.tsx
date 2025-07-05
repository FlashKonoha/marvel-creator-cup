'use client'

import { useEffect, useState } from 'react'
import AdminTournamentBracket from '@/components/AdminTournamentBracket'
import AdminLogin from '@/components/AdminLogin'

export default function AdminTournamentBracketPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

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

  // Show admin tournament bracket
  return (
    <main className="min-h-screen bg-black">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6 pt-8">
          <h1 className="text-3xl font-bold text-white">Tournament Bracket Admin</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
          >
            Logout
          </button>
        </div>
        <AdminTournamentBracket />
      </div>
    </main>
  )
} 