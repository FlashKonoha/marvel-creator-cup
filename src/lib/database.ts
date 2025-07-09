import { getRedisClient } from './redis-pool'

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
  teams: [
    {
      id: 1,
      name: 'Avengers Assemble',
      image: '/placeholder.png',
      captain: { 
        id: 101, 
        twitchName: 'CaptainAmerica', 
        twitchImage: '/placeholder.png', 
        twitchLink: 'https://twitch.tv/captainamerica',
        rank: 'Celestial 3',
        preferredRole: ['Strategist', 'Vanguard'],
        heroes: ['Iron Man', 'Captain America']
      },
      players: []
    },
    {
      id: 2,
      name: 'X-Men Elite',
      image: '/placeholder.png',
      captain: { 
        id: 102, 
        twitchName: 'WolverinePro', 
        twitchImage: '/placeholder.png', 
        twitchLink: 'https://twitch.tv/wolverinepro',
        rank: 'One Above All',
        preferredRole: ['Duelist'],
        heroes: ['Wolverine', 'Storm']
      },
      players: []
    },
    {
      id: 3,
      name: 'Guardians Galaxy',
      image: '/placeholder.png',
      captain: { 
        id: 103, 
        twitchName: 'StarLord', 
        twitchImage: '/placeholder.png', 
        twitchLink: 'https://twitch.tv/starlord',
        rank: 'Celestial 1',
        preferredRole: ['Strategist'],
        heroes: ['Star-Lord', 'Gamora']
      },
      players: []
    },
    {
      id: 4,
      name: 'Fantastic Four',
      image: '/placeholder.png',
      captain: { 
        id: 104, 
        twitchName: 'MrFantastic', 
        twitchImage: '/placeholder.png', 
        twitchLink: 'https://twitch.tv/mrfantastic',
        rank: 'Eternity',
        preferredRole: ['Strategist', 'Vanguard'],
        heroes: ['Mr. Fantastic', 'Invisible Woman']
      },
      players: []
    },
    {
      id: 5,
      name: 'Spider-Verse',
      image: '/placeholder.png',
      captain: { 
        id: 105, 
        twitchName: 'SpiderMan', 
        twitchImage: '/placeholder.png', 
        twitchLink: 'https://twitch.tv/spiderman',
        rank: 'Celestial 2',
        preferredRole: ['Duelist', 'Vanguard'],
        heroes: ['Spider-Man', 'Miles Morales']
      },
      players: []
    },
    {
      id: 6,
      name: 'Defenders',
      image: '/placeholder.png',
      captain: { 
        id: 106, 
        twitchName: 'Daredevil', 
        twitchImage: '/placeholder.png', 
        twitchLink: 'https://twitch.tv/daredevil',
        rank: 'Celestial 3',
        preferredRole: ['Duelist'],
        heroes: ['Daredevil', 'Luke Cage']
      },
      players: []
    },
    {
      id: 7,
      name: 'Thunderbolts',
      image: '/placeholder.png',
      captain: { 
        id: 107, 
        twitchName: 'ThunderBolt', 
        twitchImage: '/placeholder.png', 
        twitchLink: 'https://twitch.tv/thunderbolt',
        rank: 'Celestial 1',
        preferredRole: ['Strategist', 'Duelist'],
        heroes: ['Black Panther', 'Shuri']
      },
      players: []
    },
    {
      id: 8,
      name: 'Inhumans',
      image: '/placeholder.png',
      captain: { 
        id: 108, 
        twitchName: 'InhumanKing', 
        twitchImage: '/placeholder.png', 
        twitchLink: 'https://twitch.tv/inhumanking',
        rank: 'Eternity',
        preferredRole: ['Vanguard'],
        heroes: ['Hulk', 'She-Hulk']
      },
      players: []
    }
  ],
  players: [
    {
      id: 1,
      twitchName: 'Alinee',
      twitchImage: '/placeholder.png',
      twitchLink: 'https://www.twitch.tv/alineetv',
      rank: 'Eternity',
      preferredRole: ['Strategist'],
      heroes: ['Luna', 'Invis', 'CND', 'Rocket', 'Adam', 'Mantis']
    },
    {
      id: 2,
      twitchName: 'AndTgro',
      twitchImage: '/placeholder.png',
      twitchLink: 'https://www.twitch.tv/andtgro',
      rank: 'Celestial 2',
      preferredRole: ['Strategist', 'Vanguard'],
      heroes: []
    },
    {
      id: 3,
      twitchName: 'Bencer',
      twitchImage: '/placeholder.png',
      twitchLink: 'https://www.twitch.tv/bencerr_',
      rank: 'Celestial 2',
      preferredRole: ['Duelist'],
      heroes: ['Ironfist']
    },
    {
      id: 4,
      twitchName: 'Day',
      twitchImage: '/placeholder.png',
      twitchLink: 'https://www.twitch.tv/dayy1x',
      rank: 'One Above All',
      preferredRole: ['Duelist'],
      heroes: ['Spider-man']
    },
    {
      id: 5,
      twitchName: 'Feli',
      twitchImage: '/placeholder.png',
      twitchLink: 'https://www.twitch.tv/lmaofeli',
      rank: 'Eternity',
      preferredRole: ['Strategist'],
      heroes: ['Invis']
    },
    {
      id: 6,
      twitchName: 'GragAlbert',
      twitchImage: '/placeholder.png',
      twitchLink: 'https://www.twitch.tv/GragAlbert',
      rank: 'Celestial 1',
      preferredRole: ['Vanguard'],
      heroes: ['Hulk', 'Strange', 'Mag', 'Thing']
    },
    {
      id: 7,
      twitchName: 'KirkCast',
      twitchImage: '/placeholder.png',
      twitchLink: 'https://www.twitch.tv/kirkcast',
      rank: 'Celestial 3',
      preferredRole: ['Vanguard'],
      heroes: ['Any Tank']
    },
    {
      id: 8,
      twitchName: 'Luciyasa',
      twitchImage: '/placeholder.png',
      twitchLink: 'https://twitch.tv/luciyasa',
      rank: 'One Above All',
      preferredRole: ['Strategist'],
      heroes: ['Invis']
    },
    {
      id: 9,
      twitchName: 'Madlilg',
      twitchImage: '/placeholder.png',
      twitchLink: 'https://www.twitch.tv/madlilg13',
      rank: 'Celestial 2',
      preferredRole: ['Duelist'],
      heroes: ['Ironfist', 'magik']
    },
    {
      id: 10,
      twitchName: 'Marc Deezyy',
      twitchImage: '/placeholder.png',
      twitchLink: 'https://www.twitch.tv/marcdeezyy',
      rank: 'Eternity',
      preferredRole: ['Vanguard'],
      heroes: ['Steve Rogers']
    },
    {
      id: 11,
      twitchName: 'Nani the freak',
      twitchImage: '/placeholder.png',
      twitchLink: 'https://www.twitch.tv/nanithefreaks',
      rank: 'Celestial 1',
      preferredRole: ['Duelist'],
      heroes: ['Black Panther']
    },
    {
      id: 12,
      twitchName: 'Nauti',
      twitchImage: '/placeholder.png',
      twitchLink: 'https://www.twitch.tv/nautilifts',
      rank: 'Celestial 3',
      preferredRole: ['Vanguard'],
      heroes: ['Doc Strange']
    },
    {
      id: 13,
      twitchName: 'NoDmgRocket',
      twitchImage: '/placeholder.png',
      twitchLink: 'https://www.twitch.tv/nodamagerocket',
      rank: 'One Above All',
      preferredRole: ['Strategist'],
      heroes: ['Rocket']
    },
    {
      id: 14,
      twitchName: 'P_tatoTV',
      twitchImage: '/placeholder.png',
      twitchLink: 'https://www.twitch.tv/P_tatoTV',
      rank: 'One Above All',
      preferredRole: ['Duelist'],
      heroes: ['Not a one trick scrub']
    },
    {
      id: 15,
      twitchName: 'PickNRoll',
      twitchImage: '/placeholder.png',
      twitchLink: 'https://www.twitch.tv/thep1cknroll',
      rank: 'One Above All',
      preferredRole: ['Vanguard', 'Duelist'],
      heroes: ['magik', 'psylocke']
    },
    {
      id: 16,
      twitchName: 'Raging',
      twitchImage: '/placeholder.png',
      twitchLink: 'https://www.twitch.tv/therag1ng',
      rank: 'Celestial 1',
      preferredRole: ['Vanguard', 'Duelist'],
      heroes: ['Captain America']
    },
    {
      id: 17,
      twitchName: 'Swinny',
      twitchImage: '/placeholder.png',
      twitchLink: 'https://www.twitch.tv/swinnmvmt',
      rank: 'Eternity',
      preferredRole: ['Duelist'],
      heroes: ['Spidey']
    },
    {
      id: 18,
      twitchName: 'Warden',
      twitchImage: '/placeholder.png',
      twitchLink: 'https://www.twitch.tv/wardensow',
      rank: 'Celestial 3',
      preferredRole: ['Vanguard', 'Duelist'],
      heroes: ['Hulk', 'Thor', 'Cap']
    },
    {
      id: 19,
      twitchName: 'kpxchris',
      twitchImage: '/placeholder.png',
      twitchLink: 'https://www.twitch.tv/kpxchris',
      rank: 'Celestial 1',
      preferredRole: ['Duelist'],
      heroes: ['BLADE']
    },
    {
      id: 20,
      twitchName: 'BlocBoyMo',
      twitchImage: '/placeholder.png',
      twitchLink: 'https://twitch.tv/blocboymo',
      rank: 'Celestial 3',
      preferredRole: ['Vanguard', 'Duelist', 'Strategist'],
      heroes: ['Psylocke']
    },
    {
      id: 21,
      twitchName: 'matchuxd',
      twitchImage: '/placeholder.png',
      twitchLink: 'https://www.twitch.tv/matchuxd',
      rank: 'Eternity',
      preferredRole: ['Duelist', 'Strategist'],
      heroes: ['Spider-Man']
    },
    {
      id: 22,
      twitchName: 'MokeyMR',
      twitchImage: '/placeholder.png',
      twitchLink: 'https://www.twitch.tv/mokeymr',
      rank: 'Eternity',
      preferredRole: ['Vanguard', 'Strategist'],
      heroes: ['Rocket Racoon', 'Magneto']
    },
    {
      id: 23,
      twitchName: 'SamiiMariee1',
      twitchImage: '/placeholder.png',
      twitchLink: 'https://m.twitch.samiimariee1',
      rank: 'Eternity',
      preferredRole: ['Strategist'],
      heroes: ['Any Strategist']
    }
  ]
}

const defaultTournamentBracketData: TournamentBracketState = {
  tournament: {
    id: "marvel-creator-cup-2025",
    name: "Marvel Creator Cup 2025",
    status: "registration",
    startDate: "2025-07-26",
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
