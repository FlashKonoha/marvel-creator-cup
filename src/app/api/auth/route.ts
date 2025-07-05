import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { sign, verify } from 'jsonwebtoken'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '84f34b752300dece33b4f23878a0fadac6a870a9'
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'

// Rate limiting for login attempts
const loginAttempts = new Map<string, { count: number; resetTime: number }>()
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 })
    }

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const now = Date.now()
    const attempts = loginAttempts.get(ip)
    
    if (attempts && now < attempts.resetTime) {
      if (attempts.count >= MAX_ATTEMPTS) {
        return NextResponse.json(
          { error: 'Too many login attempts. Please try again later.' }, 
          { status: 429 }
        )
      }
    } else {
      loginAttempts.set(ip, { count: 0, resetTime: now + LOCKOUT_DURATION })
    }

    // Verify password
    if (password !== ADMIN_PASSWORD) {
      const currentAttempts = loginAttempts.get(ip)!
      currentAttempts.count++
      
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    // Reset attempts on successful login
    loginAttempts.delete(ip)

    // Create JWT token
    const token = sign({ role: 'admin', timestamp: now }, JWT_SECRET, { expiresIn: '24h' })
    
    // Set HTTP-only cookie
    const response = NextResponse.json({ success: true })
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value
    
    if (!token) {
      return NextResponse.json({ authenticated: false })
    }

    try {
      const decoded = verify(token, JWT_SECRET) as any
      const isValid = decoded.role === 'admin' && decoded.timestamp
      
      return NextResponse.json({ authenticated: isValid })
    } catch (jwtError) {
      return NextResponse.json({ authenticated: false })
    }

  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({ authenticated: false })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('admin-token')
  return response
} 