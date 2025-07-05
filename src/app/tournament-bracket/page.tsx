import React from 'react';
import TournamentBracket from '../../components/TournamentBracket';
import { tournamentBracketData } from '../../data/tournamentBracketData';

export default function TournamentBracketPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Valorant Masters Toronto 2025
          </h1>
          <p className="text-lg text-gray-300">
            Tournament Bracket - Champions Tour 2025
          </p>
          <div className="mt-4 text-sm text-gray-400">
            <p>Dates: Jun 7 - 22, 2025</p>
            <p>Prize Pool: $1,000,000 USD</p>
            <p>Location: Enercare Arena, Toronto</p>
          </div>
        </div>
        
        <TournamentBracket 
          upperBracket={tournamentBracketData.upperBracket}
          lowerBracket={tournamentBracketData.lowerBracket}
        />
        
        <div className="mt-12 text-center">
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Tournament Results</h2>
            <div className="space-y-2 text-left">
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="font-medium text-gray-200">🥇 1st Place</span>
                <span className="text-green-400 font-bold">Paper Rex (Singapore)</span>
                <span className="text-sm text-gray-400">$350,000 USD</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="font-medium text-gray-200">🥈 2nd Place</span>
                <span className="text-blue-400 font-bold">FNATIC (Europe)</span>
                <span className="text-sm text-gray-400">$200,000 USD</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="font-medium text-gray-200">🥉 3rd Place</span>
                <span className="text-yellow-400 font-bold">Wolves Esports (China)</span>
                <span className="text-sm text-gray-400">$125,000 USD</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium text-gray-200">4th Place</span>
                <span className="text-gray-300 font-bold">G2 Esports (United States)</span>
                <span className="text-sm text-gray-400">$75,000 USD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 