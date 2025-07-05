'use client'

import React, { useState } from 'react'
import { useTournamentBracket } from '../hooks/useTournamentBracket'
import { useTeams } from '../hooks/useTeams'
import Link from 'next/link'

interface AdminTournamentBracketProps {
  // Add any props if needed
}

export default function AdminTournamentBracket({}: AdminTournamentBracketProps) {
  const { bracketState, loading, error, updating, initializeBracket, updateMatchResult, resetBracket } = useTournamentBracket()
  const { teams } = useTeams()
  
  const [selectedTeams, setSelectedTeams] = useState<number[]>([])
  const [showInitializeModal, setShowInitializeModal] = useState(false)
  const [showMatchModal, setShowMatchModal] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<any>(null)
  const [matchScore, setMatchScore] = useState({ team1: 0, team2: 0 })
  const [matchTime, setMatchTime] = useState('')

  const handleTeamSelection = (teamId: number) => {
    setSelectedTeams(prev => {
      if (prev.includes(teamId)) {
        return prev.filter(id => id !== teamId)
      } else {
        if (prev.length < 8) {
          return [...prev, teamId]
        }
        return prev
      }
    })
  }

  const handleInitializeBracket = async () => {
    if (selectedTeams.length < 4) {
      alert('Please select at least 4 teams')
      return
    }

    const selectedTeamData = teams.filter(team => selectedTeams.includes(team.id))
    const result = await initializeBracket(selectedTeamData)
    
    if (result.success) {
      setShowInitializeModal(false)
      setSelectedTeams([])
    }
  }

  const handleUpdateMatch = async () => {
    if (!selectedMatch) return

    // Convert local datetime string to UTC ISO string
    let matchTimeUTC = matchTime
    if (matchTime) {
      const localDate = new Date(matchTime)
      matchTimeUTC = localDate.toISOString()
    }

    const result = await updateMatchResult(
      selectedMatch.id,
      matchScore.team1,
      matchScore.team2,
      matchTimeUTC
    )

    if (result.success) {
      setShowMatchModal(false)
      setSelectedMatch(null)
      setMatchScore({ team1: 0, team2: 0 })
      setMatchTime('')
    }
  }

  const openMatchModal = (match: any) => {
    setSelectedMatch(match)
    setMatchScore({
      team1: match.team1Score || 0,
      team2: match.team2Score || 0
    })
    setMatchTime(match.scheduledTime || '')
    setShowMatchModal(true)
  }

  const renderMatch = (match: any, roundName: string) => (
    <div key={match.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-blue-400">{roundName}</span>
        <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">{match.id}</span>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center p-2 rounded bg-gray-700">
          <div className="flex items-center space-x-2">
            <img 
              src={match.team1?.image || 'https://picsum.photos/200/200'} 
              alt={match.team1?.name || 'TBD'}
              className="w-6 h-6 rounded object-cover"
            />
            <span className="text-white font-medium">
              {match.team1 ? match.team1.name : 'TBD'}
            </span>
          </div>
          <span className={`font-bold text-lg ${match.winner === match.team1 ? 'text-green-400' : 'text-gray-400'}`}>
            {match.team1Score}
          </span>
        </div>
        
        <div className="text-center text-gray-400 text-sm font-semibold">VS</div>
        
        <div className="flex justify-between items-center p-2 rounded bg-gray-700">
          <div className="flex items-center space-x-2">
            <img 
              src={match.team2?.image || 'https://picsum.photos/200/200'} 
              alt={match.team2?.name || 'TBD'}
              className="w-6 h-6 rounded object-cover"
            />
            <span className="text-white font-medium">
              {match.team2 ? match.team2.name : 'TBD'}
            </span>
          </div>
          <span className={`font-bold text-lg ${match.winner === match.team2 ? 'text-green-400' : 'text-gray-400'}`}>
            {match.team2Score}
          </span>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex justify-between items-center">
          <span className={`text-xs px-2 py-1 rounded ${
            match.status === 'completed' 
              ? 'bg-green-900 text-green-300' 
              : 'bg-yellow-900 text-yellow-300'
          }`}>
            {match.status === 'completed' ? 'Completed' : 'Pending'}
          </span>
          
          {match.team1 && match.team2 && (
            <button
              onClick={() => openMatchModal(match)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                match.status === 'completed' 
                  ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {match.status === 'completed' ? 'Edit Result' : 'Update Result'}
            </button>
          )}
        </div>
        
        {match.scheduledTime && (
          <div className="text-xs text-gray-400">
            Scheduled: {new Date(match.scheduledTime).toLocaleString()} ({Intl.DateTimeFormat().resolvedOptions().timeZone})
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <a 
            href="https://www.twitch.tv/basimzb" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center space-x-1"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
            </svg>
            <span>Watch on Twitch</span>
          </a>
        </div>
      </div>
    </div>
  )

  const renderBracketSection = (bracket: any, title: string) => (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(bracket).map(([roundName, matches]) => (
          <div key={roundName}>
            <h4 className="text-lg font-semibold text-gray-300 mb-3 capitalize">
              {roundName.replace(/([A-Z])/g, ' $1').trim()}
            </h4>
            <div className="space-y-2">
              {(matches as any[]).map((match, index) => (
                <div key={match.id}>
                  {renderMatch(match, `${roundName} ${index + 1}`)}
                  {/* Add connecting lines for visual flow */}
                  {index < (matches as any[]).length - 1 && (
                    <div className="h-4 border-l-2 border-gray-600 ml-4"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-black py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-white text-xl mt-4">Loading tournament bracket...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-400 text-xl mb-4">Error: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/tournament-bracket" className="text-blue-400 hover:text-blue-300 transition-colors mb-2 inline-block">
              ← Back to Tournament Bracket
            </Link>
            <h1 className="text-4xl font-bold text-white">Admin Tournament Bracket</h1>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowInitializeModal(true)}
              disabled={updating || bracketState?.tournament.status === 'active'}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
            >
              Initialize Bracket
            </button>
            <button
              onClick={resetBracket}
              disabled={updating}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
            >
              Reset Bracket
            </button>
          </div>
        </div>

        {/* Tournament Status */}
        {bracketState && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{bracketState.tournament.name}</h3>
                <p className="text-gray-400">Status: {bracketState.tournament.status}</p>
              </div>
              <div>
                <p className="text-gray-400">Format: {bracketState.tournament.format}</p>
                <p className="text-gray-400">Start Date: {bracketState.tournament.startDate}</p>
              </div>
              <div>
                <p className="text-gray-400">Max Teams: {bracketState.tournament.maxTeams}</p>
                <p className="text-gray-400">Last Updated: {new Date(bracketState.lastUpdated).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400">Available Teams: {teams.length}</p>
                <p className="text-gray-400">Selected Teams: {selectedTeams.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Bracket Display */}
        {bracketState && (
          <div>
            {/* Visual Bracket Structure */}
            <div className="mb-8 p-6 bg-gray-800 border border-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Tournament Flow</h3>
              <div className="text-sm text-gray-300 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                  <span>Upper Bracket: Winners advance, losers drop to Lower Bracket</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  <span>Lower Bracket: Losers are eliminated, winners advance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span>Grand Final: Upper Bracket Winner vs Lower Bracket Winner</span>
                </div>
              </div>
            </div>

            {renderBracketSection(bracketState.brackets.upper, 'Upper Bracket')}
            {renderBracketSection(bracketState.brackets.lower, 'Lower Bracket')}
            
            {/* Grand Final */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Grand Final</h3>
              <div className="max-w-md">
                {renderMatch(bracketState.grandFinal, 'Grand Final')}
              </div>
            </div>
          </div>
        )}

        {/* Initialize Bracket Modal */}
        {showInitializeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-white mb-4">Initialize Tournament Bracket</h2>
              
              <div className="mb-6">
                <p className="text-gray-300 mb-4">
                  Select teams to participate in the tournament (4-8 teams required):
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-6">
                  {teams.map(team => (
                    <label key={team.id} className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700">
                      <input
                        type="checkbox"
                        checked={selectedTeams.includes(team.id)}
                        onChange={() => handleTeamSelection(team.id)}
                        className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                      />
                      <img src={team.image} alt={team.name} className="w-8 h-8 rounded object-cover" />
                      <span className="text-white">{team.name}</span>
                    </label>
                  ))}
                </div>

                {/* Preview Bracket */}
                {selectedTeams.length >= 4 && (
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Bracket Preview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Array.from({ length: Math.ceil(selectedTeams.length / 2) }, (_, i) => {
                        const team1 = teams.find(t => t.id === selectedTeams[i * 2])
                        const team2 = teams.find(t => t.id === selectedTeams[i * 2 + 1])
                        return (
                          <div key={i} className="bg-gray-700 rounded-lg p-3">
                            <div className="text-sm text-gray-400 mb-2">Match {i + 1}</div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <img src={team1?.image} alt={team1?.name} className="w-6 h-6 rounded object-cover" />
                                <span className="text-white text-sm">{team1?.name || 'TBD'}</span>
                              </div>
                              <span className="text-gray-400 text-sm">vs</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-white text-sm">{team2?.name || 'TBD'}</span>
                                <img src={team2?.image} alt={team2?.name} className="w-6 h-6 rounded object-cover" />
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  Selected: {selectedTeams.length} teams
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowInitializeModal(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleInitializeBracket}
                    disabled={updating || selectedTeams.length < 4}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                  >
                    {updating ? 'Initializing...' : 'Initialize Bracket'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Update Match Result Modal */}
        {showMatchModal && selectedMatch && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-white mb-4">Update Match Result</h2>
              
              <div className="mb-4">
                <p className="text-gray-300 mb-4">
                  {selectedMatch.team1?.name} vs {selectedMatch.team2?.name}
                </p>
                <p className="text-gray-400 mb-4">Best of {selectedMatch.bestOf}</p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">{selectedMatch.team1?.name}</span>
                    <input
                      type="number"
                      min="0"
                      max={selectedMatch.bestOf}
                      value={matchScore.team1}
                      onChange={(e) => setMatchScore(prev => ({ ...prev, team1: parseInt(e.target.value) || 0 }))}
                      className="w-20 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-center"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white">{selectedMatch.team2?.name}</span>
                    <input
                      type="number"
                      min="0"
                      max={selectedMatch.bestOf}
                      value={matchScore.team2}
                      onChange={(e) => setMatchScore(prev => ({ ...prev, team2: parseInt(e.target.value) || 0 }))}
                      className="w-20 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-center"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Match Time</label>
                    <input
                      type="datetime-local"
                      value={matchTime}
                      onChange={(e) => setMatchTime(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      placeholder="Select match time"
                    />
                  </div>
                </div>

                {matchScore.team1 === matchScore.team2 && matchScore.team1 > 0 && (
                  <p className="text-blue-400 text-sm mt-2">
                    Match is tied - both teams have {matchScore.team1} wins
                  </p>
                )}
                
                {matchScore.team1 + matchScore.team2 > selectedMatch.bestOf && (
                  <p className="text-red-400 text-sm mt-2">
                    Total games cannot exceed {selectedMatch.bestOf} in a Best of {selectedMatch.bestOf} match
                  </p>
                )}
                
                {Math.max(matchScore.team1, matchScore.team2) > Math.ceil(selectedMatch.bestOf / 2) && (
                  <p className="text-green-400 text-sm mt-2">
                    {matchScore.team1 > matchScore.team2 ? selectedMatch.team1?.name : selectedMatch.team2?.name} wins the series!
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowMatchModal(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateMatch}
                  disabled={updating || 
                    (matchScore.team1 + matchScore.team2 > selectedMatch.bestOf) ||
                    (Math.max(matchScore.team1, matchScore.team2) > Math.ceil(selectedMatch.bestOf / 2) && matchScore.team1 !== matchScore.team2)
                  }
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                >
                  {updating ? 'Updating...' : 'Update Result'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 