import { NextRequest } from 'next/server'
import { getDraftState, getTournamentBracketState } from '../../../lib/database'

export async function GET(request: NextRequest) {
  // Set proper headers for SSE
  const headers = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Headers': 'Cache-Control',
    'X-Accel-Buffering': 'no' // Disable nginx buffering
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Send initial state for both draft and tournament bracket
        const [draftState, tournamentState] = await Promise.all([
          getDraftState(),
          getTournamentBracketState()
        ])
        
        // Send draft state
        const draftMessage = `data: ${JSON.stringify({ type: 'draft', data: draftState })}\n\n`
        controller.enqueue(new TextEncoder().encode(draftMessage))
        
        // Send tournament state
        const tournamentMessage = `data: ${JSON.stringify({ type: 'tournament', data: tournamentState })}\n\n`
        controller.enqueue(new TextEncoder().encode(tournamentMessage))
        
        // Simple heartbeat to keep connection alive
        const heartbeat = setInterval(() => {
          try {
            controller.enqueue(new TextEncoder().encode(': heartbeat\n\n'))
          } catch {
            clearInterval(heartbeat)
          }
        }, 30000) // 30 second heartbeat
        
        // Clean up on close
        request.signal.addEventListener('abort', () => {
          clearInterval(heartbeat)
          controller.close()
        })
      } catch (error) {
        console.error('Error in SSE connection:', error)
        controller.close()
      }
    }
  })

  return new Response(stream, { headers })
} 