import React from 'react';
import Image from 'next/image';

interface Team {
  id: string;
  name: string;
  logo: string;
  score: number;
  isWinner: boolean;
  isLoser: boolean;
}

interface FinalMatch {
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

interface FinalStageProps {
  semifinal: FinalMatch;
  seed2Match: FinalMatch;
  seed3Match: FinalMatch;
  playoffMatch: FinalMatch;
  grandFinal: FinalMatch;
}

const FinalStage: React.FC<FinalStageProps> = ({
  semifinal,
  seed2Match,
  seed3Match,
  playoffMatch,
  grandFinal
}) => {
  const renderMatch = (match: FinalMatch, title: string) => (
    <div key={match.id} className="glass-card rounded-lg p-4 mb-6 depth-1 hover:depth-2 transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-lg font-semibold text-white">{title}</h4>
        <span className={`text-xs px-2 py-1 rounded ${
          match.status === 'completed' ? 'bg-green-500/20 text-green-400' :
          match.status === 'ongoing' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-gray-500/20 text-gray-400'
        }`}>
          {match.status === 'completed' ? 'Completed' : 
           match.status === 'ongoing' ? 'Live' : 'Pending'}
        </span>
      </div>
      
      {/* Team 1 */}
      <div className={`flex items-center justify-between p-3 border-b border-white/10 ${
        match.team1.isLoser ? 'opacity-60' : ''
      }`}>
        <div className="flex items-center space-x-3">
          <Image 
            src={match.team1.logo} 
            alt={match.team1.name}
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
          />
          <span className="text-sm font-medium text-white">
            {match.team1.name}
          </span>
        </div>
        <div className={`text-lg font-bold ${
          match.team1.isWinner ? 'text-white' : 'text-gray-400'
        }`}>
          {match.team1Score}
        </div>
      </div>
      
      {/* Team 2 */}
      <div className={`flex items-center justify-between p-3 ${
        match.team2.isLoser ? 'opacity-60' : ''
      }`}>
        <div className="flex items-center space-x-3">
          <Image 
            src={match.team2.logo} 
            alt={match.team2.name}
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
          />
          <span className="text-sm font-medium text-white">
            {match.team2.name}
          </span>
        </div>
        <div className={`text-lg font-bold ${
          match.team2.isWinner ? 'text-white' : 'text-gray-400'
        }`}>
          {match.team2Score}
        </div>
      </div>
      
      {/* Match Info */}
      <div className="mt-3 pt-2 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Best of 3</span>
          {match.scheduledTime && (
            <span>{new Date(match.scheduledTime).toLocaleDateString()}</span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Final Stage</h1>
        <p className="text-lg text-gray-300">Knockout Phase - Best of 3</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Semifinal */}
        <div className="lg:col-span-2 xl:col-span-1">
          <h2 className="text-xl font-bold text-white mb-4 text-center">Semifinal</h2>
          {renderMatch(semifinal, "Seed 1A vs Seed 1B")}
        </div>

        {/* Seed 2 Match */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 text-center">Seed 2 Match</h2>
          {renderMatch(seed2Match, "Seed 2A vs Seed 2B")}
        </div>

        {/* Seed 3 Match */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 text-center">Seed 3 Match</h2>
          {renderMatch(seed3Match, "Seed 3A vs Seed 3B")}
        </div>

        {/* Playoff Match */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 text-center">Playoff</h2>
          {renderMatch(playoffMatch, "Seed 2 Winner vs Seed 3 Winner")}
        </div>

        {/* Grand Final */}
        <div className="lg:col-span-2 xl:col-span-2">
          <h2 className="text-xl font-bold text-white mb-4 text-center">Grand Final</h2>
          {renderMatch(grandFinal, "Semifinal Winner vs Playoff Winner")}
        </div>
      </div>

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
    </div>
  );
};

export default FinalStage; 