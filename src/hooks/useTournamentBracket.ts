import { useState, useEffect } from 'react'

export interface TournamentMatch {
  id: string
  team1: unknown
  team2: unknown
  team1Score: number
  team2Score: number
  winner: unknown
  loser: unknown
  status: 'pending' | 'completed'
  bestOf: number
  scheduledTime: string | null
  completedTime: string | null
}

export interface TournamentBracket {
  upper: {
    quarterfinals: TournamentMatch[]
    semifinals: TournamentMatch[]
    final: TournamentMatch[]
  }
  lower: {
    round1: TournamentMatch[]
    round2: TournamentMatch[]
    round3: TournamentMatch[]
    final: TournamentMatch[]
  }
}

export interface TournamentState {
  tournament: {
    id: string
    name: string
    status: string
    startDate: string
    format: string
    maxTeams: number
  }
  brackets: TournamentBracket
  grandFinal: TournamentMatch
  lastUpdated: string
}

export function useTournamentBracket() {
  const [bracketState, setBracketState] = useState<TournamentState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)

  const fetchBracketState = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/tournament-bracket')
      const data = await response.json()
      
      if (response.ok) {
        setBracketState(data)
      } else {
        setError(data.error || 'Failed to fetch bracket state')
      }
    } catch {
      const errorMsg = 'Network error. Please try again.'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const initializeBracket = async (teams: unknown[]) => {
    try {
      setUpdating(true)
      setError(null)
      
      const response = await fetch('/api/tournament-bracket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'initialize_bracket',
          data: { teams }
        }),
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setBracketState(result.data)
        return { success: true }
      } else {
        setError(result.error || 'Failed to initialize bracket')
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

  const updateMatchResult = async (matchId: string, team1Score: number, team2Score: number, matchTime?: string) => {
    try {
      setUpdating(true)
      setError(null)
      
      const response = await fetch('/api/tournament-bracket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update_match_result',
          data: { matchId, team1Score, team2Score, matchTime }
        }),
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setBracketState(result.data)
        return { success: true }
      } else {
        setError(result.error || 'Failed to update match result')
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

  const resetBracket = async () => {
    try {
      setUpdating(true)
      setError(null)
      
      const response = await fetch('/api/tournament-bracket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reset_bracket'
        }),
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setBracketState(result.data)
        return { success: true }
      } else {
        setError(result.error || 'Failed to reset bracket')
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

  useEffect(() => {
    fetchBracketState()
  }, [])

  return {
    bracketState,
    loading,
    error,
    updating,
    fetchBracketState,
    initializeBracket,
    updateMatchResult,
    resetBracket
  }
} 