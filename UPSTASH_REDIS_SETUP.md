# Upstash Redis Setup for Marvel Creator Cup

This guide will help you set up Upstash Redis for your Marvel Creator Cup application deployed on Vercel.

## 1. Create Upstash Redis Database

1. Go to [Upstash Console](https://console.upstash.com/)
2. Sign up or log in to your account
3. Click "Create Database"
4. Choose "Redis" as the database type
5. Select your preferred region (choose one close to your Vercel deployment)
6. Give your database a name (e.g., "marvel-creator-cup")
7. Click "Create"

## 2. Get Your Redis Credentials

After creating your database:

1. Go to your database dashboard
2. Copy the following values:
   - **UPSTASH_REDIS_REST_URL**: The REST API URL
   - **UPSTASH_REDIS_REST_TOKEN**: The REST API token

## 3. Configure Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Add the following environment variables:

```
UPSTASH_REDIS_REST_URL=your_redis_rest_url_here
UPSTASH_REDIS_REST_TOKEN=your_redis_rest_token_here
```

4. Make sure to add these variables to all environments (Production, Preview, Development)
5. Click "Save"

## 4. Local Development Setup

For local development, create a `.env.local` file in your project root:

```env
UPSTASH_REDIS_REST_URL=your_redis_rest_url_here
UPSTASH_REDIS_REST_TOKEN=your_redis_rest_token_here
```

**Important**: Never commit your `.env.local` file to version control. Make sure it's in your `.gitignore`.

## 5. Verify the Setup

1. Deploy your application to Vercel
2. The application will automatically initialize with default data when first accessed
3. You can verify the data is being stored by checking your Upstash Redis dashboard

## 6. Database Structure

The application uses the following Redis keys:

- `draft-state`: Stores the current draft state with teams and players
- `tournament-bracket-state`: Stores the tournament bracket configuration and match data

## 7. Monitoring and Management

- **Upstash Dashboard**: Monitor your Redis usage, performance, and data
- **Vercel Logs**: Check application logs for any Redis-related errors
- **Redis CLI**: Use the Upstash console to directly query your data if needed

## 8. Cost Optimization

- Upstash Redis has a generous free tier
- Monitor your usage in the Upstash dashboard
- Consider upgrading if you exceed the free tier limits

## 9. Security Best Practices

- Keep your Redis tokens secure
- Use environment variables (never hardcode credentials)
- Regularly rotate your tokens
- Monitor for unusual access patterns

## 10. Troubleshooting

### Common Issues:

1. **Connection Errors**: Verify your environment variables are correctly set
2. **Authentication Errors**: Check that your Redis token is valid
3. **Data Not Persisting**: Ensure your Redis database is in the correct region
4. **Performance Issues**: Consider upgrading your Redis plan if needed

### Debug Commands:

You can test your Redis connection locally:

```bash
# Install Redis CLI (optional)
npm install -g redis-cli

# Test connection (replace with your actual URL)
redis-cli -u your_redis_rest_url_here
```

## Migration from Vercel KV

If you're migrating from Vercel KV:

1. Export your existing data from Vercel KV
2. Import the data into Upstash Redis using the same key structure
3. Update your environment variables
4. Deploy the updated application

The application will automatically use the new Redis database once the environment variables are updated. 