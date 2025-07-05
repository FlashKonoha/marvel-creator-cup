import { useState, useEffect, useCallback, useRef } from 'react'

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

interface DraftState {
  teams: Team[]
  players: Player[]
}

interface UseDraftStateOptions {
  enablePolling?: boolean
  pollingInterval?: number
}

export function useDraftState(options: UseDraftStateOptions = {}) {
  const { enablePolling = true, pollingInterval = 30000 } = options // 30 seconds default for high scale
  const [state, setState] = useState<DraftState>({ teams: [], players: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const lastStateRef = useRef<string>('')
  const abortControllerRef = useRef<AbortController | null>(null)

  // Fetch state from server with timeout and abort controller
  const fetchState = useCallback(async (showLoading = false) => {
    try {
      // Abort previous request if still pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      
      abortControllerRef.current = new AbortController()
      
      if (showLoading) {
        setLoading(true)
      }
      
      const response = await fetch('/api/draft', {
        signal: abortControllerRef.current.signal,
        headers: {
          'Cache-Control': 'no-cache',
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch draft state')
      }
      
      const data = await response.json()
      
      // Only update if data has actually changed
      const newStateString = JSON.stringify(data)
      if (newStateString !== lastStateRef.current) {
        setState(data)
        lastStateRef.current = newStateString
      }
      setError(null)
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was aborted, ignore
        return
      }
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Error fetching draft state:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Update state on server with retry logic
  const updateState = useCallback(async (newState: DraftState) => {
    try {
      setIsUpdating(true)
      
      const response = await fetch('/api/draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newState),
      })

      if (!response.ok) {
        throw new Error('Failed to update draft state')
      }

      const data = await response.json()
      setState(data)
      lastStateRef.current = JSON.stringify(data)
      setError(null)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Error updating draft state:', err)
      return false
    } finally {
      setIsUpdating(false)
    }
  }, [])

  // Poll for updates with exponential backoff on errors
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null
    let retryCount = 0
    const maxRetries = 3

    const startPolling = () => {
      fetchState(true) // Initial load with loading state

      if (enablePolling) {
        intervalId = setInterval(() => {
          fetchState(false) // Silent updates without loading state
        }, pollingInterval)
      }
    }

    startPolling()

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchState, enablePolling, pollingInterval])

  return {
    state,
    loading,
    error,
    isUpdating,
    updateState,
    refetch: () => fetchState(true),
  }
} 