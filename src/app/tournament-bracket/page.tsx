'use client'

import React from 'react';
import TournamentBracket from '../../components/TournamentBracket';
import { useTeams } from '../../hooks/useTeams';
import { createTournamentBracket } from '../../lib/tournamentUtils';

export default function TournamentBracketPage() {
  const { teams, loading, error } = useTeams();
  
  // Transform teams data into bracket format
  const bracketData = createTournamentBracket(teams);

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
          <div className="mt-4 text-sm text-gray-400">
            <p>Teams: {teams.length}</p>
            <p>Status: Registration Open</p>
          </div>
        </div>
        
        <TournamentBracket 
          upperBracket={bracketData.upperBracket}
          lowerBracket={bracketData.lowerBracket}
        />
        
        <div className="mt-12 text-center">
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Registered Teams</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teams.map((team) => (
                <div key={team.id} className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                  <img 
                    src={team.image} 
                    alt={team.name}
                    className="w-8 h-8 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{team.name}</div>
                    <div className="text-xs text-gray-400">Captain: {team.captain.twitchName}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 