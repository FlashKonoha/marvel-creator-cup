import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { broadcastTournamentUpdate } from '../../../lib/sse-broadcast'
import { 
  getTournamentBracketState, 
  setTournamentBracketState
} from '../../../lib/database'
import type { TournamentState, Group, GroupMatch } from '../../../data/tournamentBracketData'

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

// Helper function to generate round-robin matches for a group
function generateRoundRobinMatches(teams: { id: string; name: string; logo?: string }[], groupId: string): GroupMatch[] {
  const matches: GroupMatch[] = []
  const teamIds = teams.map(team => team.id)
  
  // Generate all possible pairs
  for (let i = 0; i < teamIds.length; i++) {
    for (let j = i + 1; j < teamIds.length; j++) {
      const match: GroupMatch = {
        id: `${groupId}-match-${matches.length + 1}`,
        title: `${teams[i].name} vs ${teams[j].name}`,
        team1: {
          id: teams[i].id,
          name: teams[i].name,
          logo: teams[i].logo || '/logo.png',
          score: 0,
          isWinner: false,
          isLoser: false
        },
        team2: {
          id: teams[j].id,
          name: teams[j].name,
          logo: teams[j].logo || '/logo.png',
          score: 0,
          isWinner: false,
          isLoser: false
        },
        team1MapWins: 0,
        team2MapWins: 0,
        status: 'pending',
        scheduledTime: null,
        completedTime: null
      }
      matches.push(match)
    }
  }
  
  return matches
}

// Helper function to calculate group standings
function calculateGroupStandings(group: Group): Group['standings'] {
  const teamStats = new Map<string, {
    team: { id: string; name: string; logo: string; score: number; isWinner: boolean; isLoser: boolean };
    matchesPlayed: number;
    mapWins: number;
    mapLosses: number;
    totalScore: number;
  }>()

  // Initialize stats for all teams
  group.teams.forEach(team => {
    teamStats.set(team.id, {
      team,
      matchesPlayed: 0,
      mapWins: 0,
      mapLosses: 0,
      totalScore: 0
    })
  })

  // Calculate stats from completed matches
  group.matches.forEach(match => {
    if (match.status === 'completed') {
      const team1Stats = teamStats.get(match.team1.id)!
      const team2Stats = teamStats.get(match.team2.id)!

      team1Stats.matchesPlayed++
      team2Stats.matchesPlayed++
      team1Stats.mapWins += match.team1MapWins
      team1Stats.mapLosses += match.team2MapWins
      team2Stats.mapWins += match.team2MapWins
      team2Stats.mapLosses += match.team1MapWins
      team1Stats.totalScore += match.team1MapWins
      team2Stats.totalScore += match.team2MapWins
    }
  })

  // Convert to standings array and sort
  const standings = Array.from(teamStats.values())
    .map((stats, index) => ({
      team: stats.team,
      matchesPlayed: stats.matchesPlayed,
      mapWins: stats.mapWins,
      mapLosses: stats.mapLosses,
      totalScore: stats.totalScore,
      rank: index + 1
    }))
    .sort((a, b) => {
      // Sort by total score (descending), then by map wins (descending)
      if (a.totalScore !== b.totalScore) {
        return b.totalScore - a.totalScore
      }
      return b.mapWins - a.mapWins
    })
    .map((standing, index) => ({
      ...standing,
      rank: index + 1
    }))

  return standings
}

// Helper function to advance teams to final stage
function advanceTeamsToFinalStage(tournamentState: TournamentState): TournamentState {
  const { groupStage } = tournamentState
  
  // Get top 3 teams from each group
  const groupAStandings = groupStage.groups[0].standings.slice(0, 3)
  const groupBStandings = groupStage.groups[1].standings.slice(0, 3)

  // Update semifinal (Seed 1A vs Seed 1B)
  tournamentState.finalStage.semifinal.team1 = groupAStandings[0].team
  tournamentState.finalStage.semifinal.team2 = groupBStandings[0].team

  // Update seed 2 match (Seed 2A vs Seed 2B)
  tournamentState.finalStage.seed2Match.team1 = groupAStandings[1].team
  tournamentState.finalStage.seed2Match.team2 = groupBStandings[1].team

  // Update seed 3 match (Seed 3A vs Seed 3B)
  tournamentState.finalStage.seed3Match.team1 = groupAStandings[2].team
  tournamentState.finalStage.seed3Match.team2 = groupBStandings[2].team

  return tournamentState
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

    let tournamentState = await getTournamentBracketState()

    switch (action) {
      case 'initialize_tournament':
        // Initialize tournament with teams
        const { teams } = data
        if (!teams || !Array.isArray(teams) || teams.length < 6) {
          return NextResponse.json({ error: 'At least 6 teams required' }, { status: 400 })
        }

        // Split teams into 2 groups
        const midPoint = Math.ceil(teams.length / 2)
        const groupATeams = teams.slice(0, midPoint)
        const groupBTeams = teams.slice(midPoint)

        // Generate round-robin matches for each group
        const groupAMatches = generateRoundRobinMatches(groupATeams, 'group-a')
        const groupBMatches = generateRoundRobinMatches(groupBTeams, 'group-b')

        // Create new tournament state
        tournamentState = {
          tournament: {
            id: "marvel-creator-cup-2024",
            name: "Marvel Creator Cup 2024",
            status: "group_stage",
            format: "Group Stage + Final Stage",
            startDate: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
          },
          groupStage: {
            isCompleted: false,
            groups: [
              {
                id: "group-a",
                name: "Group A",
                teams: groupATeams.map(team => ({
                  id: team.id,
                  name: team.name,
                  logo: team.logo || '/logo.png',
                  score: 0,
                  isWinner: false,
                  isLoser: false
                })),
                matches: groupAMatches,
                standings: []
              },
              {
                id: "group-b",
                name: "Group B",
                teams: groupBTeams.map(team => ({
                  id: team.id,
                  name: team.name,
                  logo: team.logo || '/logo.png',
                  score: 0,
                  isWinner: false,
                  isLoser: false
                })),
                matches: groupBMatches,
                standings: []
              }
            ]
          },
          finalStage: {
            isCompleted: false,
            semifinal: {
              id: "semifinal",
              title: "Seed 1A vs Seed 1B",
              team1: { id: "tbd", name: "TBD", logo: "/logo.png", score: 0, isWinner: false, isLoser: false },
              team2: { id: "tbd", name: "TBD", logo: "/logo.png", score: 0, isWinner: false, isLoser: false },
              team1Score: 0,
              team2Score: 0,
              status: "pending",
              scheduledTime: null,
              completedTime: null,
              stage: "semifinal"
            },
            seed2Match: {
              id: "seed2-match",
              title: "Seed 2A vs Seed 2B",
              team1: { id: "tbd", name: "TBD", logo: "/logo.png", score: 0, isWinner: false, isLoser: false },
              team2: { id: "tbd", name: "TBD", logo: "/logo.png", score: 0, isWinner: false, isLoser: false },
              team1Score: 0,
              team2Score: 0,
              status: "pending",
              scheduledTime: null,
              completedTime: null,
              stage: "seed2"
            },
            seed3Match: {
              id: "seed3-match",
              title: "Seed 3A vs Seed 3B",
              team1: { id: "tbd", name: "TBD", logo: "/logo.png", score: 0, isWinner: false, isLoser: false },
              team2: { id: "tbd", name: "TBD", logo: "/logo.png", score: 0, isWinner: false, isLoser: false },
              team1Score: 0,
              team2Score: 0,
              status: "pending",
              scheduledTime: null,
              completedTime: null,
              stage: "seed3"
            },
            playoffMatch: {
              id: "playoff-match",
              title: "Seed 2 Winner vs Seed 3 Winner",
              team1: { id: "tbd", name: "TBD", logo: "/logo.png", score: 0, isWinner: false, isLoser: false },
              team2: { id: "tbd", name: "TBD", logo: "/logo.png", score: 0, isWinner: false, isLoser: false },
              team1Score: 0,
              team2Score: 0,
              status: "pending",
              scheduledTime: null,
              completedTime: null,
              stage: "playoff"
            },
            grandFinal: {
              id: "grand-final",
              title: "Semifinal Winner vs Playoff Winner",
              team1: { id: "tbd", name: "TBD", logo: "/logo.png", score: 0, isWinner: false, isLoser: false },
              team2: { id: "tbd", name: "TBD", logo: "/logo.png", score: 0, isWinner: false, isLoser: false },
              team1Score: 0,
              team2Score: 0,
              status: "pending",
              scheduledTime: null,
              completedTime: null,
              stage: "grandfinal"
            }
          }
        }
        break

      case 'update_group_match':
        // Update group match result
        const { matchId, team1MapWins, team2MapWins, matchTime } = data
        
        if (!matchId || typeof team1MapWins !== 'number' || typeof team2MapWins !== 'number') {
          return NextResponse.json({ error: 'Invalid match data' }, { status: 400 })
        }

        // Find and update the match
        let matchFound = false
        for (const group of tournamentState.groupStage.groups) {
          for (const match of group.matches) {
            if (match.id === matchId) {
              match.team1MapWins = team1MapWins
              match.team2MapWins = team2MapWins
              match.scheduledTime = matchTime || null
              
              // Determine winner (best of 3 maps)
              if (team1MapWins > team2MapWins) {
                match.team1.isWinner = true
                match.team1.isLoser = false
                match.team2.isWinner = false
                match.team2.isLoser = true
                match.status = 'completed'
                match.completedTime = new Date().toISOString()
              } else if (team2MapWins > team1MapWins) {
                match.team1.isWinner = false
                match.team1.isLoser = true
                match.team2.isWinner = true
                match.team2.isLoser = false
                match.status = 'completed'
                match.completedTime = new Date().toISOString()
              } else {
                // Match is still ongoing (tied)
                match.team1.isWinner = false
                match.team1.isLoser = false
                match.team2.isWinner = false
                match.team2.isLoser = false
                match.status = 'ongoing'
                match.completedTime = null
              }
              
              matchFound = true
              break
            }
          }
          if (matchFound) break
        }

        if (!matchFound) {
          return NextResponse.json({ error: 'Match not found' }, { status: 404 })
        }

        // Recalculate standings for all groups
        for (const group of tournamentState.groupStage.groups) {
          group.standings = calculateGroupStandings(group)
        }

        // Check if all group matches are completed
        const allMatchesCompleted = tournamentState.groupStage.groups.every(group =>
          group.matches.every(match => match.status === 'completed')
        )

        if (allMatchesCompleted) {
          tournamentState.groupStage.isCompleted = true
        }
        break

      case 'update_final_match':
        // Update final stage match result
        const { matchId: finalMatchId, team1Score, team2Score, matchTime: finalMatchTime } = data
        
        if (!finalMatchId || typeof team1Score !== 'number' || typeof team2Score !== 'number') {
          return NextResponse.json({ error: 'Invalid match data' }, { status: 400 })
        }

        // Find and update the match
        let finalMatchFound = false
        const finalMatches = [
          tournamentState.finalStage.semifinal,
          tournamentState.finalStage.seed2Match,
          tournamentState.finalStage.seed3Match,
          tournamentState.finalStage.playoffMatch,
          tournamentState.finalStage.grandFinal
        ]

        for (const match of finalMatches) {
          if (match.id === finalMatchId) {
            match.team1Score = team1Score
            match.team2Score = team2Score
            match.scheduledTime = finalMatchTime || null
            
            // Determine winner (best of 3)
            const maxScore = Math.max(team1Score, team2Score)
            const requiredWins = 2 // Best of 3
            
            if (maxScore >= requiredWins) {
              if (team1Score > team2Score) {
                match.team1.isWinner = true
                match.team1.isLoser = false
                match.team2.isWinner = false
                match.team2.isLoser = true
              } else {
                match.team1.isWinner = false
                match.team1.isLoser = true
                match.team2.isWinner = true
                match.team2.isLoser = false
              }
              match.status = 'completed'
              match.completedTime = new Date().toISOString()
            } else {
              // Match is still ongoing
              match.team1.isWinner = false
              match.team1.isLoser = false
              match.team2.isWinner = false
              match.team2.isLoser = false
              match.status = 'ongoing'
              match.completedTime = null
            }
            
            finalMatchFound = true
            break
          }
        }

        if (!finalMatchFound) {
          return NextResponse.json({ error: 'Match not found' }, { status: 404 })
        }

        // Update playoff match teams when seed matches are completed
        if (finalMatchId === 'seed2-match' && tournamentState.finalStage.seed2Match.status === 'completed') {
          tournamentState.finalStage.playoffMatch.team1 = tournamentState.finalStage.seed2Match.team1.isWinner 
            ? tournamentState.finalStage.seed2Match.team1 
            : tournamentState.finalStage.seed2Match.team2
        }

        if (finalMatchId === 'seed3-match' && tournamentState.finalStage.seed3Match.status === 'completed') {
          tournamentState.finalStage.playoffMatch.team2 = tournamentState.finalStage.seed3Match.team1.isWinner 
            ? tournamentState.finalStage.seed3Match.team1 
            : tournamentState.finalStage.seed3Match.team2
        }

        // Update grand final teams when semifinal and playoff are completed
        if (finalMatchId === 'semifinal' && tournamentState.finalStage.semifinal.status === 'completed') {
          tournamentState.finalStage.grandFinal.team1 = tournamentState.finalStage.semifinal.team1.isWinner 
            ? tournamentState.finalStage.semifinal.team1 
            : tournamentState.finalStage.semifinal.team2
        }

        if (finalMatchId === 'playoff-match' && tournamentState.finalStage.playoffMatch.status === 'completed') {
          tournamentState.finalStage.grandFinal.team2 = tournamentState.finalStage.playoffMatch.team1.isWinner 
            ? tournamentState.finalStage.playoffMatch.team1 
            : tournamentState.finalStage.playoffMatch.team2
        }

        // Check if tournament is completed
        if (tournamentState.finalStage.grandFinal.status === 'completed') {
          tournamentState.tournament.status = 'completed'
          tournamentState.finalStage.isCompleted = true
        }
        break

      case 'advance_to_final_stage':
        // Advance teams from group stage to final stage
        if (!tournamentState.groupStage.isCompleted) {
          return NextResponse.json({ error: 'Group stage must be completed first' }, { status: 400 })
        }

        tournamentState = advanceTeamsToFinalStage(tournamentState)
        tournamentState.tournament.status = 'final_stage'
        break

      case 'reset_tournament':
        // Reset tournament to initial state
        tournamentState = {
          tournament: {
            id: "marvel-creator-cup-2024",
            name: "Marvel Creator Cup 2024",
            status: "pending",
            format: "Group Stage + Final Stage",
            startDate: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
          },
          groupStage: {
            isCompleted: false,
            groups: []
          },
          finalStage: {
            isCompleted: false,
            semifinal: {
              id: "semifinal",
              title: "Seed 1A vs Seed 1B",
              team1: { id: "tbd", name: "TBD", logo: "/logo.png", score: 0, isWinner: false, isLoser: false },
              team2: { id: "tbd", name: "TBD", logo: "/logo.png", score: 0, isWinner: false, isLoser: false },
              team1Score: 0,
              team2Score: 0,
              status: "pending",
              scheduledTime: null,
              completedTime: null,
              stage: "semifinal"
            },
            seed2Match: {
              id: "seed2-match",
              title: "Seed 2A vs Seed 2B",
              team1: { id: "tbd", name: "TBD", logo: "/logo.png", score: 0, isWinner: false, isLoser: false },
              team2: { id: "tbd", name: "TBD", logo: "/logo.png", score: 0, isWinner: false, isLoser: false },
              team1Score: 0,
              team2Score: 0,
              status: "pending",
              scheduledTime: null,
              completedTime: null,
              stage: "seed2"
            },
            seed3Match: {
              id: "seed3-match",
              title: "Seed 3A vs Seed 3B",
              team1: { id: "tbd", name: "TBD", logo: "/logo.png", score: 0, isWinner: false, isLoser: false },
              team2: { id: "tbd", name: "TBD", logo: "/logo.png", score: 0, isWinner: false, isLoser: false },
              team1Score: 0,
              team2Score: 0,
              status: "pending",
              scheduledTime: null,
              completedTime: null,
              stage: "seed3"
            },
            playoffMatch: {
              id: "playoff-match",
              title: "Seed 2 Winner vs Seed 3 Winner",
              team1: { id: "tbd", name: "TBD", logo: "/logo.png", score: 0, isWinner: false, isLoser: false },
              team2: { id: "tbd", name: "TBD", logo: "/logo.png", score: 0, isWinner: false, isLoser: false },
              team1Score: 0,
              team2Score: 0,
              status: "pending",
              scheduledTime: null,
              completedTime: null,
              stage: "playoff"
            },
            grandFinal: {
              id: "grand-final",
              title: "Semifinal Winner vs Playoff Winner",
              team1: { id: "tbd", name: "TBD", logo: "/logo.png", score: 0, isWinner: false, isLoser: false },
              team2: { id: "tbd", name: "TBD", logo: "/logo.png", score: 0, isWinner: false, isLoser: false },
              team1Score: 0,
              team2Score: 0,
              status: "pending",
              scheduledTime: null,
              completedTime: null,
              stage: "grandfinal"
            }
          }
        }
        break

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Update last updated timestamp
    tournamentState.tournament.lastUpdated = new Date().toISOString()

    // Save to database
    await setTournamentBracketState(tournamentState)

    // Broadcast update
    await broadcastTournamentUpdate(tournamentState)

    return NextResponse.json({ data: tournamentState })

  } catch (error) {
    console.error('Error in POST /api/tournament-bracket:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 