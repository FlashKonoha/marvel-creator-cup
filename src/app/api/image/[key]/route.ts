import { NextRequest, NextResponse } from 'next/server'
import { getRedisClient } from '@/lib/redis-pool'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params

    if (!key) {
      return NextResponse.json(
        { error: 'Image key is required' },
        { status: 400 }
      )
    }

    // Get image data from Redis
    const redis = await getRedisClient()
    const imageData = await redis.get(key)

    if (!imageData || typeof imageData !== 'object' || !('data' in imageData)) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }

    const { data, type } = imageData as { data: string; type: string }

    // Convert base64 back to buffer
    const buffer = Buffer.from(data, 'base64')

    // Return image with proper headers for Next.js Image optimization
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': type,
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
        'Content-Length': buffer.length.toString(),
        'Accept-Ranges': 'bytes',
        'ETag': `"${key}-${buffer.length}"`,
        'Last-Modified': new Date().toUTCString(),
      },
    })

  } catch (error) {
    console.error('Image serve error:', error)
    return NextResponse.json(
      { error: 'Failed to serve image' },
      { status: 500 }
    )
  }
} 