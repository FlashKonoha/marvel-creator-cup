// This file is kept for compatibility but the real-time updates now use timestamp-based polling
// The actual polling logic is implemented in the frontend hooks

export const broadcastUpdate = async () => {
  // No-op for now - updates are detected via timestamp polling
  console.log('Draft update broadcast (timestamp-based polling will detect this)')
}

export const broadcastTournamentUpdate = async () => {
  // No-op for now - updates are detected via timestamp polling
  console.log('Tournament update broadcast (timestamp-based polling will detect this)')
} 