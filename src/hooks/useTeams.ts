import { useDraftState } from './useDraftState'

export interface Team {
  id: number
  name: string
  image: string
  captain: {
    id: number
    twitchName: string
    twitchImage: string
    twitchLink: string
  }
  players: Array<{
    id: number
    twitchName: string
    twitchImage: string
    twitchLink: string
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