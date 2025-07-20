'use client'

import React from 'react';
import Link from 'next/link';
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
            <p>Last Updated: {bracketState.tournament.lastUpdated ? new Date(bracketState.tournament.lastUpdated).toLocaleString() : 'N/A'}</p>
          </div>
          <div className="mt-6">
            <Link 
              href="/tournament-bracket/admin" 
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Admin Panel
            </Link>
          </div>
        </div>

        {/* Group Stage */}
        {bracketState.tournament.status === 'group_stage' && (
          <GroupStage groups={bracketState.groupStage.groups} />
        )}

        {/* Final Stage - Show at top when tournament is in final stage */}
        {bracketState.tournament.status === 'final_stage' && (
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
      </div>
    </div>
  );
} 