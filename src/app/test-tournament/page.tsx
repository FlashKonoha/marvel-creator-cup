'use client'

import React from 'react';
import GroupStage from '../../components/GroupStage';
import FinalStage from '../../components/FinalStage';
import type { TournamentState } from '../../data/tournamentBracketData';

export default function TestTournamentPage() {
  // Sample data for testing
  const sampleTournamentState: TournamentState = {
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
                isWinner: true,
                isLoser: false
              },
              team2: {
                id: "team2",
                name: "Team Beta",
                logo: "/logo.png",
                score: 0,
                isWinner: false,
                isLoser: true
              },
              team1MapWins: 2,
              team2MapWins: 1,
              status: "completed",
              scheduledTime: "2024-12-01T10:00:00Z",
              completedTime: "2024-12-01T11:30:00Z"
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
              team1MapWins: 1,
              team2MapWins: 1,
              status: "ongoing",
              scheduledTime: "2024-12-01T14:00:00Z",
              completedTime: null
            }
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
              matchesPlayed: 1,
              mapWins: 2,
              mapLosses: 1,
              totalScore: 2,
              rank: 1
            },
            {
              team: {
                id: "team2",
                name: "Team Beta",
                logo: "/logo.png",
                score: 0,
                isWinner: false,
                isLoser: false
              },
              matchesPlayed: 1,
              mapWins: 1,
              mapLosses: 2,
              totalScore: 1,
              rank: 2
            },
            {
              team: {
                id: "team3",
                name: "Team Gamma",
                logo: "/logo.png",
                score: 0,
                isWinner: false,
                isLoser: false
              },
              matchesPlayed: 1,
              mapWins: 1,
              mapLosses: 1,
              totalScore: 1,
              rank: 3
            },
            {
              team: {
                id: "team4",
                name: "Team Delta",
                logo: "/logo.png",
                score: 0,
                isWinner: false,
                isLoser: false
              },
              matchesPlayed: 1,
              mapWins: 1,
              mapLosses: 1,
              totalScore: 1,
              rank: 4
            }
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
          matches: [
            {
              id: "group-b-match-1",
              title: "Team Echo vs Team Foxtrot",
              team1: {
                id: "team5",
                name: "Team Echo",
                logo: "/logo.png",
                score: 0,
                isWinner: true,
                isLoser: false
              },
              team2: {
                id: "team6",
                name: "Team Foxtrot",
                logo: "/logo.png",
                score: 0,
                isWinner: false,
                isLoser: true
              },
              team1MapWins: 2,
              team2MapWins: 0,
              status: "completed",
              scheduledTime: "2024-12-01T12:00:00Z",
              completedTime: "2024-12-01T13:00:00Z"
            }
          ],
          standings: [
            {
              team: {
                id: "team5",
                name: "Team Echo",
                logo: "/logo.png",
                score: 0,
                isWinner: false,
                isLoser: false
              },
              matchesPlayed: 1,
              mapWins: 2,
              mapLosses: 0,
              totalScore: 2,
              rank: 1
            },
            {
              team: {
                id: "team6",
                name: "Team Foxtrot",
                logo: "/logo.png",
                score: 0,
                isWinner: false,
                isLoser: false
              },
              matchesPlayed: 1,
              mapWins: 0,
              mapLosses: 2,
              totalScore: 0,
              rank: 2
            },
            {
              team: {
                id: "team7",
                name: "Team Golf",
                logo: "/logo.png",
                score: 0,
                isWinner: false,
                isLoser: false
              },
              matchesPlayed: 0,
              mapWins: 0,
              mapLosses: 0,
              totalScore: 0,
              rank: 3
            },
            {
              team: {
                id: "team8",
                name: "Team Hotel",
                logo: "/logo.png",
                score: 0,
                isWinner: false,
                isLoser: false
              },
              matchesPlayed: 0,
              mapWins: 0,
              mapLosses: 0,
              totalScore: 0,
              rank: 4
            }
          ]
        }
      ]
    },
    finalStage: {
      isCompleted: false,
      semifinal: {
        id: "semifinal",
        title: "Seed 1A vs Seed 1B",
        team1: {
          id: "team1",
          name: "Team Alpha",
          logo: "/logo.png",
          score: 0,
          isWinner: false,
          isLoser: false
        },
        team2: {
          id: "team5",
          name: "Team Echo",
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
          id: "team2",
          name: "Team Beta",
          logo: "/logo.png",
          score: 0,
          isWinner: false,
          isLoser: false
        },
        team2: {
          id: "team6",
          name: "Team Foxtrot",
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
          id: "team3",
          name: "Team Gamma",
          logo: "/logo.png",
          score: 0,
          isWinner: false,
          isLoser: false
        },
        team2: {
          id: "team7",
          name: "Team Golf",
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

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Tournament Test Page</h1>
          <p className="text-lg text-gray-300">Testing the new tournament components</p>
        </div>

        {/* Group Stage */}
        <GroupStage groups={sampleTournamentState.groupStage.groups} />

        {/* Final Stage */}
        <div className="mt-12">
          <FinalStage 
            semifinal={sampleTournamentState.finalStage.semifinal}
            seed2Match={sampleTournamentState.finalStage.seed2Match}
            seed3Match={sampleTournamentState.finalStage.seed3Match}
            playoffMatch={sampleTournamentState.finalStage.playoffMatch}
            grandFinal={sampleTournamentState.finalStage.grandFinal}
          />
        </div>
      </div>
    </div>
  );
} 