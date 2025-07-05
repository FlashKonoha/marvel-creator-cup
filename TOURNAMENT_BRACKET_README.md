# Tournament Bracket Component

This is a responsive tournament bracket component built with React and Tailwind CSS, designed to display tournament brackets similar to those found on esports websites like VLR.gg.

## Features

- **Responsive Design**: Works on desktop and mobile devices
- **Upper and Lower Brackets**: Supports double-elimination tournament formats
- **Team Logos**: Displays team logos alongside team names
- **Match Results**: Shows scores and winner/loser states
- **Match Times**: Displays match timestamps
- **Video Indicators**: Shows video camera icons for matches with video content
- **Connecting Lines**: Visual lines connecting matches in the bracket progression
- **Hover Effects**: Interactive hover states for better UX

## Components

### TournamentBracket
The main component that renders the tournament bracket.

**Props:**
- `upperBracket: BracketColumn[]` - Array of upper bracket columns
- `lowerBracket: BracketColumn[]` - Array of lower bracket columns

### Data Structure

```typescript
interface Team {
  id: string;
  name: string;
  logo: string;
  score: number;
  isWinner: boolean;
  isLoser: boolean;
}

interface Match {
  id: string;
  title: string;
  href: string;
  team1: Team;
  team2: Team;
  time: string;
  hasVideo: boolean;
  lineDirection?: 'up' | 'down';
  isLast?: boolean;
}

interface BracketColumn {
  label: string;
  matches: Match[];
}
```

## Usage

```tsx
import TournamentBracket from './components/TournamentBracket';
import { tournamentBracketData } from './data/tournamentBracketData';

function App() {
  return (
    <TournamentBracket 
      upperBracket={tournamentBracketData.upperBracket}
      lowerBracket={tournamentBracketData.lowerBracket}
    />
  );
}
```

## Example Data

The component includes sample data for the Valorant Masters Toronto 2025 tournament, including:

- **Upper Bracket**: Quarterfinals, Semifinals, Finals, and Grand Final
- **Lower Bracket**: Round 1, Round 2, Round 3, and Lower Final
- **Teams**: Paper Rex, FNATIC, Wolves Esports, G2 Esports, Sentinels, Gen.G, Xi Lai Gaming, Rex Regum Qeon
- **Results**: Complete tournament results with scores and winners

## Styling

The component uses Tailwind CSS classes for styling:

- **Cards**: White background with subtle borders and shadows
- **Team Names**: Medium font weight with team logos
- **Scores**: Bold text with green for winners, gray for losers
- **Losers**: 60% opacity to indicate eliminated teams
- **Connecting Lines**: Gray lines connecting matches in the bracket flow
- **Responsive**: Horizontal scrolling on smaller screens

## Customization

You can customize the component by:

1. **Modifying Colors**: Change Tailwind classes for different color schemes
2. **Adjusting Sizes**: Modify width, height, and spacing classes
3. **Adding Animations**: Include transition classes for hover effects
4. **Changing Layout**: Adjust the flex layout and spacing

## Dependencies

- React 18+
- Tailwind CSS
- Font Awesome (for video camera icons)

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Mobile browsers with touch scrolling support

## License

This component is part of the Marvel Creator Cup project and follows the same licensing terms. 