# Marvel Creator Cup - Vercel Deployment Guide

## Overview
This guide will help you deploy the Marvel Creator Cup application to Vercel with minimal code changes. The app has been updated to use Server-Sent Events (SSE) with efficient polling instead of Socket.IO for real-time communication, making it compatible with Vercel's serverless functions. The application uses Upstash Redis for data persistence.

## Prerequisites
- A GitHub account
- A Vercel account (free tier available)
- An Upstash Redis database (free tier available)
- Node.js installed locally for testing

## Step-by-Step Deployment

### 1. Prepare Your Repository
1. Push your code to a GitHub repository
2. Ensure all files are committed and pushed

### 2. Set Up Upstash Redis
1. Go to [console.upstash.com](https://console.upstash.com) and sign up/login
2. Create a new Redis database
3. Choose a region close to your Vercel deployment
4. Copy your Redis credentials (URL and token)

### 3. Set Up Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Next.js project

### 4. Configure Environment Variables
In your Vercel project settings, add the following environment variables:

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `JWT_SECRET` | Secret key for JWT token generation | Yes | `your-secure-random-string-here` |
| `UPSTASH_REDIS_REST_URL` | Your Upstash Redis REST API URL | Yes | `https://your-db.upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN` | Your Upstash Redis REST API token | Yes | `your-redis-token-here` |

### 5. Deploy
1. Click "Deploy" in Vercel
2. Wait for the build to complete (usually 2-3 minutes)
3. Your app will be available at the provided URL

### 6. Test Your Deployment
1. Visit your deployed URL
2. Test the draft functionality
3. Verify real-time updates work between different browser tabs
4. Check that data persists in your Upstash Redis dashboard

## Key Changes Made for Vercel Compatibility

### Real-time Communication
- **Before**: Socket.IO with persistent WebSocket connections
- **After**: Server-Sent Events (SSE) with efficient polling using Vercel's serverless functions

### Data Storage
- **Before**: File-based storage (not suitable for serverless)
- **After**: Upstash Redis for persistent data storage

### Real-time Updates
- **Implementation**: Efficient polling every 2 seconds with change detection
- **Benefits**: Works perfectly with Vercel's serverless architecture
- **Performance**: Only sends updates when data actually changes
- **Scalability**: No persistent connections to manage

### File Structure
- Removed custom socket server (`src/lib/socket-server.ts`)
- Added SSE endpoint (`src/app/api/realtime/route.ts`)
- Updated frontend hooks (`src/hooks/useSocketDraftState.ts`, `src/hooks/useTournamentBracket.ts`)
- Updated database layer (`src/lib/database.ts`) to use Upstash Redis
- Added Redis-based broadcast system (`src/lib/sse-broadcast.ts`)

### Dependencies
- Removed `socket.io` and `socket.io-client`
- Replaced `@vercel/kv` with `@upstash/redis`
- Updated package.json scripts for standard Next.js deployment

## Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `JWT_SECRET` | Secret key for JWT token generation | Yes | `your-secure-random-string-here` |
| `UPSTASH_REDIS_REST_URL` | Your Upstash Redis REST API URL | Yes | `https://your-db.upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN` | Your Upstash Redis REST API token | Yes | `your-redis-token-here` |

## Local Development Setup

Create a `.env.local` file in your project root:

```env
JWT_SECRET=your-secure-random-string-here
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token-here
```

**Important**: Never commit your `.env.local` file to version control.

## Troubleshooting

### Build Errors
- Ensure all TypeScript errors are resolved
- Check that all imports are correct
- Verify environment variables are set

### Redis Connection Issues
- Verify your Upstash Redis credentials are correct
- Check that your Redis database is in the correct region
- Ensure your environment variables are properly set in Vercel

### Real-time Updates Not Working
- Check browser console for SSE connection errors
- Verify the `/api/realtime` endpoint is accessible
- Ensure CORS headers are properly set
- Check that polling is working (should see heartbeat messages in network tab)

### Data Persistence Issues
- Check your Upstash Redis dashboard for data
- Verify the Redis keys are being created (`draft-state`, `tournament-bracket-state`)
- Check Vercel function logs for Redis errors

## Performance Considerations

### Serverless Function Limits
- Maximum execution time: 30 seconds
- Memory limit: 1024 MB
- Payload size: 4.5 MB

### Redis Performance
- Upstash Redis has low latency for global deployments
- Free tier includes 10,000 requests per day
- Consider upgrading for high-traffic applications

### Real-time Performance
- Polling interval: 2 seconds (configurable)
- Change detection prevents unnecessary data transmission
- Heartbeat messages keep connections alive
- Automatic reconnection on connection loss

### Scaling
- Vercel automatically scales based on traffic
- Free tier includes 100GB-hours of serverless function execution
- Upstash Redis scales automatically with your usage

## Database Structure

The application uses the following Redis keys:

- `draft-state`: Stores the current draft state with teams and players
- `tournament-bracket-state`: Stores the tournament bracket configuration and match data

## Next Steps for Production

1. **Authentication**: Implement proper user authentication
2. **CDN**: Use Vercel's Edge Network for static assets
3. **Monitoring**: Set up error tracking and performance monitoring
4. **Custom Domain**: Configure a custom domain in Vercel settings
5. **Backup**: Set up regular backups of your Redis data

## Support
If you encounter issues during deployment, check:
1. Vercel deployment logs
2. Browser developer console
3. Network tab for API request failures
4. Upstash Redis dashboard for connection issues
5. Vercel documentation and community forums

## Migration from Vercel KV

If you're migrating from Vercel KV to Upstash Redis:

1. Export your existing data from Vercel KV
2. Import the data into Upstash Redis using the same key structure
3. Update your environment variables
4. Deploy the updated application

The application will automatically use the new Redis database once the environment variables are updated. 