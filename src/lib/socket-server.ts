import { Server as SocketIOServer, type ServerOptions, type Socket } from 'socket.io'
import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import fs from 'fs'
import path from 'path'

interface DraftState {
  teams: Array<{
    id: number
    name: string
    logo: string
    captain: {
      id: number
      twitchName: string
      twitchImage: string
      twitchLink: string
    }
    players: Array<{
      id: number
      twitchName: string
      twitchImage: string
      twitchLink: string
    }>
  }>
  players: Array<{
    id: number
    twitchName: string
    twitchImage: string
    twitchLink: string
  }>
}

interface GlobalWithBroadcast {
  broadcastDraftUpdate: (data: DraftState) => void
}

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    const parsedUrl = parse(req.url!, true)
    await handle(req, res, parsedUrl)
  })

  const io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  } as Partial<ServerOptions>) as SocketIOServer;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ioAny = io as any;

  // Store connected clients
  const connections = new Set<Socket>()

  ioAny.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id)
    connections.add(socket)

    // Send initial state
    try {
      const DATA_FILE = path.join(process.cwd(), 'data', 'draft-state.json')
      if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, 'utf8')
        socket.emit('draft-update', JSON.parse(data))
      } else {
        socket.emit('draft-update', {
          teams: [],
          players: []
        })
      }
    } catch (error) {
      console.error('Error sending initial state:', error)
    }

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
      connections.delete(socket)
    })
  })

  // Export broadcast function for API routes
  (global as unknown as GlobalWithBroadcast).broadcastDraftUpdate = (data: DraftState) => {
    ioAny.emit('draft-update', data)
  }

  const PORT = process.env.PORT || 3000
  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`)
  })
}) 