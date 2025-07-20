import { useState, useEffect, useRef, useCallback } from 'react'
import type { TournamentState } from '../data/tournamentBracketData'

export function useTournamentBracket() {
  const [bracketState, setBracketState] = useState<TournamentState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const lastUpdateRef = useRef<string | null>(null)
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchBracketState = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/tournament-bracket')
      const data = await response.json()
      
      if (response.ok) {
        setBracketState(data)
        lastUpdateRef.current = data.tournament.lastUpdated
        return true
      } else {
        setError(data.error || 'Failed to fetch bracket state')
        return false
      }
    } catch {
      const errorMsg = 'Network error. Please try again.'
      setError(errorMsg)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Check for updates
  const checkForUpdates = useCallback(async () => {
    try {
      const response = await fetch('/api/updates')
      if (response.ok) {
        const data = await response.json()
        if (data.tournament.lastUpdated !== lastUpdateRef.current) {
          // Fetch the updated tournament state
          const tournamentResponse = await fetch('/api/tournament-bracket')
          if (tournamentResponse.ok) {
            const tournamentData = await tournamentResponse.json()
            setBracketState(tournamentData)
            lastUpdateRef.current = tournamentData.tournament.lastUpdated
            console.log('Tournament state updated via polling')
          }
        }
      }
    } catch (error) {
      console.error('Error checking for updates:', error)
    }
  }, [])

  // Start polling
  const startPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
    }
    
    pollIntervalRef.current = setInterval(checkForUpdates, 5000) // Poll every 5 seconds
    setIsConnected(true)
  }, [checkForUpdates])

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
      pollIntervalRef.current = null
    }
    setIsConnected(false)
  }, [])

  useEffect(() => {
    // Fetch initial state and start polling
    fetchBracketState().then((success) => {
      if (success) {
        startPolling()
      } else {
        setLoading(false)
        setError('Failed to load tournament bracket state')
      }
    })

    return () => {
      stopPolling()
    }
  }, [startPolling, stopPolling])

  const initializeTournament = async (teams: unknown[]) => {
    try {
      setUpdating(true)
      setError(null)
      
      const response = await fetch('/api/tournament-bracket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'initialize_tournament',
          data: { teams }
        }),
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setBracketState(result.data)
        lastUpdateRef.current = result.data.tournament.lastUpdated
        return { success: true }
      } else {
        setError(result.error || 'Failed to initialize tournament')
        return { success: false, error: result.error }
      }
    } catch {
      const errorMsg = 'Network error. Please try again.'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setUpdating(false)
    }
  }

  const updateGroupMatch = async (matchId: string, team1MapWins: number, team2MapWins: number, matchTime?: string) => {
    try {
      setUpdating(true)
      setError(null)
      
      const response = await fetch('/api/tournament-bracket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update_group_match',
          data: { matchId, team1MapWins, team2MapWins, matchTime }
        }),
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setBracketState(result.data)
        lastUpdateRef.current = result.data.tournament.lastUpdated
        return { success: true }
      } else {
        setError(result.error || 'Failed to update group match')
        return { success: false, error: result.error }
      }
    } catch {
      const errorMsg = 'Network error. Please try again.'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setUpdating(false)
    }
  }

  const updateFinalMatch = async (matchId: string, team1Score: number, team2Score: number, matchTime?: string) => {
    try {
      setUpdating(true)
      setError(null)
      
      const response = await fetch('/api/tournament-bracket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update_final_match',
          data: { matchId, team1Score, team2Score, matchTime }
        }),
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setBracketState(result.data)
        lastUpdateRef.current = result.data.tournament.lastUpdated
        return { success: true }
      } else {
        setError(result.error || 'Failed to update final match')
        return { success: false, error: result.error }
      }
    } catch {
      const errorMsg = 'Network error. Please try again.'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setUpdating(false)
    }
  }

  const advanceToFinalStage = async () => {
    try {
      setUpdating(true)
      setError(null)
      
      const response = await fetch('/api/tournament-bracket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'advance_to_final_stage'
        }),
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setBracketState(result.data)
        lastUpdateRef.current = result.data.tournament.lastUpdated
        return { success: true }
      } else {
        setError(result.error || 'Failed to advance to final stage')
        return { success: false, error: result.error }
      }
    } catch {
      const errorMsg = 'Network error. Please try again.'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setUpdating(false)
    }
  }

  const resetTournament = async () => {
    try {
      setUpdating(true)
      setError(null)
      
      const response = await fetch('/api/tournament-bracket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reset_tournament'
        }),
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setBracketState(result.data)
        lastUpdateRef.current = result.data.tournament.lastUpdated
        return { success: true }
      } else {
        setError(result.error || 'Failed to reset tournament')
        return { success: false, error: result.error }
      }
    } catch {
      const errorMsg = 'Network error. Please try again.'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setUpdating(false)
    }
  }

  return {
    bracketState,
    loading,
    error,
    updating,
    isConnected,
    fetchBracketState,
    initializeTournament,
    updateGroupMatch,
    updateFinalMatch,
    advanceToFinalStage,
    resetTournament
  }
} 