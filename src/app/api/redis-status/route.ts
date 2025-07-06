import { NextResponse } from 'next/server'
import { redisPool } from '@/lib/redis-pool'

export async function GET() {
  try {
    const status = redisPool.getPoolStatus()
    
    return NextResponse.json({
      success: true,
      pool: status,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    })
  } catch (error) {
    console.error('Error getting Redis pool status:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get Redis pool status',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 