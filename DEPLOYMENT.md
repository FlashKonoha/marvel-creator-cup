# Marvel Creator Cup - Vercel Deployment Guide

## Overview
This guide will help you deploy the Marvel Creator Cup application to Vercel with minimal code changes. The app has been updated to use Server-Sent Events (SSE) instead of Socket.IO for real-time communication, making it compatible with Vercel's serverless functions.

## Prerequisites
- A GitHub account
- A Vercel account (free tier available)
- Node.js installed locally for testing

## Step-by-Step Deployment

### 1. Prepare Your Repository
1. Push your code to a GitHub repository
2. Ensure all files are committed and pushed

### 2. Set Up Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Next.js project

### 3. Configure Environment Variables
In your Vercel project settings, add the following environment variable:
- **Name**: `JWT_SECRET`
- **Value**: Generate a secure random string (you can use a password generator)

### 4. Deploy
1. Click "Deploy" in Vercel
2. Wait for the build to complete (usually 2-3 minutes)
3. Your app will be available at the provided URL

### 5. Test Your Deployment
1. Visit your deployed URL
2. Test the draft functionality
3. Verify real-time updates work between different browser tabs

## Key Changes Made for Vercel Compatibility

### Real-time Communication
- **Before**: Socket.IO with persistent WebSocket connections
- **After**: Server-Sent Events (SSE) using Vercel's serverless functions

### File Structure
- Removed custom socket server (`src/lib/socket-server.ts`)
- Added SSE endpoint (`src/app/api/realtime/route.ts`)
- Updated frontend hook (`src/hooks/useSocketDraftState.ts`)

### Dependencies
- Removed `socket.io` and `socket.io-client`
- Updated package.json scripts for standard Next.js deployment

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `JWT_SECRET` | Secret key for JWT token generation | Yes |

## Troubleshooting

### Build Errors
- Ensure all TypeScript errors are resolved
- Check that all imports are correct
- Verify environment variables are set

### Real-time Updates Not Working
- Check browser console for SSE connection errors
- Verify the `/api/realtime` endpoint is accessible
- Ensure CORS headers are properly set

### Data Persistence
- The app uses file-based storage in the `/data` directory
- In production, consider using a database for better scalability
- Vercel's serverless functions have read-only filesystem access

## Performance Considerations

### Serverless Function Limits
- Maximum execution time: 30 seconds
- Memory limit: 1024 MB
- Payload size: 4.5 MB

### Scaling
- Vercel automatically scales based on traffic
- Free tier includes 100GB-hours of serverless function execution
- Consider upgrading for high-traffic applications

## Next Steps for Production

1. **Database Integration**: Replace file-based storage with a database (PostgreSQL, MongoDB, etc.)
2. **Authentication**: Implement proper user authentication
3. **CDN**: Use Vercel's Edge Network for static assets
4. **Monitoring**: Set up error tracking and performance monitoring
5. **Custom Domain**: Configure a custom domain in Vercel settings

## Support
If you encounter issues during deployment, check:
1. Vercel deployment logs
2. Browser developer console
3. Network tab for API request failures
4. Vercel documentation and community forums 