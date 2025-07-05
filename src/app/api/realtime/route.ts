import { NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'
import { addConnection, removeConnection } from '../../../lib/sse-broadcast'

const DATA_FILE = path.join(process.cwd(), 'data', 'draft-state.json')

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
    start(controller) {
      // Send initial state immediately
      const initialState = readState()
      const message = `data: ${JSON.stringify(initialState)}\n\n`
      controller.enqueue(new TextEncoder().encode(message))
      
      // Add connection to set
      addConnection(controller)
      
      // Keep connection alive with heartbeat
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(new TextEncoder().encode(': heartbeat\n\n'))
        } catch {
          clearInterval(heartbeat)
          removeConnection(controller)
        }
      }, 30000) // 30 second heartbeat
      
      // Clean up on close
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat)
        removeConnection(controller)
        controller.close()
      })
    }
  })

  return new Response(stream, { headers })
} 