'use client'

import React from 'react';
import GroupStage from '../../components/GroupStage';
import FinalStage from '../../components/FinalStage';
import { useTournamentBracket } from '../../hooks/useTournamentBracket';


export default function TournamentBracketPage() {
  const { bracketState, loading, error } = useTournamentBracket();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading tournament data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gray-400 text-xl">Error loading tournament data: {error}</div>
      </div>
    );
  }

  if (!bracketState) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto py-8">
          <div className="text-center py-12">
            <div className="glass-card rounded-lg p-8 max-w-2xl mx-auto depth-2">
              <h3 className="text-2xl font-bold text-white mb-4">Tournament Not Started</h3>
              <p className="text-gray-300 mb-6">
                The tournament will appear here once it has been initialized.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {bracketState.tournament.name}
          </h1>
          <p className="text-lg text-gray-300">
            Tournament Bracket - {bracketState.tournament.format}
          </p>
          <div className="mt-4 text-sm text-gray-400">
            <p>Status: {bracketState.tournament.status}</p>
            <p>Format: {bracketState.tournament.format}</p>
          </div>
        </div>

        
        {/* Tournament Completed */}
        {bracketState.tournament.status === 'completed' && (
          <div className="text-center py-12">
            <div className="glass-card rounded-lg p-8 max-w-2xl mx-auto depth-2">
              <h3 className="text-2xl font-bold text-white mb-4">Tournament Completed</h3>
              <p className="text-gray-300 mb-6">
                The tournament has finished. Check the final stage results above.
              </p>
            </div>
          </div>
        )}

        
      {/* Tournament Flow Diagram */}
      <div className="mt-12">
        <div className="glass-card rounded-lg p-6 depth-1">
          <h3 className="text-xl font-bold text-white mb-6 text-center">Tournament Flow</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-sm text-gray-400">Group Stage</div>
              <div className="text-xs text-gray-500">Top 3 teams from each group advance</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-400">Final Stage</div>
              <div className="text-xs text-gray-500">Seed 1s → Semifinal<br/>Seed 2s & 3s → Playoff</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-400">Grand Final</div>
              <div className="text-xs text-gray-500">Semifinal winner vs Playoff winner</div>
            </div>
          </div>
        </div>
      </div>

        {/* Group Stage */}
        {bracketState.tournament.status === 'group_stage' && (
          <GroupStage groups={bracketState.groupStage.groups} />
        )}

        {/* Final Stage - Show at top when tournament is in final stage */}
        {(bracketState.tournament.status === 'final_stage' || bracketState.tournament.status === 'completed') && (
          <>
            <FinalStage 
              semifinal={bracketState.finalStage.semifinal}
              seed2Match={bracketState.finalStage.seed2Match}
              seed3Match={bracketState.finalStage.seed3Match}
              playoffMatch={bracketState.finalStage.playoffMatch}
              grandFinal={bracketState.finalStage.grandFinal}
            />
            <div className="mt-12">
              <GroupStage groups={bracketState.groupStage.groups} />
            </div>
          </>
        )}

        {/* Show both stages if group stage is completed but final stage hasn't started */}
        {bracketState.tournament.status === 'group_stage' && bracketState.groupStage.isCompleted && (
          <>
            <GroupStage groups={bracketState.groupStage.groups} />
            <div className="mt-12">
              <FinalStage 
                semifinal={bracketState.finalStage.semifinal}
                seed2Match={bracketState.finalStage.seed2Match}
                seed3Match={bracketState.finalStage.seed3Match}
                playoffMatch={bracketState.finalStage.playoffMatch}
                grandFinal={bracketState.finalStage.grandFinal}
              />
            </div>
          </>
        )}

      </div>
    </div>
  );
} 