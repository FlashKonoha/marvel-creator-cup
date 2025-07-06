import { Redis } from '@upstash/redis'

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Database keys
const DRAFT_STATE_KEY = 'draft-state'
const TOURNAMENT_BRACKET_STATE_KEY = 'tournament-bracket-state'

// Types
export interface Player {
  id: number
  twitchName: string
  twitchImage: string
  twitchLink: string
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
}

// Default data
const defaultDraftData: DraftState = {
  teams: [
    {
      id: 1,
      name: 'Avengers Assemble',
      image: 'https://picsum.photos/200/200',
      captain: { id: 101, twitchName: 'CaptainAmerica', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/captainamerica' },
      players: []
    },
    {
      id: 2,
      name: 'X-Men Elite',
      image: 'https://picsum.photos/200/200',
      captain: { id: 102, twitchName: 'WolverinePro', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/wolverinepro' },
      players: []
    },
    {
      id: 3,
      name: 'Guardians Galaxy',
      image: 'https://picsum.photos/200/200',
      captain: { id: 103, twitchName: 'StarLord', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/starlord' },
      players: []
    },
    {
      id: 4,
      name: 'Fantastic Four',
      image: 'https://picsum.photos/200/200',
      captain: { id: 104, twitchName: 'MrFantastic', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/mrfantastic' },
      players: []
    },
    {
      id: 5,
      name: 'Spider-Verse',
      image: 'https://picsum.photos/200/200',
      captain: { id: 105, twitchName: 'SpiderMan', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/spiderman' },
      players: []
    },
    {
      id: 6,
      name: 'Defenders',
      image: 'https://picsum.photos/200/200',
      captain: { id: 106, twitchName: 'Daredevil', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/daredevil' },
      players: []
    }
  ],
  players: [
    { id: 1, twitchName: 'MarvelGamer123', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/marvelgamer123' },
    { id: 2, twitchName: 'RivalsPro', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/rivalspro' },
    { id: 3, twitchName: 'HeroMaster', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/heromaster' },
    { id: 4, twitchName: 'ComicFanatic', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/comicfanatic' },
    { id: 5, twitchName: 'GamingElite', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/gamingelite' },
    { id: 6, twitchName: 'StreamQueen', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/streamqueen' },
    { id: 7, twitchName: 'BattleRoyale', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/battleroyale' },
    { id: 8, twitchName: 'TwitchStar', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/twitchstar' },
    { id: 9, twitchName: 'GamingPro', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/gamingpro' },
    { id: 10, twitchName: 'MarvelFan', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/marvelfan' },
    { id: 11, twitchName: 'RivalsChamp', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/rivalschamp' },
    { id: 12, twitchName: 'HeroHunter', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/herohunter' },
    { id: 13, twitchName: 'GamingLegend', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/gaminglegend' },
    { id: 14, twitchName: 'StreamMaster', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/streammaster' },
    { id: 15, twitchName: 'BattlePro', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/battlepro' },
    { id: 16, twitchName: 'TwitchElite', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/twitchelite' },
    { id: 17, twitchName: 'MarvelHero', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/marvelhero' },
    { id: 18, twitchName: 'RivalsKing', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/rivalsking' },
    { id: 19, twitchName: 'GamingWarrior', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/gamingwarrior' },
    { id: 20, twitchName: 'StreamChampion', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/streamchampion' },
    { id: 21, twitchName: 'BattleMaster', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/battlemaster' },
    { id: 22, twitchName: 'TwitchPro', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/twitchpro' },
    { id: 23, twitchName: 'MarvelChamp', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/marvelchamp' },
    { id: 24, twitchName: 'RivalsElite', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/rivalselite' },
    { id: 25, twitchName: 'GamingHero', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/gaminghero' },
    { id: 26, twitchName: 'StreamWarrior', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/streamwarrior' },
    { id: 27, twitchName: 'BattleElite', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/battleelite' },
    { id: 28, twitchName: 'TwitchMaster', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/twitchmaster' },
    { id: 29, twitchName: 'MarvelElite', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/marvelelite' },
    { id: 30, twitchName: 'RivalsPro', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/rivalspro2' },
    { id: 31, twitchName: 'GamingChamp', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/gamingchamp' },
    { id: 32, twitchName: 'StreamElite', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/streamelite' },
    { id: 33, twitchName: 'BattleHero', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/battlehero' },
    { id: 34, twitchName: 'TwitchChamp', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/twitchchamp' },
    { id: 35, twitchName: 'MarvelMaster', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/marvelmaster' },
    { id: 36, twitchName: 'RivalsHero', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/rivalshero' },
    { id: 37, twitchName: 'GamingElite', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/gamingelite2' },
    { id: 38, twitchName: 'StreamChamp', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/streamchamp' },
    { id: 39, twitchName: 'BattleMaster', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/battlemaster2' },
    { id: 40, twitchName: 'TwitchHero', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/twitchhero' },
    { id: 41, twitchName: 'MarvelWarrior', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/marvelwarrior' },
    { id: 42, twitchName: 'RivalsMaster', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/rivalsmaster' },
    { id: 43, twitchName: 'GamingWarrior', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/gamingwarrior2' },
    { id: 44, twitchName: 'StreamMaster', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/streammaster2' },
    { id: 45, twitchName: 'BattleElite', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/battleelite2' },
    { id: 46, twitchName: 'TwitchMaster', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/twitchmaster2' },
    { id: 47, twitchName: 'MarvelElite', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/marvelelite2' },
    { id: 48, twitchName: 'RivalsWarrior', twitchImage: 'https://picsum.photos/200/200', twitchLink: 'https://twitch.tv/rivalswarrior' }
  ]
}

const defaultTournamentBracketData: TournamentBracketState = {
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

// Draft state operations
export async function getDraftState(): Promise<DraftState> {
  try {
    const data = await redis.get<DraftState>(DRAFT_STATE_KEY)
    return data || defaultDraftData
  } catch (error) {
    console.error('Error reading draft state from Redis:', error)
    return defaultDraftData
  }
}

export async function setDraftState(state: DraftState): Promise<boolean> {
  try {
    await redis.set(DRAFT_STATE_KEY, state)
    return true
  } catch (error) {
    console.error('Error writing draft state to Redis:', error)
    return false
  }
}

// Tournament bracket state operations
export async function getTournamentBracketState(): Promise<TournamentBracketState> {
  try {
    const data = await redis.get<TournamentBracketState>(TOURNAMENT_BRACKET_STATE_KEY)
    return data || defaultTournamentBracketData
  } catch (error) {
    console.error('Error reading tournament bracket state from Redis:', error)
    return defaultTournamentBracketData
  }
}

export async function setTournamentBracketState(state: TournamentBracketState): Promise<boolean> {
  try {
    await redis.set(TOURNAMENT_BRACKET_STATE_KEY, state)
    return true
  } catch (error) {
    console.error('Error writing tournament bracket state to Redis:', error)
    return false
  }
}

// Initialize default data if not exists
export async function initializeDefaultData(): Promise<void> {
  try {
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