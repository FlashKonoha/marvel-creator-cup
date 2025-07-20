'use client'

import React, { useState } from 'react'
import { useTournamentBracket } from '../hooks/useTournamentBracket'
import { useTeams } from '../hooks/useTeams'
import Link from 'next/link'
import Image from 'next/image'
import type { GroupMatch, FinalMatch } from '../data/tournamentBracketData'

export default function AdminTournamentBracket() {
  const { 
    bracketState, 
    loading, 
    error, 
    updating, 
    initializeTournament, 
    updateGroupMatch, 
    updateFinalMatch, 
    advanceToFinalStage,
    resetTournament 
  } = useTournamentBracket()
  const { teams } = useTeams()
  
  const [selectedTeams, setSelectedTeams] = useState<number[]>([])
  const [showInitializeModal, setShowInitializeModal] = useState(false)
  const [showGroupMatchModal, setShowGroupMatchModal] = useState(false)
  const [showFinalMatchModal, setShowFinalMatchModal] = useState(false)
  const [selectedGroupMatch, setSelectedGroupMatch] = useState<GroupMatch | null>(null)
  const [selectedFinalMatch, setSelectedFinalMatch] = useState<FinalMatch | null>(null)
  const [groupMatchScore, setGroupMatchScore] = useState({ team1: 0, team2: 0 })
  const [finalMatchScore, setFinalMatchScore] = useState({ team1: 0, team2: 0 })
  const [matchTime, setMatchTime] = useState('')

  const handleTeamSelection = (teamId: number) => {
    setSelectedTeams(prev => {
      if (prev.includes(teamId)) {
        return prev.filter(id => id !== teamId)
      } else {
        if (prev.length < 12) {
          return [...prev, teamId]
        }
        return prev
      }
    })
  }

  const handleInitializeTournament = async () => {
    if (selectedTeams.length < 6) {
      alert('Please select at least 6 teams')
      return
    }

    const selectedTeamData = teams.filter(team => selectedTeams.includes(team.id))
    const result = await initializeTournament(selectedTeamData)
    
    if (result.success) {
      setShowInitializeModal(false)
      setSelectedTeams([])
    }
  }

  const handleUpdateGroupMatch = async () => {
    if (!selectedGroupMatch) return

    let matchTimeUTC = matchTime
    if (matchTime) {
      const localDate = new Date(matchTime)
      matchTimeUTC = localDate.toISOString()
    }

    const result = await updateGroupMatch(
      selectedGroupMatch.id,
      groupMatchScore.team1,
      groupMatchScore.team2,
      matchTimeUTC
    )

    if (result.success) {
      setShowGroupMatchModal(false)
      setSelectedGroupMatch(null)
      setGroupMatchScore({ team1: 0, team2: 0 })
      setMatchTime('')
    }
  }

  const handleUpdateFinalMatch = async () => {
    if (!selectedFinalMatch) return

    let matchTimeUTC = matchTime
    if (matchTime) {
      const localDate = new Date(matchTime)
      matchTimeUTC = localDate.toISOString()
    }

    const result = await updateFinalMatch(
      selectedFinalMatch.id,
      finalMatchScore.team1,
      finalMatchScore.team2,
      matchTimeUTC
    )

    if (result.success) {
      setShowFinalMatchModal(false)
      setSelectedFinalMatch(null)
      setFinalMatchScore({ team1: 0, team2: 0 })
      setMatchTime('')
    }
  }

  const openGroupMatchModal = (match: GroupMatch) => {
    setSelectedGroupMatch(match)
    setGroupMatchScore({
      team1: match.team1MapWins || 0,
      team2: match.team2MapWins || 0
    })
    setMatchTime(match.scheduledTime || '')
    setShowGroupMatchModal(true)
  }

  const openFinalMatchModal = (match: FinalMatch) => {
    setSelectedFinalMatch(match)
    setFinalMatchScore({
      team1: match.team1Score || 0,
      team2: match.team2Score || 0
    })
    setMatchTime(match.scheduledTime || '')
    setShowFinalMatchModal(true)
  }

  const handleAdvanceToFinalStage = async () => {
    const result = await advanceToFinalStage()
    if (result.success) {
      // Successfully advanced to final stage
    }
  }



  const renderGroupMatch = (match: GroupMatch, groupName: string): React.JSX.Element => (
    <div key={match.id} className="bg-gray-800/50 border border-white/10 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-white">{groupName}</span>
        <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">{match.id}</span>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center p-2 rounded bg-gray-700/50">
          <div className="flex items-center space-x-2">
            <Image 
              src={match.team1.logo} 
              alt={match.team1.name}
              width={24}
              height={24}
              className="w-6 h-6 rounded object-cover"
            />
            <span className="text-white font-medium">
              {match.team1.name}
            </span>
          </div>
          <span className={`font-bold text-lg ${match.team1.isWinner ? 'text-white' : 'text-gray-400'}`}>
            {match.team1MapWins}
          </span>
        </div>
        
        <div className="text-center text-gray-400 text-sm font-semibold">VS</div>
        
        <div className="flex justify-between items-center p-2 rounded bg-gray-700/50">
          <div className="flex items-center space-x-2">
            <Image 
              src={match.team2.logo} 
              alt={match.team2.name}
              width={24}
              height={24}
              className="w-6 h-6 rounded object-cover"
            />
            <span className="text-white font-medium">
              {match.team2.name}
            </span>
          </div>
          <span className={`font-bold text-lg ${match.team2.isWinner ? 'text-white' : 'text-gray-400'}`}>
            {match.team2MapWins}
          </span>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex justify-between items-center">
          <span className={`text-xs px-2 py-1 rounded ${
            match.status === 'completed' 
              ? 'bg-green-900 text-green-300' 
              : match.status === 'ongoing'
              ? 'bg-yellow-900 text-yellow-300'
              : 'bg-gray-900 text-gray-300'
          }`}>
            {match.status === 'completed' ? 'Completed' : match.status === 'ongoing' ? 'Live' : 'Pending'}
          </span>
          
          <button
            onClick={() => openGroupMatchModal(match)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              match.status === 'completed' 
                ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {match.status === 'completed' ? 'Edit Result' : 'Update Result'}
          </button>
        </div>
        
        {match.scheduledTime && (
          <div className="text-xs text-gray-400">
            Scheduled: {new Date(match.scheduledTime).toLocaleString()} ({Intl.DateTimeFormat().resolvedOptions().timeZone})
          </div>
        )}
      </div>
    </div>
  )

  const renderFinalMatch = (match: FinalMatch, stageName: string): React.JSX.Element => (
    <div key={match.id} className="bg-gray-800/50 border border-white/10 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-white">{stageName}</span>
        <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">{match.id}</span>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center p-2 rounded bg-gray-700/50">
          <div className="flex items-center space-x-2">
            <Image 
              src={match.team1.logo} 
              alt={match.team1.name}
              width={24}
              height={24}
              className="w-6 h-6 rounded object-cover"
            />
            <span className="text-white font-medium">
              {match.team1.name}
            </span>
          </div>
          <span className={`font-bold text-lg ${match.team1.isWinner ? 'text-white' : 'text-gray-400'}`}>
            {match.team1Score}
          </span>
        </div>
        
        <div className="text-center text-gray-400 text-sm font-semibold">VS</div>
        
        <div className="flex justify-between items-center p-2 rounded bg-gray-700/50">
          <div className="flex items-center space-x-2">
            <Image 
              src={match.team2.logo} 
              alt={match.team2.name}
              width={24}
              height={24}
              className="w-6 h-6 rounded object-cover"
            />
            <span className="text-white font-medium">
              {match.team2.name}
            </span>
          </div>
          <span className={`font-bold text-lg ${match.team2.isWinner ? 'text-white' : 'text-gray-400'}`}>
            {match.team2Score}
          </span>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex justify-between items-center">
          <span className={`text-xs px-2 py-1 rounded ${
            match.status === 'completed' 
              ? 'bg-green-900 text-green-300' 
              : match.status === 'ongoing'
              ? 'bg-yellow-900 text-yellow-300'
              : 'bg-gray-900 text-gray-300'
          }`}>
            {match.status === 'completed' ? 'Completed' : match.status === 'ongoing' ? 'Live' : 'Pending'}
          </span>
          
          <button
            onClick={() => openFinalMatchModal(match)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              match.status === 'completed' 
                ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {match.status === 'completed' ? 'Edit Result' : 'Update Result'}
          </button>
        </div>
        
        {match.scheduledTime && (
          <div className="text-xs text-gray-400">
            Scheduled: {new Date(match.scheduledTime).toLocaleString()} ({Intl.DateTimeFormat().resolvedOptions().timeZone})
          </div>
        )}
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-black py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
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
            <Link href="/tournament-bracket" className="text-white hover:text-gray-300 transition-colors mb-2 inline-block">
              ← Back to Tournament Bracket
            </Link>
            <h1 className="text-4xl font-bold text-white">Admin Tournament Bracket</h1>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowInitializeModal(true)}
              disabled={updating || bracketState?.tournament.status !== 'pending'}
              className="bg-white hover:bg-gray-200 disabled:bg-gray-600 text-black px-4 py-2 rounded transition-colors"
            >
              Initialize Tournament
            </button>
            {bracketState?.groupStage.isCompleted && bracketState?.tournament.status === 'group_stage' && (
              <button
                onClick={handleAdvanceToFinalStage}
                disabled={updating}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
              >
                Advance to Final Stage
              </button>
            )}
            <button
              onClick={resetTournament}
              disabled={updating}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors border border-white/20"
            >
              Reset Tournament
            </button>
          </div>
        </div>

        {/* Tournament Status */}
        {bracketState && (
          <div className="bg-gray-900/50 border border-white/10 rounded-lg p-6 mb-8">
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
                <p className="text-gray-400">Last Updated: {bracketState.tournament.lastUpdated ? new Date(bracketState.tournament.lastUpdated).toLocaleString() : 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-400">Available Teams: {teams.length}</p>
                <p className="text-gray-400">Selected Teams: {selectedTeams.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tournament Display */}
        {bracketState && (
          <div>
            {/* Tournament Flow */}
            <div className="mb-8 p-6 bg-gray-800/50 border border-white/10 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Tournament Flow</h3>
              <div className="text-sm text-gray-300 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-white rounded-full"></span>
                  <span>Group Stage: Round-robin matches, top 3 teams from each group advance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
                  <span>Final Stage: Seed 1s → Semifinal, Seed 2s & 3s → Playoff</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-gray-600 rounded-full"></span>
                  <span>Grand Final: Semifinal winner vs Playoff winner</span>
                </div>
              </div>
            </div>

            {/* Group Stage */}
            {bracketState.tournament.status === 'group_stage' && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Group Stage</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {bracketState.groupStage.groups.map((group) => (
                    <div key={group.id}>
                      <h4 className="text-lg font-semibold text-gray-300 mb-4">{group.name}</h4>
                      <div className="space-y-2">
                        {group.matches.map((match) => renderGroupMatch(match, group.name))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Final Stage */}
            {(bracketState.tournament.status === 'final_stage' || bracketState.groupStage.isCompleted) && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Final Stage</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-300 mb-4">Semifinal</h4>
                    {renderFinalMatch(bracketState.finalStage.semifinal, 'Semifinal')}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-300 mb-4">Seed 2 Match</h4>
                    {renderFinalMatch(bracketState.finalStage.seed2Match, 'Seed 2')}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-300 mb-4">Seed 3 Match</h4>
                    {renderFinalMatch(bracketState.finalStage.seed3Match, 'Seed 3')}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-300 mb-4">Playoff</h4>
                    {renderFinalMatch(bracketState.finalStage.playoffMatch, 'Playoff')}
                  </div>
                  <div className="lg:col-span-2 xl:col-span-2">
                    <h4 className="text-lg font-semibold text-gray-300 mb-4">Grand Final</h4>
                    {renderFinalMatch(bracketState.finalStage.grandFinal, 'Grand Final')}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Initialize Tournament Modal */}
        {showInitializeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-white mb-4">Initialize Tournament</h2>
              
              <div className="mb-6">
                <p className="text-gray-300 mb-4">
                  Select teams to participate in the tournament (6-12 teams required):
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
                      <Image src={team.image} alt={team.name} width={32} height={32} className="w-8 h-8 rounded object-cover" />
                      <span className="text-white">{team.name}</span>
                    </label>
                  ))}
                </div>

                {/* Preview Groups */}
                {selectedTeams.length >= 6 && (
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Group Preview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-md font-semibold text-gray-300 mb-2">Group A</h4>
                        <div className="space-y-2">
                          {selectedTeams.slice(0, Math.ceil(selectedTeams.length / 2)).map((teamId) => {
                            const team = teams.find(t => t.id === teamId)
                            return (
                              <div key={teamId} className="flex items-center space-x-2 bg-gray-700 rounded-lg p-2">
                                <Image src={team?.image || '/logo.png'} alt={team?.name || 'TBD'} width={24} height={24} className="w-6 h-6 rounded object-cover" />
                                <span className="text-white text-sm">{team?.name || 'TBD'}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-md font-semibold text-gray-300 mb-2">Group B</h4>
                        <div className="space-y-2">
                          {selectedTeams.slice(Math.ceil(selectedTeams.length / 2)).map((teamId) => {
                            const team = teams.find(t => t.id === teamId)
                            return (
                              <div key={teamId} className="flex items-center space-x-2 bg-gray-700 rounded-lg p-2">
                                <Image src={team?.image || '/logo.png'} alt={team?.name || 'TBD'} width={24} height={24} className="w-6 h-6 rounded object-cover" />
                                <span className="text-white text-sm">{team?.name || 'TBD'}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
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
                    onClick={handleInitializeTournament}
                    disabled={updating || selectedTeams.length < 6}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                  >
                    {updating ? 'Initializing...' : 'Initialize Tournament'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Update Group Match Result Modal */}
        {showGroupMatchModal && selectedGroupMatch && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-white mb-4">Update Group Match Result</h2>
              
              <div className="mb-4">
                <p className="text-gray-300 mb-4">
                  {selectedGroupMatch.team1.name} vs {selectedGroupMatch.team2.name}
                </p>
                <p className="text-gray-400 mb-4">Best of 3 Maps</p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">{selectedGroupMatch.team1.name}</span>
                    <input
                      type="number"
                      min="0"
                      max="3"
                      value={groupMatchScore.team1}
                      onChange={(e) => setGroupMatchScore(prev => ({ ...prev, team1: parseInt(e.target.value) || 0 }))}
                      className="w-20 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-center"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white">{selectedGroupMatch.team2.name}</span>
                    <input
                      type="number"
                      min="0"
                      max="3"
                      value={groupMatchScore.team2}
                      onChange={(e) => setGroupMatchScore(prev => ({ ...prev, team2: parseInt(e.target.value) || 0 }))}
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

                {groupMatchScore.team1 === groupMatchScore.team2 && groupMatchScore.team1 > 0 && (
                  <p className="text-blue-400 text-sm mt-2">
                    Match is tied - both teams have {groupMatchScore.team1} map wins
                  </p>
                )}
                
                {groupMatchScore.team1 + groupMatchScore.team2 > 5 && (
                  <p className="text-red-400 text-sm mt-2">
                    Total maps cannot exceed 5 in a Best of 3 match
                  </p>
                )}
                
                {Math.max(groupMatchScore.team1, groupMatchScore.team2) >= 2 && (
                  <p className="text-green-400 text-sm mt-2">
                    {groupMatchScore.team1 > groupMatchScore.team2 ? selectedGroupMatch.team1.name : selectedGroupMatch.team2.name} wins the match!
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowGroupMatchModal(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateGroupMatch}
                  disabled={updating || 
                    (groupMatchScore.team1 + groupMatchScore.team2 > 5)
                  }
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                >
                  {updating ? 'Updating...' : 'Update Result'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Update Final Match Result Modal */}
        {showFinalMatchModal && selectedFinalMatch && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-white mb-4">Update Final Match Result</h2>
              
              <div className="mb-4">
                <p className="text-gray-300 mb-4">
                  {selectedFinalMatch.team1.name} vs {selectedFinalMatch.team2.name}
                </p>
                <p className="text-gray-400 mb-4">Best of 3</p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">{selectedFinalMatch.team1.name}</span>
                    <input
                      type="number"
                      min="0"
                      max="3"
                      value={finalMatchScore.team1}
                      onChange={(e) => setFinalMatchScore(prev => ({ ...prev, team1: parseInt(e.target.value) || 0 }))}
                      className="w-20 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-center"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white">{selectedFinalMatch.team2.name}</span>
                    <input
                      type="number"
                      min="0"
                      max="3"
                      value={finalMatchScore.team2}
                      onChange={(e) => setFinalMatchScore(prev => ({ ...prev, team2: parseInt(e.target.value) || 0 }))}
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

                {finalMatchScore.team1 === finalMatchScore.team2 && finalMatchScore.team1 > 0 && (
                  <p className="text-blue-400 text-sm mt-2">
                    Match is tied - both teams have {finalMatchScore.team1} wins
                  </p>
                )}
                
                {finalMatchScore.team1 + finalMatchScore.team2 > 3 && (
                  <p className="text-red-400 text-sm mt-2">
                    Total games cannot exceed 3 in a Best of 3 match
                  </p>
                )}
                
                {Math.max(finalMatchScore.team1, finalMatchScore.team2) >= 2 && (
                  <p className="text-green-400 text-sm mt-2">
                    {finalMatchScore.team1 > finalMatchScore.team2 ? selectedFinalMatch.team1.name : selectedFinalMatch.team2.name} wins the series!
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowFinalMatchModal(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateFinalMatch}
                  disabled={updating || 
                    (finalMatchScore.team1 + finalMatchScore.team2 > 3) ||
                    (Math.max(finalMatchScore.team1, finalMatchScore.team2) >= 2 && finalMatchScore.team1 !== finalMatchScore.team2)
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