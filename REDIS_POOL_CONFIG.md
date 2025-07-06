# Redis Connection Pool Configuration

This project now uses a Redis connection pool optimized for Vercel's serverless environment with Upstash Redis.

## Environment Variables

You can configure the Redis connection pool behavior using these optional environment variables:

### `REDIS_MAX_CONNECTIONS` (default: 5)
- Maximum number of Redis connections to maintain in the pool
- Recommended: 3-10 for Vercel serverless functions
- Higher values may not improve performance due to serverless constraints

### `REDIS_CONNECTION_TIMEOUT` (default: 30000)
- Time in milliseconds after which an unused connection is considered stale
- Default: 30 seconds
- Stale connections are automatically removed from the pool

### `REDIS_HEALTH_CHECK_INTERVAL` (default: 60000)
- Time in milliseconds between health checks of existing connections
- Default: 1 minute
- Health checks verify connections are still responsive

## Required Environment Variables

Make sure you have these set in your Vercel environment:

```
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

## Benefits

1. **Connection Reuse**: Reduces connection overhead by reusing existing connections
2. **Health Monitoring**: Automatically detects and removes unhealthy connections
3. **Serverless Optimized**: Designed specifically for Vercel's serverless environment
4. **Automatic Cleanup**: Removes stale connections to prevent memory leaks
5. **Error Resilience**: Better error handling and retry logic

## Usage

The connection pool is automatically used when you import and call:

```typescript
import { getRedisClient } from '@/lib/redis-pool'

// Get a Redis client from the pool
const redis = await getRedisClient()

// Use the client as normal
await redis.set('key', 'value')
```

## Monitoring

You can check the pool status programmatically:

```typescript
import { redisPool } from '@/lib/redis-pool'

const status = redisPool.getPoolStatus()
console.log('Pool status:', status)
// Output: { total: 2, healthy: 2, maxConnections: 5 }
```

## Performance Considerations

- The pool is designed for serverless environments where connections are short-lived
- Connection reuse happens within the same function execution
- Each serverless function instance maintains its own pool
- No persistent connections across function invocations (as expected in serverless) 