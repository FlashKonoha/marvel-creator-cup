import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { broadcastUpdate } from '../../../lib/sse-broadcast'
import { 
  getDraftState, 
  setDraftState, 
  type DraftState
} from '../../../lib/database'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'

// Rate limiting (simple in-memory for demo - use Redis in production)
const requestCounts = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 100 // requests per minute per IP
const RATE_LIMIT_WINDOW = 60000 // 1 minute



// Simple rate limiting
const checkRateLimit = (ip: string): boolean => {
  const now = Date.now()
  const userRequests = requestCounts.get(ip)
  
  if (!userRequests || now > userRequests.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }
  
  if (userRequests.count >= RATE_LIMIT) {
    return false
  }
  
  userRequests.count++
  return true
}

// Write state to database with SSE broadcast
const writeState = async (data: DraftState) => {
  try {
    const success = await setDraftState(data)
    
    if (success) {
      // Broadcast update to connected clients
      await broadcastUpdate(data)
    }
    
    return success
  } catch (error) {
    console.error('Error writing draft state:', error)
    return false
  }
}

export async function GET(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' }, 
      { status: 429 }
    )
  }

  try {
    const state = await getDraftState()
    
    // Add cache headers for CDN/proxy caching
    const response = NextResponse.json(state)
    response.headers.set('Cache-Control', 'public, max-age=5, s-maxage=5')
    response.headers.set('ETag', JSON.stringify(state))
    
    return response
  } catch (error) {
    console.error('Error reading draft state:', error)
    return NextResponse.json({ error: 'Failed to load draft state' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  // Check authentication for admin actions
  const token = request.cookies.get('admin-token')?.value
  
  if (!token) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  try {
    const decoded = verify(token, JWT_SECRET) as { role: string }
    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }
  } catch {
    return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 })
  }

  // Rate limiting for admin actions
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' }, 
      { status: 429 }
    )
  }

  try {
    const body = await request.json()
    const { teams, players } = body
    
    if (!teams || !players) {
      return NextResponse.json({ error: 'Missing teams or players data' }, { status: 400 })
    }

    const success = await writeState({ teams, players })
    
    if (success) {
      return NextResponse.json({ success: true, teams, players })
    } else {
      return NextResponse.json({ error: 'Failed to save state' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error updating draft state:', error)
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
  }
} 