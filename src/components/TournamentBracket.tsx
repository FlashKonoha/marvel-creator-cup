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
      <div
        className="block glass-card rounded-lg depth-1 hover:depth-2 transition-all duration-200"
      >
        {/* Team 1 */}
        <div className={`flex items-center justify-between p-3 border-b border-white/10 ${
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
            {match.team1.score}
          </div>
        </div>
        
        {/* Team 2 */}
        <div className={`flex items-center justify-between p-3 ${
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
            {match.team2.score}
          </div>
        </div>
        
        {/* Match Status */}
        <div className="px-3 py-2 bg-black/20 border-t border-white/10 rounded-b-lg">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="pr-3">{match.time}</span>
            {match.hasVideo && (
              <a 
                href="https://www.twitch.tv/basimzb" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors flex items-center space-x-1"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                </svg>
                <span>Twitch</span>
              </a>
            )}
          </div>
        </div>
      </div>
      
      {/* Connecting Lines */}
      {(() => {
        const totalMatchesCount = totalMatches;
        const matchIndexValue = index;
        
        if (totalMatchesCount === 4) {
          if (matchIndexValue === 0) {
            // Line goes left down right
            return (
              <>
                <div className="absolute top-12 transform -right-4 w-4 h-0.5 bg-gray-600"></div>
                <div className="absolute top-12 transform -right-4 w-0.5 h-42 bg-gray-600"></div>
              </>
            );
          } else if (matchIndexValue === 1) {
            // Line goes left
            return (
              <div className="absolute top-12.5 transform -translate-y-1/2 -right-8 w-8 h-0.5 bg-gray-600"></div>
            );
          } else if (matchIndexValue === 2) {
            // Line goes left
            return (
              <div className="absolute top-12.5 transform -translate-y-1/2 -right-8 w-8 h-0.5 bg-gray-600"></div>
            );
          } else if (matchIndexValue === 3) {
            // Line goes left up right
            return (
              <>
                <div className="absolute top-12 transform -right-4 w-4 h-0.5 bg-gray-600"></div>
                <div className="absolute -top-29 transform -right-4 w-0.5 h-41 bg-gray-600"></div>
              </>
            );
          }
        } else if (totalMatchesCount === 2 && title === 'Upper') {
          if (matchIndexValue === 0) {
            // Line goes left down right
            return (
              <>
                <div className="absolute top-12 transform -right-4 w-4 h-0.5 bg-gray-600"></div>
                <div className="absolute top-12 transform -right-4 w-0.5 h-21 bg-gray-600"></div>
                <div className="absolute top-32.5 transform -right-8 w-4 h-0.5 bg-gray-600"></div>
              </>
            );
          } else if (matchIndexValue === 1) {
            // Line goes left up right
            return (
              <>
                <div className="absolute top-12 transform -right-4 w-4 h-0.5 bg-gray-600"></div>
                <div className="absolute -top-9 transform -right-4 w-0.5 h-21 bg-gray-600"></div>
              </>
            );
          }
        } else if (totalMatchesCount === 2 && colIndex === 0 && title === 'Lower') {
            if (matchIndexValue === 0) {
              // Line goes left down right
              return (
                <>
                  <div className="absolute top-12 transform -right-4 w-4 h-0.5 bg-gray-600"></div>
                  <div className="absolute top-12 transform -right-4 w-0.5 h-8.5 bg-gray-600"></div>
                  <div className="absolute top-20 transform -right-8 w-4 h-0.5 bg-gray-600"></div>
                </>
              );
            } else if (matchIndexValue === 1) {
              // Line goes left up right
              return (
                <>
                  <div className="absolute top-12 transform -right-4 w-4 h-0.5 bg-gray-600"></div>
                  <div className="absolute top-12 transform -right-4 w-0.5 h-8.5 bg-gray-600"></div>
                  <div className="absolute top-20 transform -right-8 w-4 h-0.5 bg-gray-600"></div>
                </>
              );
            }
        } else if (totalMatchesCount === 2 && colIndex === 1 && title === 'Lower') {
            if (matchIndexValue === 0) {
                // Line goes left down right
                return (
                <>
                    <div className="absolute top-12 transform -right-4 w-4 h-0.5 bg-gray-600"></div>
                    <div className="absolute top-12 transform -right-4 w-0.5 h-21.5 bg-gray-600"></div>
                    <div className="absolute top-32.5 transform -right-8 w-4 h-0.5 bg-gray-600"></div>
                </>
                );
            } else if (matchIndexValue === 1) {
                // Line goes left up right
                return (
                <>
                    <div className="absolute top-12 transform -right-4 w-4 h-0.5 bg-gray-600"></div>
                    <div className="absolute -top-8 transform -right-4 w-0.5 h-20 bg-gray-600"></div>
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
              <div className="text-center text-sm font-semibold text-white mb-6 px-2 py-1 glass-card rounded">
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