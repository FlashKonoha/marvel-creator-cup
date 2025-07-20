export interface Team {
  id: string;
  name: string;
  logo: string;
  score: number;
  isWinner: boolean;
  isLoser: boolean;
}

export interface GroupMatch {
  id: string;
  title: string;
  team1: Team;
  team2: Team;
  team1MapWins: number;
  team2MapWins: number;
  status: 'pending' | 'completed' | 'ongoing';
  scheduledTime: string | null;
  completedTime: string | null;
}

export interface GroupStanding {
  team: Team;
  matchesPlayed: number;
  mapWins: number;
  mapLosses: number;
  totalScore: number;
  rank: number;
}

export interface Group {
  id: string;
  name: string;
  teams: Team[];
  matches: GroupMatch[];
  standings: GroupStanding[];
}

export interface FinalMatch {
  id: string;
  title: string;
  team1: Team;
  team2: Team;
  team1Score: number;
  team2Score: number;
  status: 'pending' | 'completed' | 'ongoing';
  scheduledTime: string | null;
  completedTime: string | null;
  stage: 'semifinal' | 'seed2' | 'seed3' | 'playoff' | 'grandfinal';
}

export interface TournamentState {
  tournament: {
    id: string;
    name: string;
    status: 'pending' | 'group_stage' | 'final_stage' | 'completed';
    format: string;
    startDate: string;
    lastUpdated: string;
  };
  groupStage: {
    groups: Group[];
    isCompleted: boolean;
  };
  finalStage: {
    semifinal: FinalMatch;
    seed2Match: FinalMatch;
    seed3Match: FinalMatch;
    playoffMatch: FinalMatch;
    grandFinal: FinalMatch;
    isCompleted: boolean;
  };
}

// Sample data for the new tournament format
export const tournamentBracketData: TournamentState = {
  tournament: {
    id: "marvel-creator-cup-2024",
    name: "Marvel Creator Cup 2024",
    status: "group_stage",
    format: "Group Stage + Final Stage",
    startDate: "2024-12-01T00:00:00Z",
    lastUpdated: new Date().toISOString()
  },
  groupStage: {
    isCompleted: false,
    groups: [
      {
        id: "group-a",
        name: "Group A",
        teams: [
          {
            id: "team1",
            name: "Team Alpha",
            logo: "/logo.png",
            score: 0,
            isWinner: false,
            isLoser: false
          },
          {
            id: "team2", 
            name: "Team Beta",
            logo: "/logo.png",
            score: 0,
            isWinner: false,
            isLoser: false
          },
          {
            id: "team3",
            name: "Team Gamma", 
            logo: "/logo.png",
            score: 0,
            isWinner: false,
            isLoser: false
          },
          {
            id: "team4",
            name: "Team Delta",
            logo: "/logo.png", 
            score: 0,
            isWinner: false,
            isLoser: false
          }
        ],
        matches: [
          {
            id: "group-a-match-1",
            title: "Team Alpha vs Team Beta",
            team1: {
              id: "team1",
              name: "Team Alpha",
              logo: "/logo.png",
              score: 0,
              isWinner: false,
              isLoser: false
            },
            team2: {
              id: "team2",
              name: "Team Beta", 
              logo: "/logo.png",
              score: 0,
              isWinner: false,
              isLoser: false
            },
            team1MapWins: 0,
            team2MapWins: 0,
            status: "pending",
            scheduledTime: null,
            completedTime: null
          },
          {
            id: "group-a-match-2",
            title: "Team Gamma vs Team Delta",
            team1: {
              id: "team3",
              name: "Team Gamma",
              logo: "/logo.png",
              score: 0,
              isWinner: false,
              isLoser: false
            },
            team2: {
              id: "team4",
              name: "Team Delta",
              logo: "/logo.png",
              score: 0,
              isWinner: false,
              isLoser: false
            },
            team1MapWins: 0,
            team2MapWins: 0,
            status: "pending",
            scheduledTime: null,
            completedTime: null
          }
          // More matches would be generated for round-robin
        ],
        standings: [
          {
            team: {
              id: "team1",
              name: "Team Alpha",
              logo: "/logo.png",
              score: 0,
              isWinner: false,
              isLoser: false
            },
            matchesPlayed: 0,
            mapWins: 0,
            mapLosses: 0,
            totalScore: 0,
            rank: 1
          }
          // More standings would be calculated
        ]
      },
      {
        id: "group-b",
        name: "Group B", 
        teams: [
          {
            id: "team5",
            name: "Team Echo",
            logo: "/logo.png",
            score: 0,
            isWinner: false,
            isLoser: false
          },
          {
            id: "team6",
            name: "Team Foxtrot",
            logo: "/logo.png",
            score: 0,
            isWinner: false,
            isLoser: false
          },
          {
            id: "team7",
            name: "Team Golf",
            logo: "/logo.png",
            score: 0,
            isWinner: false,
            isLoser: false
          },
          {
            id: "team8",
            name: "Team Hotel",
            logo: "/logo.png",
            score: 0,
            isWinner: false,
            isLoser: false
          }
        ],
        matches: [],
        standings: []
      }
    ]
  },
  finalStage: {
    isCompleted: false,
    semifinal: {
      id: "semifinal",
      title: "Seed 1A vs Seed 1B",
      team1: {
        id: "tbd",
        name: "TBD",
        logo: "/logo.png",
        score: 0,
        isWinner: false,
        isLoser: false
      },
      team2: {
        id: "tbd",
        name: "TBD", 
        logo: "/logo.png",
        score: 0,
        isWinner: false,
        isLoser: false
      },
      team1Score: 0,
      team2Score: 0,
      status: "pending",
      scheduledTime: null,
      completedTime: null,
      stage: "semifinal"
    },
    seed2Match: {
      id: "seed2-match",
      title: "Seed 2A vs Seed 2B",
      team1: {
        id: "tbd",
        name: "TBD",
        logo: "/logo.png",
        score: 0,
        isWinner: false,
        isLoser: false
      },
      team2: {
        id: "tbd",
        name: "TBD",
        logo: "/logo.png",
        score: 0,
        isWinner: false,
        isLoser: false
      },
      team1Score: 0,
      team2Score: 0,
      status: "pending",
      scheduledTime: null,
      completedTime: null,
      stage: "seed2"
    },
    seed3Match: {
      id: "seed3-match",
      title: "Seed 3A vs Seed 3B",
      team1: {
        id: "tbd",
        name: "TBD",
        logo: "/logo.png",
        score: 0,
        isWinner: false,
        isLoser: false
      },
      team2: {
        id: "tbd",
        name: "TBD",
        logo: "/logo.png",
        score: 0,
        isWinner: false,
        isLoser: false
      },
      team1Score: 0,
      team2Score: 0,
      status: "pending",
      scheduledTime: null,
      completedTime: null,
      stage: "seed3"
    },
    playoffMatch: {
      id: "playoff-match",
      title: "Seed 2 Winner vs Seed 3 Winner",
      team1: {
        id: "tbd",
        name: "TBD",
        logo: "/logo.png",
        score: 0,
        isWinner: false,
        isLoser: false
      },
      team2: {
        id: "tbd",
        name: "TBD",
        logo: "/logo.png",
        score: 0,
        isWinner: false,
        isLoser: false
      },
      team1Score: 0,
      team2Score: 0,
      status: "pending",
      scheduledTime: null,
      completedTime: null,
      stage: "playoff"
    },
    grandFinal: {
      id: "grand-final",
      title: "Semifinal Winner vs Playoff Winner",
      team1: {
        id: "tbd",
        name: "TBD",
        logo: "/logo.png",
        score: 0,
        isWinner: false,
        isLoser: false
      },
      team2: {
        id: "tbd",
        name: "TBD",
        logo: "/logo.png",
        score: 0,
        isWinner: false,
        isLoser: false
      },
      team1Score: 0,
      team2Score: 0,
      status: "pending",
      scheduledTime: null,
      completedTime: null,
      stage: "grandfinal"
    }
  }
}; 