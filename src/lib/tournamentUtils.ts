import { Team } from '../hooks/useTeams'

export interface BracketTeam {
  id: string
  name: string
  logo: string
  score: number
  isWinner: boolean
  isLoser: boolean
}

export interface BracketMatch {
  id: string
  title: string
  href: string
  team1: BracketTeam
  team2: BracketTeam
  time: string
  hasVideo: boolean
  lineDirection?: 'up' | 'down'
  isLast?: boolean
}

export interface BracketColumn {
  label: string
  matches: BracketMatch[]
}

// Transform teams data into bracket format
export function createTournamentBracket(teams: Team[]): {
  upperBracket: BracketColumn[]
  lowerBracket: BracketColumn[]
} {
  if (teams.length < 4) {
    // Return empty brackets if not enough teams
    return {
      upperBracket: [],
      lowerBracket: []
    }
  }

  // Create matches for upper bracket quarterfinals
  const quarterfinalMatches: BracketMatch[] = []
  for (let i = 0; i < teams.length; i += 2) {
    if (i + 1 < teams.length) {
      const team1 = teams[i]
      const team2 = teams[i + 1]
      
      quarterfinalMatches.push({
        id: `qf-${team1.id}-${team2.id}`,
        title: `${team1.name} vs. ${team2.name}`,
        href: `/match/${team1.id}-${team2.id}`,
        team1: {
          id: team1.id.toString(),
          name: team1.name,
          logo: team1.image,
          score: 0,
          isWinner: false,
          isLoser: false
        },
        team2: {
          id: team2.id.toString(),
          name: team2.name,
          logo: team2.image,
          score: 0,
          isWinner: false,
          isLoser: false
        },
        time: 'TBD',
        hasVideo: false,
        lineDirection: i % 4 === 0 ? 'down' : 'up'
      })
    }
  }

  // Create semifinal matches (placeholder)
  const semifinalMatches: BracketMatch[] = [
    {
      id: 'sf-1',
      title: 'Semifinal 1',
      href: '/match/sf-1',
      team1: {
        id: 'tbd',
        name: 'TBD',
        logo: 'https://picsum.photos/200/200',
        score: 0,
        isWinner: false,
        isLoser: false
      },
      team2: {
        id: 'tbd',
        name: 'TBD',
        logo: 'https://picsum.photos/200/200',
        score: 0,
        isWinner: false,
        isLoser: false
      },
      time: 'TBD',
      hasVideo: false,
      lineDirection: 'down'
    },
    {
      id: 'sf-2',
      title: 'Semifinal 2',
      href: '/match/sf-2',
      team1: {
        id: 'tbd',
        name: 'TBD',
        logo: 'https://picsum.photos/200/200',
        score: 0,
        isWinner: false,
        isLoser: false
      },
      team2: {
        id: 'tbd',
        name: 'TBD',
        logo: 'https://picsum.photos/200/200',
        score: 0,
        isWinner: false,
        isLoser: false
      },
      time: 'TBD',
      hasVideo: false,
      lineDirection: 'up',
      isLast: true
    }
  ]

  // Create final match (placeholder)
  const finalMatch: BracketMatch = {
    id: 'final',
    title: 'Grand Final',
    href: '/match/final',
    team1: {
      id: 'tbd',
      name: 'TBD',
      logo: 'https://picsum.photos/200/200',
      score: 0,
      isWinner: false,
      isLoser: false
    },
    team2: {
      id: 'tbd',
      name: 'TBD',
      logo: 'https://picsum.photos/200/200',
      score: 0,
      isWinner: false,
      isLoser: false
    },
    time: 'TBD',
    hasVideo: false,
    isLast: true
  }

  const grandFinalMatch: BracketMatch = {
    id: 'grand-final',
    title: 'Grand Final',
    href: '/match/grand-final',
    team1: {
      id: 'tbd',
      name: 'TBD',
      logo: 'https://picsum.photos/200/200',
      score: 0,
      isWinner: false,
      isLoser: false
    },
    team2: {
      id: 'tbd',
      name: 'TBD',
      logo: 'https://picsum.photos/200/200',
      score: 0,
      isWinner: false,
      isLoser: false
    },
    time: 'TBD',
    hasVideo: false,
    isLast: true
  }

  const upperBracket: BracketColumn[] = [
    {
      label: 'Upper Quarterfinals',
      matches: quarterfinalMatches
    },
    {
      label: 'Upper Semifinals',
      matches: semifinalMatches
    },
    {
      label: 'Upper Final',
      matches: [finalMatch]
    },
    {
      label: 'Grand Final',
      matches: [grandFinalMatch]
    }
  ]

  // Create lower bracket (simplified for now)
  const lowerBracket: BracketColumn[] = [
    {
      label: 'Lower Round 1',
      matches: [
        {
          id: 'sf-1',
          title: 'Semifinal 1',
          href: '/match/sf-1',
          team1: {
            id: 'tbd',
            name: 'TBD',
            logo: 'https://picsum.photos/200/200',
            score: 0,
            isWinner: false,
            isLoser: false
          },
          team2: {
            id: 'tbd',
            name: 'TBD',
            logo: 'https://picsum.photos/200/200',
            score: 0,
            isWinner: false,
            isLoser: false
          },
          time: 'TBD',
          hasVideo: false,
          lineDirection: 'down'
        },
        {
          id: 'sf-2',
          title: 'Semifinal 2',
          href: '/match/sf-2',
          team1: {
            id: 'tbd',
            name: 'TBD',
            logo: 'https://picsum.photos/200/200',
            score: 0,
            isWinner: false,
            isLoser: false
          },
          team2: {
            id: 'tbd',
            name: 'TBD',
            logo: 'https://picsum.photos/200/200',
            score: 0,
            isWinner: false,
            isLoser: false
          },
          time: 'TBD',
          hasVideo: false,
          lineDirection: 'up',
          isLast: true
        }
      ]
    },
    {
      label: 'Lower Round 2',
      matches: [
        {
          id: 'sf-1',
          title: 'Semifinal 1',
          href: '/match/sf-1',
          team1: {
            id: 'tbd',
            name: 'TBD',
            logo: 'https://picsum.photos/200/200',
            score: 0,
            isWinner: false,
            isLoser: false
          },
          team2: {
            id: 'tbd',
            name: 'TBD',
            logo: 'https://picsum.photos/200/200',
            score: 0,
            isWinner: false,
            isLoser: false
          },
          time: 'TBD',
          hasVideo: false,
          lineDirection: 'down'
        },
        {
          id: 'sf-2',
          title: 'Semifinal 2',
          href: '/match/sf-2',
          team1: {
            id: 'tbd',
            name: 'TBD',
            logo: 'https://picsum.photos/200/200',
            score: 0,
            isWinner: false,
            isLoser: false
          },
          team2: {
            id: 'tbd',
            name: 'TBD',
            logo: 'https://picsum.photos/200/200',
            score: 0,
            isWinner: false,
            isLoser: false
          },
          time: 'TBD',
          hasVideo: false,
          lineDirection: 'up',
          isLast: true
        }
      ]
    },
    {
      label: 'Lower Round 3',
      matches: [
        {
          id: 'sf-1',
          title: 'Semifinal 1',
          href: '/match/sf-1',
          team1: {
            id: 'tbd',
            name: 'TBD',
            logo: 'https://picsum.photos/200/200',
            score: 0,
            isWinner: false,
            isLoser: false
          },
          team2: {
            id: 'tbd',
            name: 'TBD',
            logo: 'https://picsum.photos/200/200',
            score: 0,
            isWinner: false,
            isLoser: false
          },
          time: 'TBD',
          hasVideo: false,
          lineDirection: 'down'
        },
      ]
    },
    {
      label: 'Lower Round 4',
      matches: [
        {
          id: 'sf-1',
          title: 'Semifinal 1',
          href: '/match/sf-1',
          team1: {
            id: 'tbd',
            name: 'TBD',
            logo: 'https://picsum.photos/200/200',
            score: 0,
            isWinner: false,
            isLoser: false
          },
          team2: {
            id: 'tbd',
            name: 'TBD',
            logo: 'https://picsum.photos/200/200',
            score: 0,
            isWinner: false,
            isLoser: false
          },
          time: 'TBD',
          hasVideo: false,
          lineDirection: 'down'
        },
      ]
    }
  ]

  return {
    upperBracket,
    lowerBracket
  }
} 