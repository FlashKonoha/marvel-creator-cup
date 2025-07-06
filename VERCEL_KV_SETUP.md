# Vercel KV Setup Guide

This project has been updated to use Vercel KV (Redis) for persistent state storage instead of file system operations, which don't work on Vercel's serverless platform.

## Setup Steps

### 1. Install Vercel KV

First, install the Vercel KV package:

```bash
npm install @vercel/kv
```

### 2. Create Vercel KV Database

1. Go to your Vercel dashboard
2. Select your project
3. Go to the "Storage" tab
4. Click "Create Database"
5. Choose "KV" (Redis)
6. Select a region close to your users
7. Choose a plan (Hobby plan is free for development)

### 3. Configure Environment Variables

After creating the KV database, Vercel will provide you with environment variables. Add these to your `.env.local` file for local development:

```env
KV_URL=your-kv-url
KV_REST_API_URL=your-kv-rest-api-url
KV_REST_API_TOKEN=your-kv-rest-api-token
KV_REST_API_READ_ONLY_TOKEN=your-kv-read-only-token
```

For production, add these same environment variables in your Vercel project settings.

### 4. Initialize Database

After deployment, you can initialize the database with default data by making a POST request to:

```
POST /api/init
```

This will create the default draft state and tournament bracket state in your KV database.

### 5. Verify Setup

You can verify the setup by:

1. Making a GET request to `/api/draft` - should return the default draft state
2. Making a GET request to `/api/tournament-bracket` - should return the default tournament bracket state

## Migration from File System

If you have existing data in your JSON files, you can migrate it by:

1. Reading the data from your local JSON files
2. Making POST requests to the respective API endpoints with the data
3. The data will be stored in Vercel KV automatically

## Benefits of Vercel KV

- **Persistent Storage**: Data persists across serverless function invocations
- **Global Availability**: Data is available across all regions
- **High Performance**: Redis-based storage with sub-millisecond response times
- **Automatic Scaling**: Handles traffic spikes automatically
- **Built-in Security**: Encrypted at rest and in transit

## Cost Considerations

- **Hobby Plan**: Free tier includes 100MB storage and 100 requests/day
- **Pro Plan**: $20/month includes 1GB storage and 10M requests/month
- **Enterprise Plan**: Custom pricing for larger scale

For most applications, the Hobby plan is sufficient for development and small production workloads.

## Troubleshooting

### Common Issues

1. **Environment Variables Not Set**: Make sure all KV environment variables are properly configured
2. **Database Not Initialized**: Call the `/api/init` endpoint to set up default data
3. **Rate Limiting**: KV has rate limits, consider implementing caching for frequently accessed data

### Local Development

For local development, you can use a local Redis instance or Upstash Redis (which provides a free tier):

1. Sign up for Upstash Redis
2. Use the provided connection details in your environment variables
3. The same code will work both locally and in production

## API Changes

The API endpoints remain the same, but now use Vercel KV instead of file system:

- `GET /api/draft` - Returns draft state from KV
- `POST /api/draft` - Updates draft state in KV
- `GET /api/tournament-bracket` - Returns tournament bracket state from KV
- `POST /api/tournament-bracket` - Updates tournament bracket state in KV
- `POST /api/init` - Initializes default data in KV (new endpoint) 