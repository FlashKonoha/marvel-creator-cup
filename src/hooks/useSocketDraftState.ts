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

export function useSocketDraftState() {
  const [state, setState] = useState<DraftState>({ teams: [], players: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const eventSourceRef = useRef<EventSource | null>(null)

  // Fetch initial state
  const fetchInitialState = useCallback(async () => {
    try {
      const response = await fetch('/api/draft')
      if (response.ok) {
        const data = await response.json()
        setState(data)
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

  // Initialize SSE connection
  useEffect(() => {
    let sseConnected = false

    const connectSSE = () => {
      try {
        const eventSource = new EventSource('/api/realtime')
        eventSourceRef.current = eventSource

        eventSource.onopen = () => {
          console.log('Connected to SSE server')
          setIsConnected(true)
          setError(null)
          sseConnected = true
        }

        eventSource.onerror = (err) => {
          console.error('SSE connection error:', err)
          if (!sseConnected) {
            setError('Real-time connection failed. Using static mode.')
            setIsConnected(false)
          }
        }

        eventSource.onmessage = (event) => {
          if (event.data.startsWith('data: ')) {
            try {
              const data = JSON.parse(event.data.slice(6))
              console.log('Received draft update via SSE')
              setState(data)
              setLoading(false)
              setError(null)
            } catch (parseError) {
              console.error('Error parsing SSE data:', parseError)
            }
          }
        }

        return eventSource
      } catch (err) {
        console.error('Error creating SSE connection:', err)
        setError('Real-time connection failed. Using static mode.')
        setIsConnected(false)
        return null
      }
    }

    // Try to fetch initial state first, then connect SSE
    fetchInitialState().then((success) => {
      if (success) {
        // If initial fetch succeeds, try SSE for real-time updates
        connectSSE()
      } else {
        // If initial fetch fails, try SSE as fallback
        const eventSource = connectSSE()
        if (!eventSource) {
          setLoading(false)
          setError('Failed to load draft state')
        }
      }
    })

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
    }
  }, [fetchInitialState])

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