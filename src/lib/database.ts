import { getRedisClient } from './redis-pool'
import draftStateJson from '../../data/draft-state.json'
import tournamentBracketStateJson from '../../data/tournament-bracket-state.json'

// Database keys
const DRAFT_STATE_KEY = 'draft-state'
const TOURNAMENT_BRACKET_STATE_KEY = 'tournament-bracket-state'

// Types
export interface Player {
  id: number
  twitchName: string
  twitchImage: string
  twitchLink: string
  rank: string
  preferredRole: string[]
  heroes: string[]
}

export interface Team {
  id: number
  name: string
  image: string
  captain: Player
  players: Player[]
}

export interface DraftState {
  teams: Team[]
  players: Player[]
  lastUpdated?: string
}

export interface Match {
  id: string
  team1: Team | null
  team2: Team | null
  team1Score: number
  team2Score: number
  winner: Team | null
  loser: Team | null
  status: 'pending' | 'completed'
  bestOf: number
  scheduledTime: string | null
  completedTime: string | null
}

export interface TournamentBracketState {
  tournament: {
    id: string
    name: string
    status: string
    startDate: string
    format: string
    maxTeams: number
  }
  brackets: {
    upper: {
      quarterfinals: Match[]
      semifinals: Match[]
      final: Match[]
    }
    lower: {
      round1: Match[]
      round2: Match[]
      round3: Match[]
      final: Match[]
    }
  }
  grandFinal: Match
  lastUpdated?: string
}

// Default data
const defaultDraftData: DraftState = {
  teams: draftStateJson.teams,
  players: draftStateJson.players
}

const defaultTournamentBracketData: TournamentBracketState = tournamentBracketStateJson as TournamentBracketState;

// Draft state operations
export async function getDraftState(): Promise<DraftState> {
  try {
    const redis = await getRedisClient()
    const data = await redis.get<DraftState>(DRAFT_STATE_KEY)
    return data || defaultDraftData
  } catch (error) {
    console.error('Error reading draft state from Redis:', error)
    return defaultDraftData
  }
}

export async function setDraftState(state: DraftState): Promise<boolean> {
  try {
    const redis = await getRedisClient()
    const stateWithTimestamp = {
      ...state,
      lastUpdated: new Date().toISOString()
    }
    await redis.set(DRAFT_STATE_KEY, stateWithTimestamp)
    return true
  } catch (error) {
    console.error('Error writing draft state to Redis:', error)
    return false
  }
}

// Tournament bracket state operations
export async function getTournamentBracketState(): Promise<TournamentBracketState> {
  try {
    const redis = await getRedisClient()
    const data = await redis.get<TournamentBracketState>(TOURNAMENT_BRACKET_STATE_KEY)
    return data || defaultTournamentBracketData
  } catch (error) {
    console.error('Error reading tournament bracket state from Redis:', error)
    return defaultTournamentBracketData
  }
}

export async function setTournamentBracketState(state: TournamentBracketState): Promise<boolean> {
  try {
    const redis = await getRedisClient()
    const stateWithTimestamp = {
      ...state,
      lastUpdated: new Date().toISOString()
    }
    await redis.set(TOURNAMENT_BRACKET_STATE_KEY, stateWithTimestamp)
    return true
  } catch (error) {
    console.error('Error writing tournament bracket state to Redis:', error)
    return false
  }
}

// Initialize default data if not exists
export async function initializeDefaultData(): Promise<void> {
  try {
    const redis = await getRedisClient()
    const draftExists = await redis.exists(DRAFT_STATE_KEY)
    const bracketExists = await redis.exists(TOURNAMENT_BRACKET_STATE_KEY)
    
    if (!draftExists) {
      await redis.set(DRAFT_STATE_KEY, defaultDraftData)
      console.log('Initialized default draft state')
    }
    
    if (!bracketExists) {
      await redis.set(TOURNAMENT_BRACKET_STATE_KEY, defaultTournamentBracketData)
      console.log('Initialized default tournament bracket state')
    }
  } catch (error) {
    console.error('Error initializing default data:', error)
  }
} 
