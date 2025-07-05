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

  // Initialize SSE connection
  useEffect(() => {
    const connectSSE = () => {
      try {
        const eventSource = new EventSource('/api/realtime')
        eventSourceRef.current = eventSource

        eventSource.onopen = () => {
          console.log('Connected to SSE server')
          setIsConnected(true)
          setError(null)
        }

        eventSource.onerror = (err) => {
          console.error('SSE connection error:', err)
          setError('Connection failed. Trying to reconnect...')
          setIsConnected(false)
          
          // Attempt to reconnect after 5 seconds
          setTimeout(() => {
            if (eventSourceRef.current) {
              eventSourceRef.current.close()
              connectSSE()
            }
          }, 5000)
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
        setError('Failed to establish connection')
        setIsConnected(false)
        return null
      }
    }

    const eventSource = connectSSE()

    return () => {
      if (eventSource) {
        eventSource.close()
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
    }
  }, [])

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