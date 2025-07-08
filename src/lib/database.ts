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
      twitchName: 'MarvelGamer123', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/marvelgamer123',
      rank: 'One Above All',
      preferredRole: ['Strategist'],
      heroes: ['Luna', 'Invis', "CND", "Rocket", "Adam", "Mantis"]
    },
    { 
      id: 2, 
      twitchName: 'RivalsPro', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/rivalspro',
      rank: 'Celestial 1',
      preferredRole: ['Strategist', 'Duelist', 'Vanguard'],
      heroes: ['Black Panther', 'Shuri', 'Black Panther', 'Shuri', 'Black Panther', 'Shuri']
    },
    { 
      id: 3, 
      twitchName: 'HeroMaster', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/heromaster',
      rank: 'Celestial 1',
      preferredRole: ['Duelist'],
      heroes: ['Wolverine', 'X-23']
    },
    { 
      id: 4, 
      twitchName: 'ComicFanatic', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/comicfanatic',
      rank: 'Celestial 2',
      preferredRole: ['Vanguard'],
      heroes: ['Thor', 'Jane Foster']
    },
    { 
      id: 5, 
      twitchName: 'GamingElite', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/gamingelite',
      rank: 'Eternity',
      preferredRole: ['Vanguard'],
      heroes: ['Hulk', 'She-Hulk']
    },
    { 
      id: 6, 
      twitchName: 'StreamQueen', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/streamqueen',
      rank: 'Eternity',
      preferredRole: ['Vanguard'],
      heroes: ['Hulk', 'She-Hulk']
    },
    { 
      id: 7, 
      twitchName: 'BattleRoyale', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/battleroyale',
      rank: 'Celestial 2',
      preferredRole: ['Duelist'],
      heroes: ['Black Widow', 'Hawkeye']
    },
    { 
      id: 8, 
      twitchName: 'TwitchStar', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/twitchstar',
      rank: 'Celestial 2',
      preferredRole: ['Strategist', 'Duelist'],
      heroes: ['Iron Man', 'War Machine']
    },
    { 
      id: 9, 
      twitchName: 'GamingPro', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/gamingpro',
      rank: 'Celestial 3',
      preferredRole: ['Strategist'],
      heroes: ['Doctor Strange', 'Scarlet Witch']
    },
    { 
      id: 10, 
      twitchName: 'MarvelFan', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/marvelfan',
      rank: 'One Above All',
      preferredRole: ['Vanguard', 'Duelist'],
      heroes: ['Thor', 'Loki']
    },
    { 
      id: 11, 
      twitchName: 'RivalsChamp', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/rivalschamp',
      rank: 'Celestial 1',
      preferredRole: ['Strategist'],
      heroes: ['Ant-Man', 'Wasp']
    },
    { 
      id: 12, 
      twitchName: 'HeroHunter', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/herohunter',
      rank: 'Eternity',
      preferredRole: ['Duelist'],
      heroes: ['Deadpool', 'Cable']
    },
    { 
      id: 13, 
      twitchName: 'GamingLegend', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/gaminglegend',
      rank: 'Celestial 2',
      preferredRole: ['Vanguard'],
      heroes: ['Vision', 'Ultron']
    },
    { 
      id: 14, 
      twitchName: 'StreamMaster', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/streammaster',
      rank: 'Celestial 3',
      preferredRole: ['Strategist', 'Vanguard'],
      heroes: ['Falcon', 'Winter Soldier']
    },
    { 
      id: 15, 
      twitchName: 'BattlePro', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/battlepro',
      rank: 'One Above All',
      preferredRole: ['Strategist'],
      heroes: ['Doctor Strange', 'Wong']
    },
    { 
      id: 16, 
      twitchName: 'TwitchElite', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/twitchelite',
      rank: 'Celestial 3',
      preferredRole: ['Duelist'],
      heroes: ['Sage', 'Forge']
    },
    { 
      id: 17, 
      twitchName: 'MarvelHero', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/marvelhero',
      rank: 'One Above All',
      preferredRole: ['Duelist'],
      heroes: ['Spider-Gwen', 'Venom']
    },
    { 
      id: 18, 
      twitchName: 'RivalsKing', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/rivalsking',
      rank: 'Celestial 1',
      preferredRole: ['Duelist', 'Vanguard'],
      heroes: ['Spider-Man', 'Miles Morales']
    },
    { 
      id: 19, 
      twitchName: 'GamingWarrior', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/gamingwarrior',
      rank: 'Celestial 1',
      preferredRole: ['Vanguard'],
      heroes: ['Namor', 'Black Bolt']
    },
    { 
      id: 20, 
      twitchName: 'StreamChampion', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/streamchampion',
      rank: 'Celestial 3',
      preferredRole: ['Vanguard'],
      heroes: ['Captain America', 'Falcon']
    },
    { 
      id: 21, 
      twitchName: 'BattleMaster', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/battlemaster',
      rank: 'Eternity',
      preferredRole: ['Strategist', 'Duelist'],
      heroes: ['Rocket Raccoon', 'Groot']
    },
    { 
      id: 22, 
      twitchName: 'TwitchPro', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/twitchpro',
      rank: 'Eternity',
      preferredRole: ['Strategist'],
      heroes: ['Black Panther', 'Shuri']
    },
    { 
      id: 23, 
      twitchName: 'MarvelChamp', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/marvelchamp',
      rank: 'Celestial 2',
      preferredRole: ['Vanguard'],
      heroes: ['Captain Marvel', 'Ms. Marvel']
    },
    { 
      id: 24, 
      twitchName: 'RivalsElite', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/rivalselite',
      rank: 'Celestial 3',
      preferredRole: ['Duelist'],
      heroes: ['Ghost Rider', 'Blade']
    },
    { 
      id: 25, 
      twitchName: 'GamingHero', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/gaminghero',
      rank: 'One Above All',
      preferredRole: ['Strategist'],
      heroes: ['Professor X', 'Magneto']
    },
    { 
      id: 26, 
      twitchName: 'StreamWarrior', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/streamwarrior',
      rank: 'Celestial 1',
      preferredRole: ['Vanguard', 'Duelist'],
      heroes: ['Silver Surfer', 'Galactus']
    },
    { 
      id: 27, 
      twitchName: 'BattleElite', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/battleelite',
      rank: 'Eternity',
      preferredRole: ['Strategist'],
      heroes: ['Jean Grey', 'Cyclops']
    },
    { 
      id: 28, 
      twitchName: 'TwitchMaster', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/twitchmaster',
      rank: 'Celestial 2',
      preferredRole: ['Duelist'],
      heroes: ['Nightcrawler', 'Colossus']
    },
    { 
      id: 29, 
      twitchName: 'MarvelElite', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/marvelelite',
      rank: 'Celestial 3',
      preferredRole: ['Vanguard'],
      heroes: ['Beast', 'Angel']
    },
    { 
      id: 30, 
      twitchName: 'RivalsPro', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/rivalspro2',
      rank: 'One Above All',
      preferredRole: ['Strategist', 'Vanguard'],
      heroes: ['Storm', 'Rogue']
    },
    { 
      id: 31, 
      twitchName: 'GamingChamp', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/gamingchamp',
      rank: 'Celestial 1',
      preferredRole: ['Duelist'],
      heroes: ['Gambit', 'Jubilee']
    },
    { 
      id: 32, 
      twitchName: 'StreamElite', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/streamelite',
      rank: 'Eternity',
      preferredRole: ['Vanguard'],
      heroes: ['Iceman', 'Firestar']
    },
    { 
      id: 33, 
      twitchName: 'BattleHero', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/battlehero',
      rank: 'Celestial 2',
      preferredRole: ['Strategist', 'Duelist'],
      heroes: ['Kitty Pryde', 'Shadowcat']
    },
    { 
      id: 34, 
      twitchName: 'TwitchChamp', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/twitchchamp',
      rank: 'Celestial 3',
      preferredRole: ['Vanguard'],
      heroes: ['Emma Frost', 'Psylocke']
    },
    { 
      id: 35, 
      twitchName: 'MarvelMaster', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/marvelmaster',
      rank: 'One Above All',
      preferredRole: ['Strategist'],
      heroes: ['Bishop', 'Cable']
    },
    { 
      id: 36, 
      twitchName: 'RivalsHero', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/rivalshero',
      rank: 'Celestial 1',
      preferredRole: ['Duelist', 'Vanguard'],
      heroes: ['Domino', 'Shatterstar']
    },
    { 
      id: 37, 
      twitchName: 'GamingElite', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/gamingelite2',
      rank: 'Eternity',
      preferredRole: ['Strategist'],
      heroes: ['Longshot', 'Dazzler']
    },
    { 
      id: 38, 
      twitchName: 'StreamChamp', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/streamchamp',
      rank: 'Celestial 2',
      preferredRole: ['Vanguard'],
      heroes: ['Havok', 'Polaris']
    },
    { 
      id: 39, 
      twitchName: 'BattleMaster', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/battlemaster2',
      rank: 'Celestial 3',
      preferredRole: ['Duelist'],
      heroes: ['Warpath', 'Thunderbird']
    },
    { 
      id: 40, 
      twitchName: 'TwitchHero', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/twitchhero',
      rank: 'One Above All',
      preferredRole: ['Strategist', 'Vanguard'],
      heroes: ['Sunspot', 'Cannonball']
    },
    { 
      id: 41, 
      twitchName: 'MarvelWarrior', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/marvelwarrior',
      rank: 'Celestial 1',
      preferredRole: ['Duelist'],
      heroes: ['Wolfsbane', 'Karma']
    },
    { 
      id: 42, 
      twitchName: 'RivalsMaster', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/rivalsmaster',
      rank: 'Eternity',
      preferredRole: ['Vanguard'],
      heroes: ['Mirage', 'Magik']
    },
    { 
      id: 43, 
      twitchName: 'GamingWarrior', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/gamingwarrior2',
      rank: 'Celestial 2',
      preferredRole: ['Strategist', 'Duelist'],
      heroes: ['Lockheed', 'Armor']
    },
    { 
      id: 44, 
      twitchName: 'StreamMaster', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/streammaster2',
      rank: 'Celestial 3',
      preferredRole: ['Vanguard'],
      heroes: ['Anole', 'Rockslide']
    },
    { 
      id: 45, 
      twitchName: 'BattleElite', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/battleelite2',
      rank: 'One Above All',
      preferredRole: ['Strategist'],
      heroes: ['Surge', 'Mercury']
    },
    { 
      id: 46, 
      twitchName: 'TwitchMaster', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/twitchmaster2',
      rank: 'Celestial 1',
      preferredRole: ['Duelist', 'Vanguard'],
      heroes: ['X-23', 'Daken']
    },
    { 
      id: 47, 
      twitchName: 'MarvelElite', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/marvelelite2',
      rank: 'Eternity',
      preferredRole: ['Strategist'],
      heroes: ['Hope Summers', 'Cypher']
    },
    { 
      id: 48, 
      twitchName: 'RivalsWarrior', 
      twitchImage: '/placeholder.png', 
      twitchLink: 'https://twitch.tv/rivalswarrior',
      rank: 'Celestial 2',
      preferredRole: ['Vanguard'],
      heroes: ['Warlock', 'Douglock']
    }
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
    const redis = await getRedisClient()
    const data = await redis.get<DraftState>(DRAFT_STATE_KEY)
    // return data || defaultDraftData
    return defaultDraftData
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
