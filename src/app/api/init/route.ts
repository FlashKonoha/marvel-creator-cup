import { NextResponse } from 'next/server'
import { initializeDefaultData } from '../../../lib/database'

export async function POST() {
  try {
    await initializeDefaultData()
    return NextResponse.json({ success: true, message: 'Database initialized successfully' })
  } catch (error) {
    console.error('Error initializing database:', error)
    return NextResponse.json({ error: 'Failed to initialize database' }, { status: 500 })
  }
} 