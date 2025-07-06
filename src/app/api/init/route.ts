import { NextResponse } from 'next/server'
import { initializeDefaultData } from '../../../lib/database'

export async function POST() {
  try {
    await initializeDefaultData()
    return NextResponse.json({ success: true, message: 'Data initialized successfully' })
  } catch (error) {
    console.error('Error initializing data:', error)
    return NextResponse.json({ error: 'Failed to initialize data' }, { status: 500 })
  }
} 