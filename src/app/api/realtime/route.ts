import { NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'draft-state.json')

// Store active connections for broadcasting
const connections = new Set<ReadableStreamDefaultController>()

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Read current state
const readState = () => {
  ensureDataDir()
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading draft state:', error)
  }
  
  return {
    teams: [],
    players: []
  }
}

// Broadcast function for other API routes (unused in current implementation)
// const broadcastUpdate = (data: unknown) => {
//   const message = `data: ${JSON.stringify(data)}\n\n`
//   connections.forEach(controller => {
//     try {
//       controller.enqueue(new TextEncoder().encode(message))
//     } catch {
//       // Remove dead connections
//       connections.delete(controller)
//     }
//   })
// }

export async function GET(request: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      // Send initial state
      const initialState = readState()
      const message = `data: ${JSON.stringify(initialState)}\n\n`
      controller.enqueue(new TextEncoder().encode(message))
      
      // Add connection to set
      connections.add(controller)
      
      // Keep connection alive with heartbeat
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(new TextEncoder().encode(': heartbeat\n\n'))
        } catch {
          clearInterval(heartbeat)
          connections.delete(controller)
        }
      }, 30000) // 30 second heartbeat
      
      // Clean up on close
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat)
        connections.delete(controller)
        controller.close()
      })
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Cache-Control'
    }
  })
} 