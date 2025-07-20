import { NextResponse } from 'next/server'
import { getDraftState, getTournamentBracketState } from '../../../lib/database'

export async function GET() {
  try {
    const [draftState, tournamentState] = await Promise.all([
      getDraftState(),
      getTournamentBracketState()
    ])

    return NextResponse.json({
      draft: {
        lastUpdated: draftState.lastUpdated || new Date().toISOString()
      },
      tournament: {
        lastUpdated: tournamentState.tournament?.lastUpdated || new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error fetching update timestamps:', error)
    return NextResponse.json({ error: 'Failed to fetch update timestamps' }, { status: 500 })
  }
} 