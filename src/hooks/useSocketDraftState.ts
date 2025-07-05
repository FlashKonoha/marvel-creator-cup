import { useState, useEffect, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'

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
  const [socket, setSocket] = useState<Socket | null>(null)

  // Initialize Socket.IO connection
  useEffect(() => {
    const newSocket = io({
      transports: ['websocket', 'polling'],
      timeout: 20000,
    })

    setSocket(newSocket)

    newSocket.on('connect', () => {
      console.log('Connected to Socket.IO server')
      setIsConnected(true)
      setError(null)
    })

    newSocket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server')
      setIsConnected(false)
    })

    newSocket.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err)
      setError('Connection failed. Trying to reconnect...')
      setIsConnected(false)
    })

    newSocket.on('draft-update', (data: DraftState) => {
      console.log('Received draft update via Socket.IO')
      setState(data)
      setLoading(false)
      setError(null)
    })

    return () => {
      newSocket.close()
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
    socket,
  }
} 