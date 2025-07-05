'use client'

import React from 'react';
import TournamentBracket from '../../components/TournamentBracket';
import { useTournamentBracket, TournamentState } from '../../hooks/useTournamentBracket';
import Image from 'next/image';

export default function TournamentBracketPage() {
  const { bracketState, loading, error } = useTournamentBracket();
  
  // Transform bracket state into the format expected by TournamentBracket component
  const isTeam = (obj: unknown): obj is { id: number|string, name: string, image: string } => {
    return !!obj && typeof obj === 'object' && 'name' in obj && 'image' in obj;
  };
  const transformBracketData = (state: TournamentState | null) => {
    if (!state) return { upperBracket: [], lowerBracket: [] };

    const upperBracket = [
      {
        label: 'Upper Quarterfinals',
        matches: state.brackets.upper.quarterfinals.map((match) => ({
          id: match.id,
          title: `${isTeam(match.team1) ? match.team1.name : 'TBD'} vs ${isTeam(match.team2) ? match.team2.name : 'TBD'}`,
          href: `/match/${match.id}`,
          team1: {
            id: isTeam(match.team1) ? match.team1.id?.toString() : 'tbd',
            name: isTeam(match.team1) ? match.team1.name : 'TBD',
            logo: isTeam(match.team1) ? match.team1.image : 'https://picsum.photos/200/200',
            score: match.team1Score,
            isWinner: match.winner === match.team1,
            isLoser: match.loser === match.team1
          },
          team2: {
            id: isTeam(match.team2) ? match.team2.id?.toString() : 'tbd',
            name: isTeam(match.team2) ? match.team2.name : 'TBD',
            logo: isTeam(match.team2) ? match.team2.image : 'https://picsum.photos/200/200',
            score: match.team2Score,
            isWinner: match.winner === match.team2,
            isLoser: match.loser === match.team2
          },
          time: match.scheduledTime ? `${new Date(match.scheduledTime).toLocaleString()} (${Intl.DateTimeFormat().resolvedOptions().timeZone})` : (match.status === 'completed' ? 'Completed' : 'TBD'),
          hasVideo: true
        }))
      },
      {
        label: 'Upper Semifinals',
        matches: state.brackets.upper.semifinals.map((match) => ({
          id: match.id,
          title: `${isTeam(match.team1) ? match.team1.name : 'TBD'} vs ${isTeam(match.team2) ? match.team2.name : 'TBD'}`,
          href: `/match/${match.id}`,
          team1: {
            id: isTeam(match.team1) ? match.team1.id?.toString() : 'tbd',
            name: isTeam(match.team1) ? match.team1.name : 'TBD',
            logo: isTeam(match.team1) ? match.team1.image : 'https://picsum.photos/200/200',
            score: match.team1Score,
            isWinner: match.winner === match.team1,
            isLoser: match.loser === match.team1
          },
          team2: {
            id: isTeam(match.team2) ? match.team2.id?.toString() : 'tbd',
            name: isTeam(match.team2) ? match.team2.name : 'TBD',
            logo: isTeam(match.team2) ? match.team2.image : 'https://picsum.photos/200/200',
            score: match.team2Score,
            isWinner: match.winner === match.team2,
            isLoser: match.loser === match.team2
          },
          time: match.scheduledTime ? `${new Date(match.scheduledTime).toLocaleString()} (${Intl.DateTimeFormat().resolvedOptions().timeZone})` : (match.status === 'completed' ? 'Completed' : 'TBD'),
          hasVideo: true
        }))
      },
      {
        label: 'Upper Final',
        matches: state.brackets.upper.final.map((match) => ({
          id: match.id,
          title: `${isTeam(match.team1) ? match.team1.name : 'TBD'} vs ${isTeam(match.team2) ? match.team2.name : 'TBD'}`,
          href: `/match/${match.id}`,
          team1: {
            id: isTeam(match.team1) ? match.team1.id?.toString() : 'tbd',
            name: isTeam(match.team1) ? match.team1.name : 'TBD',
            logo: isTeam(match.team1) ? match.team1.image : 'https://picsum.photos/200/200',
            score: match.team1Score,
            isWinner: match.winner === match.team1,
            isLoser: match.loser === match.team1
          },
          team2: {
            id: isTeam(match.team2) ? match.team2.id?.toString() : 'tbd',
            name: isTeam(match.team2) ? match.team2.name : 'TBD',
            logo: isTeam(match.team2) ? match.team2.image : 'https://picsum.photos/200/200',
            score: match.team2Score,
            isWinner: match.winner === match.team2,
            isLoser: match.loser === match.team2
          },
          time: match.scheduledTime ? `${new Date(match.scheduledTime).toLocaleString()} (${Intl.DateTimeFormat().resolvedOptions().timeZone})` : (match.status === 'completed' ? 'Completed' : 'TBD'),
          hasVideo: true
        }))
      }
    ];

    const lowerBracket = [
      {
        label: 'Lower Round 1',
        matches: state.brackets.lower.round1.map((match) => ({
          id: match.id,
          title: `${isTeam(match.team1) ? match.team1.name : 'TBD'} vs ${isTeam(match.team2) ? match.team2.name : 'TBD'}`,
          href: `/match/${match.id}`,
          team1: {
            id: isTeam(match.team1) ? match.team1.id?.toString() : 'tbd',
            name: isTeam(match.team1) ? match.team1.name : 'TBD',
            logo: isTeam(match.team1) ? match.team1.image : 'https://picsum.photos/200/200',
            score: match.team1Score,
            isWinner: match.winner === match.team1,
            isLoser: match.loser === match.team1
          },
          team2: {
            id: isTeam(match.team2) ? match.team2.id?.toString() : 'tbd',
            name: isTeam(match.team2) ? match.team2.name : 'TBD',
            logo: isTeam(match.team2) ? match.team2.image : 'https://picsum.photos/200/200',
            score: match.team2Score,
            isWinner: match.winner === match.team2,
            isLoser: match.loser === match.team2
          },
          time: match.scheduledTime ? `${new Date(match.scheduledTime).toLocaleString()} (${Intl.DateTimeFormat().resolvedOptions().timeZone})` : (match.status === 'completed' ? 'Completed' : 'TBD'),
          hasVideo: true
        }))
      },
      {
        label: 'Lower Round 2',
        matches: state.brackets.lower.round2.map((match) => ({
          id: match.id,
          title: `${isTeam(match.team1) ? match.team1.name : 'TBD'} vs ${isTeam(match.team2) ? match.team2.name : 'TBD'}`,
          href: `/match/${match.id}`,
          team1: {
            id: isTeam(match.team1) ? match.team1.id?.toString() : 'tbd',
            name: isTeam(match.team1) ? match.team1.name : 'TBD',
            logo: isTeam(match.team1) ? match.team1.image : 'https://picsum.photos/200/200',
            score: match.team1Score,
            isWinner: match.winner === match.team1,
            isLoser: match.loser === match.team1
          },
          team2: {
            id: isTeam(match.team2) ? match.team2.id?.toString() : 'tbd',
            name: isTeam(match.team2) ? match.team2.name : 'TBD',
            logo: isTeam(match.team2) ? match.team2.image : 'https://picsum.photos/200/200',
            score: match.team2Score,
            isWinner: match.winner === match.team2,
            isLoser: match.loser === match.team2
          },
          time: match.scheduledTime ? `${new Date(match.scheduledTime).toLocaleString()} (${Intl.DateTimeFormat().resolvedOptions().timeZone})` : (match.status === 'completed' ? 'Completed' : 'TBD'),
          hasVideo: true
        }))
      },
      {
        label: 'Lower Round 3',
        matches: state.brackets.lower.round3.map((match) => ({
          id: match.id,
          title: `${isTeam(match.team1) ? match.team1.name : 'TBD'} vs ${isTeam(match.team2) ? match.team2.name : 'TBD'}`,
          href: `/match/${match.id}`,
          team1: {
            id: isTeam(match.team1) ? match.team1.id?.toString() : 'tbd',
            name: isTeam(match.team1) ? match.team1.name : 'TBD',
            logo: isTeam(match.team1) ? match.team1.image : 'https://picsum.photos/200/200',
            score: match.team1Score,
            isWinner: match.winner === match.team1,
            isLoser: match.loser === match.team1
          },
          team2: {
            id: isTeam(match.team2) ? match.team2.id?.toString() : 'tbd',
            name: isTeam(match.team2) ? match.team2.name : 'TBD',
            logo: isTeam(match.team2) ? match.team2.image : 'https://picsum.photos/200/200',
            score: match.team2Score,
            isWinner: match.winner === match.team2,
            isLoser: match.loser === match.team2
          },
          time: match.scheduledTime ? `${new Date(match.scheduledTime).toLocaleString()} (${Intl.DateTimeFormat().resolvedOptions().timeZone})` : (match.status === 'completed' ? 'Completed' : 'TBD'),
          hasVideo: true
        }))
      },
      {
        label: 'Lower Final',
        matches: state.brackets.lower.final.map((match) => ({
          id: match.id,
          title: `${isTeam(match.team1) ? match.team1.name : 'TBD'} vs ${isTeam(match.team2) ? match.team2.name : 'TBD'}`,
          href: `/match/${match.id}`,
          team1: {
            id: isTeam(match.team1) ? match.team1.id?.toString() : 'tbd',
            name: isTeam(match.team1) ? match.team1.name : 'TBD',
            logo: isTeam(match.team1) ? match.team1.image : 'https://picsum.photos/200/200',
            score: match.team1Score,
            isWinner: match.winner === match.team1,
            isLoser: match.loser === match.team1
          },
          team2: {
            id: isTeam(match.team2) ? match.team2.id?.toString() : 'tbd',
            name: isTeam(match.team2) ? match.team2.name : 'TBD',
            logo: isTeam(match.team2) ? match.team2.image : 'https://picsum.photos/200/200',
            score: match.team2Score,
            isWinner: match.winner === match.team2,
            isLoser: match.loser === match.team2
          },
          time: match.scheduledTime ? `${new Date(match.scheduledTime).toLocaleString()} (${Intl.DateTimeFormat().resolvedOptions().timeZone})` : (match.status === 'completed' ? 'Completed' : 'TBD'),
          hasVideo: true
        }))
      }
    ];

    return { upperBracket, lowerBracket };
  };

  const bracketData = transformBracketData(bracketState);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading tournament data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">Error loading tournament data: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Marvel Creator Cup Tournament
          </h1>
          <p className="text-lg text-gray-300">
            Tournament Bracket - Marvel Creator Cup
          </p>
          {bracketState && (
            <div className="mt-4 text-sm text-gray-400">
              <p>Status: {bracketState.tournament.status}</p>
              <p>Format: {bracketState.tournament.format}</p>
              <p>Last Updated: {new Date(bracketState.lastUpdated).toLocaleString()}</p>
            </div>
          )}

        </div>
        
        {bracketState && bracketState.tournament.status === 'active' ? (
          <TournamentBracket 
            upperBracket={bracketData.upperBracket}
            lowerBracket={bracketData.lowerBracket}
          />
        ) : (
          <div className="text-center py-12">
                          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-white mb-4">Tournament Not Started</h3>
                <p className="text-gray-300 mb-6">
                  The tournament bracket will appear here once the tournament has been initialized.
                </p>
              </div>
          </div>
        )}
        
        {/* Grand Final Display */}
        {bracketState && bracketState.tournament.status === 'active' && bracketState.grandFinal && (
          <div className="mt-12 text-center">
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-4">Grand Final</h2>
              <div className="flex justify-center items-center space-x-8">
                <div className="text-center">
                  <Image 
                    src={isTeam(bracketState.grandFinal.team1) ? bracketState.grandFinal.team1.image : 'https://picsum.photos/200/200'} 
                    alt={isTeam(bracketState.grandFinal.team1) ? bracketState.grandFinal.team1.name : 'TBD'}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-cover rounded mx-auto mb-2"
                  />
                  <div className="text-white font-semibold">
                    {isTeam(bracketState.grandFinal.team1) ? bracketState.grandFinal.team1.name : 'TBD'}
                  </div>
                  <div className={`text-2xl font-bold ${
                    bracketState.grandFinal.winner === bracketState.grandFinal.team1 
                      ? 'text-green-400' 
                      : 'text-gray-400'
                  }`}>
                    {bracketState.grandFinal.team1Score}
                  </div>
                </div>
                
                <div className="text-gray-400 text-xl font-bold">VS</div>
                
                <div className="text-center">
                  <Image 
                    src={isTeam(bracketState.grandFinal.team2) ? bracketState.grandFinal.team2.image : 'https://picsum.photos/200/200'} 
                    alt={isTeam(bracketState.grandFinal.team2) ? bracketState.grandFinal.team2.name : 'TBD'}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-cover rounded mx-auto mb-2"
                  />
                  <div className="text-white font-semibold">
                    {isTeam(bracketState.grandFinal.team2) ? bracketState.grandFinal.team2.name : 'TBD'}
                  </div>
                  <div className={`text-2xl font-bold ${
                    bracketState.grandFinal.winner === bracketState.grandFinal.team2 
                      ? 'text-green-400' 
                      : 'text-gray-400'
                  }`}>
                    {bracketState.grandFinal.team2Score}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-sm text-gray-400">
                <p>Best of {bracketState.grandFinal.bestOf}</p>
                <p>Status: {bracketState.grandFinal.status === 'completed' ? 'Completed' : 'Pending'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 