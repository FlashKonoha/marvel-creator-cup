import { Redis } from '@upstash/redis'

interface RedisConnection {
  client: Redis
  lastUsed: number
  isHealthy: boolean
}

class RedisConnectionPool {
  private static instance: RedisConnectionPool
  private connections: RedisConnection[] = []
  private maxConnections: number
  private connectionTimeout: number
  private healthCheckInterval: number
  private lastHealthCheck: number = 0

  private constructor() {
    // For Vercel serverless, we want to keep connections minimal but available
    this.maxConnections = parseInt(process.env.REDIS_MAX_CONNECTIONS || '5')
    this.connectionTimeout = parseInt(process.env.REDIS_CONNECTION_TIMEOUT || '30000') // 30 seconds
    this.healthCheckInterval = parseInt(process.env.REDIS_HEALTH_CHECK_INTERVAL || '60000') // 1 minute
    
    // Start health check timer
    this.startHealthCheck()
  }

  public static getInstance(): RedisConnectionPool {
    if (!RedisConnectionPool.instance) {
      RedisConnectionPool.instance = new RedisConnectionPool()
    }
    return RedisConnectionPool.instance
  }

  private createRedisClient(): Redis {
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN

    if (!url || !token) {
      throw new Error('Missing Upstash Redis environment variables. Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN')
    }

    return new Redis({
      url,
      token,
    })
  }

  private async isConnectionHealthy(connection: RedisConnection): Promise<boolean> {
    try {
      // Simple ping test to check if connection is alive
      await connection.client.ping()
      return true
    } catch (error) {
      console.warn('Redis connection health check failed:', error)
      return false
    }
  }

  private async performHealthCheck(): Promise<void> {
    const now = Date.now()
    
    // Only perform health check if enough time has passed
    if (now - this.lastHealthCheck < this.healthCheckInterval) {
      return
    }

    this.lastHealthCheck = now
    console.log(`Performing Redis connection health check. Active connections: ${this.connections.length}`)

    for (let i = this.connections.length - 1; i >= 0; i--) {
      const connection = this.connections[i]
      
      // Check if connection has timed out
      if (now - connection.lastUsed > this.connectionTimeout) {
        console.log('Removing timed out Redis connection')
        this.connections.splice(i, 1)
        continue
      }

      // Check connection health
      connection.isHealthy = await this.isConnectionHealthy(connection)
      if (!connection.isHealthy) {
        console.log('Removing unhealthy Redis connection')
        this.connections.splice(i, 1)
      }
    }
  }

  private startHealthCheck(): void {
    // In serverless environment, we don't need persistent timers
    // Health checks will be performed on-demand
  }

  public async getConnection(): Promise<Redis> {
    await this.performHealthCheck()

    // Try to find an available healthy connection
    for (const connection of this.connections) {
      if (connection.isHealthy) {
        connection.lastUsed = Date.now()
        return connection.client
      }
    }

    // If we haven't reached max connections, create a new one
    if (this.connections.length < this.maxConnections) {
      console.log(`Creating new Redis connection. Pool size: ${this.connections.length + 1}`)
      
      const client = this.createRedisClient()
      const connection: RedisConnection = {
        client,
        lastUsed: Date.now(),
        isHealthy: true
      }

      this.connections.push(connection)
      return client
    }

    // If we've reached max connections, reuse the oldest one
    console.log('Reusing existing Redis connection due to pool limit')
    const oldestConnection = this.connections.reduce((oldest, current) => 
      current.lastUsed < oldest.lastUsed ? current : oldest
    )
    
    oldestConnection.lastUsed = Date.now()
    return oldestConnection.client
  }

  public async closeAllConnections(): Promise<void> {
    console.log('Closing all Redis connections')
    this.connections = []
  }

  public getPoolStatus(): { total: number; healthy: number; maxConnections: number } {
    const healthy = this.connections.filter(conn => conn.isHealthy).length
    return {
      total: this.connections.length,
      healthy,
      maxConnections: this.maxConnections
    }
  }
}

// Export singleton instance
export const redisPool = RedisConnectionPool.getInstance()

// Convenience function to get a Redis client
export async function getRedisClient(): Promise<Redis> {
  return await redisPool.getConnection()
}

// Graceful shutdown handler for serverless environment
export async function closeRedisConnections(): Promise<void> {
  await redisPool.closeAllConnections()
} 