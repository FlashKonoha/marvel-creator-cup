// Store active connections for broadcasting
const connections = new Set<ReadableStreamDefaultController>()

// Add connection to the set
export const addConnection = (controller: ReadableStreamDefaultController) => {
  connections.add(controller)
}

// Remove connection from the set
export const removeConnection = (controller: ReadableStreamDefaultController) => {
  connections.delete(controller)
}

// Broadcast function for other API routes
export const broadcastUpdate = (data: unknown) => {
  const message = `data: ${JSON.stringify(data)}\n\n`
  connections.forEach(controller => {
    try {
      controller.enqueue(new TextEncoder().encode(message))
    } catch {
      // Remove dead connections
      connections.delete(controller)
    }
  })
} 