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

interface GroupMatch {
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

interface GroupStanding {
  team: Team;
  matchesPlayed: number;
  mapWins: number;
  mapLosses: number;
  totalScore: number;
  rank: number;
}

interface Group {
  id: string;
  name: string;
  teams: Team[];
  matches: GroupMatch[];
  standings: GroupStanding[];
}

interface GroupStageProps {
  groups: Group[];
}

const GroupStage: React.FC<GroupStageProps> = ({ groups }) => {
  const renderMatch = (match: GroupMatch) => (
    <div key={match.id} className="glass-card rounded-lg p-4 mb-4 depth-1 hover:depth-2 transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-white">{match.title}</h4>
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
      <div className={`flex items-center justify-between p-2 border-b border-white/10 ${
        match.team1.isLoser ? 'opacity-60' : ''
      }`}>
        <div className="flex items-center space-x-2">
          <Image 
            src={match.team1.logo} 
            alt={match.team1.name}
            width={24}
            height={24}
            className="w-6 h-6 object-contain"
          />
          <span className="text-sm font-medium text-white">
            {match.team1.name}
          </span>
        </div>
        <div className={`text-sm font-bold ${
          match.team1.isWinner ? 'text-white' : 'text-gray-400'
        }`}>
          {match.team1MapWins}
        </div>
      </div>
      
      {/* Team 2 */}
      <div className={`flex items-center justify-between p-2 ${
        match.team2.isLoser ? 'opacity-60' : ''
      }`}>
        <div className="flex items-center space-x-2">
          <Image 
            src={match.team2.logo} 
            alt={match.team2.name}
            width={24}
            height={24}
            className="w-6 h-6 object-contain"
          />
          <span className="text-sm font-medium text-white">
            {match.team2.name}
          </span>
        </div>
        <div className={`text-sm font-bold ${
          match.team2.isWinner ? 'text-white' : 'text-gray-400'
        }`}>
          {match.team2MapWins}
        </div>
      </div>
      
      {/* Match Info */}
      <div className="mt-3 pt-2 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Best of 3 Maps</span>
          {match.scheduledTime && (
            <span>{new Date(match.scheduledTime).toLocaleDateString()}</span>
          )}
        </div>
      </div>
    </div>
  );

  const renderStandings = (standings: GroupStanding[]) => (
    <div className="glass-card rounded-lg p-4 depth-1">
      <h3 className="text-lg font-bold text-white mb-4">Group Standings</h3>
      <div className="space-y-2">
        {standings.map((standing, index) => (
          <div key={standing.team.id} className="flex items-center justify-between p-2 rounded bg-black/20">
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                index < 3 ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300'
              }`}>
                {standing.rank}
              </div>
              <Image 
                src={standing.team.logo} 
                alt={standing.team.name}
                width={24}
                height={24}
                className="w-6 h-6 object-contain"
              />
              <span className="text-sm font-medium text-white">
                {standing.team.name}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-xs text-gray-300">
              <span>MP: {standing.matchesPlayed}</span>
              <span>W: {standing.mapWins}</span>
              <span>L: {standing.mapLosses}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Group Stage</h1>
        <p className="text-lg text-gray-300">Round Robin - Best of 3 Maps per Match</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {groups.map((group) => (
          <div key={group.id} className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">{group.name}</h2>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Matches */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Matches</h3>
                <div className="space-y-2">
                  {group.matches.map(renderMatch)}
                </div>
              </div>
              
              {/* Standings */}
              <div>
                {renderStandings(group.standings)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupStage; 