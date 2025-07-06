import { NextRequest, NextResponse } from 'next/server'
import { getRedisClient } from '@/lib/redis-pool'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Check file size (2MB limit)
    const maxSize = 2 * 1024 * 1024 // 2MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 2MB limit' },
        { status: 400 }
      )
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed' },
        { status: 400 }
      )
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64String = buffer.toString('base64')
    
    // Generate unique key for Redis
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const imageKey = `player-image-${timestamp}-${randomString}`
    
    // Store in Redis
    const redis = await getRedisClient()
    await redis.set(imageKey, {
      data: base64String,
      type: file.type,
      name: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString()
    })
    
    // Set expiration (optional - images will be stored for 1 year)
    await redis.expire(imageKey, 365 * 24 * 60 * 60) // 1 year in seconds

    return NextResponse.json({ 
      success: true, 
      url: `/api/image/${imageKey}`,
      fileName: file.name,
      key: imageKey
    })

  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
} 