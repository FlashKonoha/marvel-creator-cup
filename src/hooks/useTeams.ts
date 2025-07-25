import { useDraftState } from './useDraftState'

export interface Team {
  id: number
  name: string
  logo: string
  captain: {
    id: number
    twitchName: string
    twitchImage: string
    twitchLink: string
    rank: string
    preferredRole: string[]
    heroes: string[]
  }
  players: Array<{
    id: number
    twitchName: string
    twitchImage: string
    twitchLink: string
    rank: string
    preferredRole: string[]
    heroes: string[]
  }>
}

export function useTeams() {
  const { state, loading, error, refetch } = useDraftState()

  return {
    teams: state.teams as Team[],
    loading,
    error,
    refetch
  }
} 