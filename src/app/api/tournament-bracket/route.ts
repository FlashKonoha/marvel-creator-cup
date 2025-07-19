import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { broadcastTournamentUpdate } from '../../../lib/sse-broadcast'
import { 
  getTournamentBracketState, 
  setTournamentBracketState, 
  type TournamentBracketState, 
  type Match 
} from '../../../lib/database'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
// Rate limiting for admin actions
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const MAX_ATTEMPTS = 10
const LOCKOUT_DURATION = 60 * 1000 // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const attempts = rateLimitMap.get(ip)
  
  if (attempts && now < attempts.resetTime) {
    if (attempts.count >= MAX_ATTEMPTS) {
      return false
    }
    attempts.count++
  } else {
    rateLimitMap.set(ip, { count: 1, resetTime: now + LOCKOUT_DURATION })
  }
  
  return true
}

function updateBracketProgression(bracketState: TournamentBracketState) {
  const { brackets, grandFinal } = bracketState

  // Update upper bracket progression
  // Quarterfinals -> Semifinals
  if (brackets.upper.quarterfinals[0].winner) {
    brackets.upper.semifinals[0].team1 = brackets.upper.quarterfinals[0].winner
  }
  if (brackets.upper.quarterfinals[1].winner) {
    brackets.upper.semifinals[0].team2 = brackets.upper.quarterfinals[1].winner
  }
  if (brackets.upper.quarterfinals[2].winner) {
    brackets.upper.semifinals[1].team1 = brackets.upper.quarterfinals[2].winner
  }
  if (brackets.upper.quarterfinals[3].winner) {
    brackets.upper.semifinals[1].team2 = brackets.upper.quarterfinals[3].winner
  }

  // Semifinals -> Final
  if (brackets.upper.semifinals[0].winner && brackets.upper.semifinals[1].winner) {
    brackets.upper.final[0].team1 = brackets.upper.semifinals[0].winner
    brackets.upper.final[0].team2 = brackets.upper.semifinals[1].winner
  }

  // Upper Final -> Grand Final (winner goes to team1)
  if (brackets.upper.final[0].winner) {
    grandFinal.team1 = brackets.upper.final[0].winner
  }

  // Update lower bracket progression
  // Losers from upper quarterfinals go to lower round 1
  const upperLosers = brackets.upper.quarterfinals
    .filter((match: Match) => match.loser)
    .map((match: Match) => match.loser)

  if (upperLosers.length >= 2) {
    brackets.lower.round1[0].team1 = upperLosers[0]
    brackets.lower.round1[0].team2 = upperLosers[1]
  }
  if (upperLosers.length >= 4) {
    brackets.lower.round1[1].team1 = upperLosers[2]
    brackets.lower.round1[1].team2 = upperLosers[3]
  }

  // Update lower bracket progression based on completed matches
  if (brackets.lower.round1[0].winner && brackets.lower.round1[1].winner) {
    brackets.lower.round2[0].team1 = brackets.lower.round1[0].winner
    brackets.lower.round2[0].team2 = brackets.lower.round1[1].winner
  }

  // Losers from upper semifinals go to lower bracket
  const semifinalLosers = brackets.upper.semifinals
    .filter((match: Match) => match.loser)
    .map((match: Match) => match.loser)

  if (semifinalLosers.length >= 2) {
    brackets.lower.round2[1].team1 = semifinalLosers[0]
    brackets.lower.round2[1].team2 = semifinalLosers[1]
  }

  // Lower bracket progression continues...
  if (brackets.lower.round2[0].winner && brackets.lower.round2[1].winner) {
    brackets.lower.round3[0].team1 = brackets.lower.round2[0].winner
    brackets.lower.round3[0].team2 = brackets.lower.round2[1].winner
  }

  // Lower final - winner from lower round 3 goes to team1
  if (brackets.lower.round3[0].winner) {
    brackets.lower.final[0].team1 = brackets.lower.round3[0].winner
  }

  // Loser from upper final goes to lower final (team2)
  if (brackets.upper.final[0].loser) {
    brackets.lower.final[0].team2 = brackets.upper.final[0].loser
  }

  // Lower final winner goes to grand final (team2)
  if (brackets.lower.final[0].winner) {
    grandFinal.team2 = brackets.lower.final[0].winner
  }

  return bracketState
}

export async function GET() {
  try {
    const bracketState = await getTournamentBracketState()
    return NextResponse.json(bracketState)
  } catch (error) {
    console.error('Error in GET /api/tournament-bracket:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
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
    const { action, data } = body

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 })
    }

    let bracketState = await getTournamentBracketState()

    switch (action) {
      case 'initialize_bracket':
        // Initialize bracket with teams
        const { teams } = data
        if (!teams || !Array.isArray(teams) || teams.length < 4) {
          return NextResponse.json({ error: 'At least 4 teams required' }, { status: 400 })
        }

        // Assign teams to quarterfinal matches
        for (let i = 0; i < Math.min(teams.length, 8); i += 2) {
          const matchIndex = Math.floor(i / 2)
          if (matchIndex < bracketState.brackets.upper.quarterfinals.length) {
            bracketState.brackets.upper.quarterfinals[matchIndex].team1 = teams[i]
            if (i + 1 < teams.length) {
              bracketState.brackets.upper.quarterfinals[matchIndex].team2 = teams[i + 1]
            }
          }
        }

        bracketState.tournament.status = 'active'
        break

      case 'update_match_result':
        // Update match result and progress bracket
        const { matchId, team1Score, team2Score, matchTime } = data
        
        if (!matchId || typeof team1Score !== 'number' || typeof team2Score !== 'number') {
          return NextResponse.json({ error: 'Invalid match data' }, { status: 400 })
        }

        // Find and update the match
        let matchFound = false
        
        // Search in upper bracket
        for (const round of Object.values(bracketState.brackets.upper) as Match[][]) {
          for (const match of round) {
            if (match.id === matchId) {
              match.team1Score = team1Score
              match.team2Score = team2Score
              match.scheduledTime = matchTime || null
              
              // Determine winner based on Best of X logic
              const maxScore = Math.max(team1Score, team2Score)
              const requiredWins = Math.ceil(match.bestOf / 2)
              
              if (maxScore >= requiredWins) {
                match.winner = team1Score > team2Score ? match.team1 : match.team2
                match.loser = team1Score > team2Score ? match.team2 : match.team1
                match.status = 'completed'
                match.completedTime = new Date().toISOString()
              } else {
                // Match is still ongoing (tied or not enough games played)
                match.winner = null
                match.loser = null
                match.status = 'pending'
                match.completedTime = null
              }
              
              matchFound = true
              break
            }
          }
          if (matchFound) break
        }

        // Search in lower bracket
        if (!matchFound) {
          for (const round of Object.values(bracketState.brackets.lower) as Match[][]) {
            for (const match of round) {
              if (match.id === matchId) {
                match.team1Score = team1Score
                match.team2Score = team2Score
                match.scheduledTime = matchTime || null
                
                // Determine winner based on Best of X logic
                const maxScore = Math.max(team1Score, team2Score)
                const requiredWins = Math.ceil(match.bestOf / 2)
                
                if (maxScore >= requiredWins) {
                  match.winner = team1Score > team2Score ? match.team1 : match.team2
                  match.loser = team1Score > team2Score ? match.team2 : match.team1
                  match.status = 'completed'
                  match.completedTime = new Date().toISOString()
                } else {
                  // Match is still ongoing (tied or not enough games played)
                  match.winner = null
                  match.loser = null
                  match.status = 'pending'
                  match.completedTime = null
                }
                
                matchFound = true
                break
              }
            }
            if (matchFound) break
          }
        }

        // Search in grand final
        if (!matchFound && bracketState.grandFinal.id === matchId) {
          bracketState.grandFinal.team1Score = team1Score
          bracketState.grandFinal.team2Score = team2Score
          bracketState.grandFinal.scheduledTime = matchTime || null
          
          // Determine winner based on Best of X logic
          const maxScore = Math.max(team1Score, team2Score)
          const requiredWins = Math.ceil(bracketState.grandFinal.bestOf / 2)
          
          if (maxScore >= requiredWins) {
            bracketState.grandFinal.winner = team1Score > team2Score ? bracketState.grandFinal.team1 : bracketState.grandFinal.team2
            bracketState.grandFinal.loser = team1Score > team2Score ? bracketState.grandFinal.team2 : bracketState.grandFinal.team1
            bracketState.grandFinal.status = 'completed'
            bracketState.grandFinal.completedTime = new Date().toISOString()
          } else {
            // Match is still ongoing (tied or not enough games played)
            bracketState.grandFinal.winner = null
            bracketState.grandFinal.loser = null
            bracketState.grandFinal.status = 'pending'
            bracketState.grandFinal.completedTime = null
          }
          
          matchFound = true
        }

        if (!matchFound) {
          return NextResponse.json({ error: 'Match not found' }, { status: 404 })
        }

        // Update bracket progression
        bracketState = updateBracketProgression(bracketState)
        break

      case 'reset_bracket':
        // Reset bracket to initial state
        const initialBracketState = {
          tournament: {
            id: "marvel-creator-cup-2025",
            name: "Marvel Creator Cup 2025",
            status: "registration",
            startDate: "2025-07-25",
            format: "double-elimination",
            maxTeams: 8
          },
          brackets: {
            upper: {
              quarterfinals: [
                {
                  id: "uf-qf-1",
                  team1: null,
                  team2: null,
                  team1Score: 0,
                  team2Score: 0,
                  winner: null,
                  loser: null,
                  status: "pending",
                  bestOf: 3,
                  scheduledTime: null,
                  completedTime: null
                },
                {
                  id: "uf-qf-2",
                  team1: null,
                  team2: null,
                  team1Score: 0,
                  team2Score: 0,
                  winner: null,
                  loser: null,
                  status: "pending",
                  bestOf: 3,
                  scheduledTime: null,
                  completedTime: null
                },
                {
                  id: "uf-qf-3",
                  team1: null,
                  team2: null,
                  team1Score: 0,
                  team2Score: 0,
                  winner: null,
                  loser: null,
                  status: "pending",
                  bestOf: 3,
                  scheduledTime: null,
                  completedTime: null
                },
                {
                  id: "uf-qf-4",
                  team1: null,
                  team2: null,
                  team1Score: 0,
                  team2Score: 0,
                  winner: null,
                  loser: null,
                  status: "pending",
                  bestOf: 3,
                  scheduledTime: null,
                  completedTime: null
                }
              ],
              semifinals: [
                {
                  id: "uf-sf-1",
                  team1: null,
                  team2: null,
                  team1Score: 0,
                  team2Score: 0,
                  winner: null,
                  loser: null,
                  status: "pending",
                  bestOf: 3,
                  scheduledTime: null,
                  completedTime: null
                },
                {
                  id: "uf-sf-2",
                  team1: null,
                  team2: null,
                  team1Score: 0,
                  team2Score: 0,
                  winner: null,
                  loser: null,
                  status: "pending",
                  bestOf: 3,
                  scheduledTime: null,
                  completedTime: null
                }
              ],
              final: [
                {
                  id: "uf-final",
                  team1: null,
                  team2: null,
                  team1Score: 0,
                  team2Score: 0,
                  winner: null,
                  loser: null,
                  status: "pending",
                  bestOf: 3,
                  scheduledTime: null,
                  completedTime: null
                }
              ]
            },
            lower: {
              round1: [
                {
                  id: "lf-r1-1",
                  team1: null,
                  team2: null,
                  team1Score: 0,
                  team2Score: 0,
                  winner: null,
                  loser: null,
                  status: "pending",
                  bestOf: 3,
                  scheduledTime: null,
                  completedTime: null
                },
                {
                  id: "lf-r1-2",
                  team1: null,
                  team2: null,
                  team1Score: 0,
                  team2Score: 0,
                  winner: null,
                  loser: null,
                  status: "pending",
                  bestOf: 3,
                  scheduledTime: null,
                  completedTime: null
                }
              ],
              round2: [
                {
                  id: "lf-r2-1",
                  team1: null,
                  team2: null,
                  team1Score: 0,
                  team2Score: 0,
                  winner: null,
                  loser: null,
                  status: "pending",
                  bestOf: 3,
                  scheduledTime: null,
                  completedTime: null
                },
                {
                  id: "lf-r2-2",
                  team1: null,
                  team2: null,
                  team1Score: 0,
                  team2Score: 0,
                  winner: null,
                  loser: null,
                  status: "pending",
                  bestOf: 3,
                  scheduledTime: null,
                  completedTime: null
                }
              ],
              round3: [
                {
                  id: "lf-r3-1",
                  team1: null,
                  team2: null,
                  team1Score: 0,
                  team2Score: 0,
                  winner: null,
                  loser: null,
                  status: "pending",
                  bestOf: 3,
                  scheduledTime: null,
                  completedTime: null
                }
              ],
              final: [
                {
                  id: "lf-final",
                  team1: null,
                  team2: null,
                  team1Score: 0,
                  team2Score: 0,
                  winner: null,
                  loser: null,
                  status: "pending",
                  bestOf: 3,
                  scheduledTime: null,
                  completedTime: null
                }
              ]
            }
          },
          grandFinal: {
            id: "grand-final",
            team1: null,
            team2: null,
            team1Score: 0,
            team2Score: 0,
            winner: null,
            loser: null,
            status: "pending",
            bestOf: 5,
            scheduledTime: null,
            completedTime: null
          }
        }
        bracketState = initialBracketState as TournamentBracketState
        break

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Save updated state
    const success = await setTournamentBracketState(bracketState)
    
    if (success) {
      // Broadcast update to connected clients
      await broadcastTournamentUpdate()
      return NextResponse.json({ success: true, data: bracketState })
    } else {
      return NextResponse.json({ error: 'Failed to save bracket state' }, { status: 500 })
    }

  } catch (error) {
    console.error('Error in POST /api/tournament-bracket:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 