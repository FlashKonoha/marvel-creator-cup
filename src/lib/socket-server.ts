import { Server as SocketIOServer } from 'socket.io'
import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'

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
  })

  // Store connected clients
  const connections = new Set()

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)
    connections.add(socket)

    // Send initial state
    try {
      const fs = require('fs')
      const path = require('path')
      
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
  ;(global as any).broadcastDraftUpdate = (data: any) => {
    io.emit('draft-update', data)
  }

  const PORT = process.env.PORT || 3000
  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`)
  })
}) 