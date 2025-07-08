import { useState, useEffect, useCallback, useRef } from 'react'

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

interface DraftState {
  teams: Team[]
  players: Player[]
  lastUpdated?: string
}

export function useSocketDraftState() {
  const [state, setState] = useState<DraftState>({ teams: [], players: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const lastUpdateRef = useRef<string | null>(null)
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch initial state
  const fetchInitialState = useCallback(async () => {
    try {
      const response = await fetch('/api/draft')
      if (response.ok) {
        const data = await response.json()
        setState(data)
        lastUpdateRef.current = data.lastUpdated
        setLoading(false)
        setError(null)
        return true
      } else {
        throw new Error('Failed to fetch initial state')
      }
    } catch (err) {
      console.error('Error fetching initial state:', err)
      return false
    }
  }, [])

  // Check for updates
  const checkForUpdates = useCallback(async () => {
    try {
      const response = await fetch('/api/updates')
      if (response.ok) {
        const data = await response.json()
        if (data.draft.lastUpdated !== lastUpdateRef.current) {
          // Fetch the updated draft state
          const draftResponse = await fetch('/api/draft')
          if (draftResponse.ok) {
            const draftData = await draftResponse.json()
            setState(draftData)
            lastUpdateRef.current = draftData.lastUpdated
            console.log('Draft state updated via polling')
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
    
    pollIntervalRef.current = setInterval(checkForUpdates, 3000) // Poll every 3 seconds
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
    fetchInitialState().then((success) => {
      if (success) {
        startPolling()
      } else {
        setLoading(false)
        setError('Failed to load draft state')
      }
    })

    return () => {
      stopPolling()
    }
  }, [fetchInitialState, startPolling, stopPolling])

  // Update state on server
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
      lastUpdateRef.current = data.lastUpdated
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

  return {
    state,
    loading,
    error,
    isUpdating,
    isConnected,
    updateState,
  }
} 