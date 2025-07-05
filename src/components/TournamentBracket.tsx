import React from 'react';

interface Team {
  id: string;
  name: string;
  logo: string;
  score: number;
  isWinner: boolean;
  isLoser: boolean;
}

interface Match {
  id: string;
  title: string;
  href: string;
  team1: Team;
  team2: Team;
  time: string;
  hasVideo: boolean;
  lineDirection?: 'up' | 'down';
  isLast?: boolean;
}

interface BracketColumn {
  label: string;
  matches: Match[];
}

interface TournamentBracketProps {
  upperBracket: BracketColumn[];
  lowerBracket: BracketColumn[];
}

const TournamentBracket: React.FC<TournamentBracketProps> = ({ upperBracket, lowerBracket }) => {
  const renderMatch = (match: Match, index: number, totalMatches: number, title: string, colIndex: number) => (
    <div key={match.id} className="relative mb-8" data-index={index} data-total-matches={totalMatches} data-col-index={colIndex}>
      <a
        href={match.href}
        title={match.title}
        className="block bg-gray-800 border border-gray-700 rounded-lg shadow-sm hover:shadow-md hover:border-gray-600 transition-all duration-200"
      >
        {/* Team 1 */}
        <div className={`flex items-center justify-between p-3 border-b border-gray-700 ${
          match.team1.isLoser ? 'opacity-60' : ''
        }`}>
          <div className="flex items-center space-x-2">
            <img 
              src={match.team1.logo} 
              alt={match.team1.name}
              className="w-6 h-6 object-contain"
            />
            <span className="text-sm font-medium text-gray-100">
              {match.team1.name}
            </span>
          </div>
          <div className={`text-sm font-bold ${
            match.team1.isWinner ? 'text-green-400' : 'text-gray-400'
          }`}>
            {match.team1.score}
          </div>
        </div>
        
        {/* Team 2 */}
        <div className={`flex items-center justify-between p-3 ${
          match.team2.isLoser ? 'opacity-60' : ''
        }`}>
          <div className="flex items-center space-x-2">
            <img 
              src={match.team2.logo} 
              alt={match.team2.name}
              className="w-6 h-6 object-contain"
            />
            <span className="text-sm font-medium text-gray-100">
              {match.team2.name}
            </span>
          </div>
          <div className={`text-sm font-bold ${
            match.team2.isWinner ? 'text-green-400' : 'text-gray-400'
          }`}>
            {match.team2.score}
          </div>
        </div>
        
        {/* Match Status */}
        <div className="px-3 py-2 bg-gray-900 border-t border-gray-700 rounded-b-lg">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{match.time}</span>
            {match.hasVideo && (
              <i className="fas fa-video-camera text-gray-500"></i>
            )}
          </div>
        </div>
      </a>
      
      {/* Connecting Lines */}
      {(() => {
        const totalMatchesCount = totalMatches;
        const matchIndexValue = index;
        
        if (totalMatchesCount === 4) {
          if (matchIndexValue === 0) {
            // Line goes left down right
            return (
              <>
                <div className="absolute top-12 transform -right-4 w-4 h-1 bg-gray-600"></div>
                <div className="absolute top-12 transform -right-4 w-1 h-42 bg-gray-600"></div>
              </>
            );
          } else if (matchIndexValue === 1) {
            // Line goes left
            return (
              <div className="absolute top-12.5 transform -translate-y-1/2 -right-8 w-8 h-1 bg-gray-600"></div>
            );
          } else if (matchIndexValue === 2) {
            // Line goes left
            return (
              <div className="absolute top-12.5 transform -translate-y-1/2 -right-8 w-8 h-1 bg-gray-600"></div>
            );
          } else if (matchIndexValue === 3) {
            // Line goes left up right
            return (
              <>
                <div className="absolute top-12 transform -right-4 w-4 h-1 bg-gray-600"></div>
                <div className="absolute -top-28 transform -right-4 w-1 h-40 bg-gray-600"></div>
              </>
            );
          }
        } else if (totalMatchesCount === 2 && title === 'Upper') {
          if (matchIndexValue === 0) {
            // Line goes left down right
            return (
              <>
                <div className="absolute top-12 transform -right-4 w-4 h-1 bg-gray-600"></div>
                <div className="absolute top-12 transform -right-4 w-1 h-21 bg-gray-600"></div>
                <div className="absolute top-32.5 transform -right-8 w-4 h-1 bg-gray-600"></div>
              </>
            );
          } else if (matchIndexValue === 1) {
            // Line goes left up right
            return (
              <>
                <div className="absolute top-12 transform -right-4 w-4 h-1 bg-gray-600"></div>
                <div className="absolute -top-8 transform -right-4 w-1 h-21 bg-gray-600"></div>
              </>
            );
          }
        } else if (totalMatchesCount === 2 && colIndex === 0 && title === 'Lower') {
            if (matchIndexValue === 0) {
              // Line goes left down right
              return (
                <>
                  <div className="absolute top-12 transform -right-4 w-4 h-1 bg-gray-600"></div>
                  <div className="absolute top-12 transform -right-4 w-1 h-9 bg-gray-600"></div>
                  <div className="absolute top-20 transform -right-8 w-4 h-1 bg-gray-600"></div>
                </>
              );
            } else if (matchIndexValue === 1) {
              // Line goes left up right
              return (
                <>
                  <div className="absolute top-12 transform -right-4 w-4 h-1 bg-gray-600"></div>
                  <div className="absolute top-12 transform -right-4 w-1 h-9 bg-gray-600"></div>
                  <div className="absolute top-20 transform -right-8 w-4 h-1 bg-gray-600"></div>
                </>
              );
            }
        } else if (totalMatchesCount === 2 && colIndex === 1 && title === 'Lower') {
            if (matchIndexValue === 0) {
                // Line goes left down right
                return (
                <>
                    <div className="absolute top-12 transform -right-4 w-4 h-1 bg-gray-600"></div>
                    <div className="absolute top-12 transform -right-4 w-1 h-21 bg-gray-600"></div>
                    <div className="absolute top-32.5 transform -right-8 w-4 h-1 bg-gray-600"></div>
                </>
                );
            } else if (matchIndexValue === 1) {
                // Line goes left up right
                return (
                <>
                    <div className="absolute top-12 transform -right-4 w-4 h-1 bg-gray-600"></div>
                    <div className="absolute -top-8 transform -right-4 w-1 h-20 bg-gray-600"></div>
                </>
                );
            }
        }
        
        return null;
      })()}
    </div>
  );

  const renderBracket = (bracket: BracketColumn[], title: string) => (
    <div className={title === 'Upper' ? 'mb-12' : ''}>
      <div className="flex gap-8 overflow-x-auto">
        {bracket.map((column, colIndex) => {
          // Calculate the total height needed for all matches
          const totalMatchHeight = column.matches.length * 120; // Approximate height per match
          const containerHeight = Math.max(totalMatchHeight, 400); // Minimum height
          
          return (
            <div key={colIndex} className="flex-shrink-0 min-w-[280px] flex flex-col items-center">
              <div className="text-center text-sm font-semibold text-gray-300 mb-6 px-2 py-1 bg-gray-800 border border-gray-700 rounded">
                {column.label}
              </div>
              <div 
                className="w-full flex flex-col justify-center h-full"
                style={{ minHeight: `${containerHeight}px` }}
              >
                <div className="space-y-8">
                  {column.matches.map((match, index)=>renderMatch(match, index, column.matches.length, title, colIndex))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Upper Bracket */}
      {renderBracket(upperBracket, 'Upper')}

      {/* Spacer */}
      <div className="h-8"></div>

      {/* Lower Bracket */}
      {renderBracket(lowerBracket, 'Lower')}
    </div>
  );
};

export default TournamentBracket; 