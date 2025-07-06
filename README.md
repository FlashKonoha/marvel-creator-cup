# Marvel Creator Cup - Tournament Web App

A modern, responsive web application for BasimZB's Marvel Rivals tournament on July 25, 2025.

## 🎮 Tournament Details

- **Date:** July 25, 2025
- **Time:** 6:00 PM EST
- **Host:** [BasimZB](https://www.twitch.tv/basimzb)
- **Game:** Marvel Rivals
- **Format:** BO3 Winners/Losers Bracket
- **Teams:** 6-8 Teams (6 players each)
- **Draft:** July 18, 2025 (Team Selection)
- **Platform:** PC & Console
- **Prize Pool:** $2600 total ($2000, $600)

## 🚀 Features

- **Responsive Design:** Works perfectly on desktop, tablet, and mobile
- **Modern UI:** Beautiful gradient backgrounds and smooth animations
- **Tournament Registration:** Complete registration form with validation
- **Tournament Information:** Detailed rules, schedule, and prize information
- **Host Integration:** Direct links to BasimZB's Twitch channel
- **SEO Optimized:** Proper metadata and structured content
- **Real-time Updates:** Server-Sent Events for live draft and tournament updates
- **Data Persistence:** Upstash Redis for reliable data storage

## 🛠️ Technology Stack

- **Framework:** Next.js 15.3.5 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** Upstash Redis
- **Real-time:** Server-Sent Events (SSE)
- **Deployment:** Ready for Vercel deployment

## 📁 Project Structure

```
marvel-creator-cup/
├── src/
│   ├── app/
│   │   ├── api/                  # API routes
│   │   │   ├── auth/             # Authentication endpoints
│   │   │   ├── draft/            # Draft management
│   │   │   ├── realtime/         # Server-Sent Events
│   │   │   └── tournament-bracket/ # Tournament bracket API
│   │   ├── draft/                # Draft pages
│   │   ├── tournament-bracket/   # Tournament bracket pages
│   │   ├── page.tsx              # Home page
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   ├── components/               # React components
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utility libraries
│   └── data/                     # Data utilities
├── public/                       # Static assets
└── package.json                  # Dependencies and scripts
```

## 🎯 Pages

### Home Page (`/`)
- Hero section with tournament branding
- Tournament details and prize pool
- Host information with Twitch integration
- Call-to-action buttons

### Draft Pages (`/draft`)
- Real-time draft interface
- Team selection and player assignment
- Admin controls for draft management

### Tournament Bracket (`/tournament-bracket`)
- Interactive tournament bracket
- Match results and progression
- Admin controls for match management

### Admin Pages
- Draft administration (`/draft/admin`)
- Tournament bracket administration (`/tournament-bracket/admin`)

## 🎨 Design Features

- **Color Scheme:** Marvel-themed red, purple, and blue gradients
- **Typography:** Bold, modern fonts for impact
- **Animations:** Smooth hover effects and transitions
- **Responsive:** Mobile-first design approach
- **Accessibility:** Proper contrast ratios and semantic HTML

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd marvel-creator-cup
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the project root:
   ```env
   JWT_SECRET=your-secure-random-string-here
   UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your-redis-token-here
   ```

4. **Set up Upstash Redis:**
   - Go to [console.upstash.com](https://console.upstash.com)
   - Create a new Redis database
   - Copy your REST URL and token to your `.env.local` file

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🌐 Deployment

This project is optimized for deployment on Vercel with Upstash Redis:

1. **Set up Upstash Redis:**
   - Create a Redis database at [console.upstash.com](https://console.upstash.com)
   - Choose a region close to your Vercel deployment

2. **Deploy to Vercel:**
   - Push your code to GitHub
   - Connect your repository to Vercel
   - Add environment variables in Vercel dashboard:
     - `JWT_SECRET`
     - `UPSTASH_REDIS_REST_URL`
     - `UPSTASH_REDIS_REST_TOKEN`

3. **Deploy automatically**

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md) and [UPSTASH_REDIS_SETUP.md](./UPSTASH_REDIS_SETUP.md).

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `JWT_SECRET` | Secret key for JWT token generation | Yes |
| `UPSTASH_REDIS_REST_URL` | Your Upstash Redis REST API URL | Yes |
| `UPSTASH_REDIS_REST_TOKEN` | Your Upstash Redis REST API token | Yes |

## 📧 Contact

- **Tournament Host:** [BasimZB on Twitch](https://www.twitch.tv/basimzb)
- **Support Email:** tournament@marvelcreatorcup.com

## 📄 License

This project is created for the Marvel Creator Cup tournament. All rights reserved.

---

**Join the ultimate Marvel Rivals tournament and compete for glory!** 🏆
