import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { verify } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'

const DATA_FILE = path.join(process.cwd(), 'data', 'draft-state.json')

// In-memory cache for high performance
let cache: any = null
let cacheTimestamp = 0
const CACHE_DURATION = 5000 // 5 seconds cache

// Rate limiting (simple in-memory for demo - use Redis in production)
const requestCounts = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 100 // requests per minute per IP
const RATE_LIMIT_WINDOW = 60000 // 1 minute

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Default data
const defaultData = {
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

// Simple rate limiting
const checkRateLimit = (ip: string): boolean => {
  const now = Date.now()
  const userRequests = requestCounts.get(ip)
  
  if (!userRequests || now > userRequests.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }
  
  if (userRequests.count >= RATE_LIMIT) {
    return false
  }
  
  userRequests.count++
  return true
}

// Read current state with caching
const readState = () => {
  const now = Date.now()
  
  // Return cached data if still valid
  if (cache && (now - cacheTimestamp) < CACHE_DURATION) {
    return cache
  }
  
  ensureDataDir()
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8')
      const parsedData = JSON.parse(data)
      
      // Update cache
      cache = parsedData
      cacheTimestamp = now
      
      return parsedData
    }
  } catch (error) {
    console.error('Error reading draft state:', error)
  }
  
  // Return default data and cache it
  cache = defaultData
  cacheTimestamp = now
  return defaultData
}

// Write state to file with cache invalidation and Socket.IO broadcast
const writeState = (data: any) => {
  ensureDataDir()
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
    
    // Invalidate cache
    cache = null
    cacheTimestamp = 0
    
    // Broadcast update to all connected clients via Socket.IO
    try {
      if ((global as any).broadcastDraftUpdate) {
        (global as any).broadcastDraftUpdate(data)
      }
    } catch (error) {
      console.error('Error broadcasting update:', error)
    }
    
    return true
  } catch (error) {
    console.error('Error writing draft state:', error)
    return false
  }
}

export async function GET(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' }, 
      { status: 429 }
    )
  }

  const state = readState()
  
  // Add cache headers for CDN/proxy caching
  const response = NextResponse.json(state)
  response.headers.set('Cache-Control', 'public, max-age=5, s-maxage=5')
  response.headers.set('ETag', JSON.stringify(state))
  
  return response
}

export async function POST(request: NextRequest) {
  // Check authentication for admin actions
  const token = request.cookies.get('admin-token')?.value
  
  if (!token) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  try {
    const decoded = verify(token, JWT_SECRET) as any
    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }
  } catch (jwtError) {
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
    const { teams, players } = body
    
    if (!teams || !players) {
      return NextResponse.json({ error: 'Missing teams or players data' }, { status: 400 })
    }

    const success = writeState({ teams, players })
    
    if (success) {
      // Broadcast the update to all connected Socket.IO clients
      // This will be handled by the Socket.IO server when it receives the update
      return NextResponse.json({ success: true, teams, players })
    } else {
      return NextResponse.json({ error: 'Failed to save state' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error updating draft state:', error)
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
  }
} 