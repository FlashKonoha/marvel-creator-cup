import Link from 'next/link'

export default function TournamentInfo() {
  return (
    <main className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Link href="/" className="text-white hover:text-gray-300 transition-colors mb-4 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Tournament Information
            </h1>
            <p className="text-xl text-gray-300">
              Everything you need to know about the Marvel Creator Cup
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Tournament Overview */}
            <div className="glass-card rounded-lg p-6 depth-2">
              <h2 className="text-2xl font-bold text-white mb-4">Tournament Overview</h2>
              <div className="space-y-3 text-gray-300">
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="text-white font-semibold">July 26, 2025</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span className="text-white font-semibold">6:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span>Format:</span>
                  <span className="text-white font-semibold">BO3 Winners/Losers Bracket</span>
                </div>
                <div className="flex justify-between">
                  <span>Teams:</span>
                  <span className="text-white font-semibold">6-8 Teams</span>
                </div>
                <div className="flex justify-between">
                  <span>Game Mode:</span>
                  <span className="text-white font-semibold">6v6</span>
                </div>
                <div className="flex justify-between">
                  <span>Draft Date:</span>
                  <span className="text-white font-semibold">July 18, 2025</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform:</span>
                  <span className="text-white font-semibold">PC & Console</span>
                </div>
              </div>
            </div>

            {/* Prize Pool */}
            <div className="glass-card rounded-lg p-6 depth-2">
              <h2 className="text-2xl font-bold text-white mb-4">Prize Pool</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-black/20 rounded">
                  <span className="text-2xl">🥇</span>
                  <span className="text-white font-semibold">1st Place</span>
                  <span className="text-white font-bold text-xl">$2000</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-black/20 rounded">
                  <span className="text-2xl">🥈</span>
                  <span className="text-white font-semibold">2nd Place</span>
                  <span className="text-gray-300 font-bold text-xl">$600</span>
                </div>
              </div>
            </div>
          </div>

          {/* Team Draft Process */}
          <div className="mt-8 glass-card rounded-lg p-6 depth-2">
            <h2 className="text-2xl font-bold text-white mb-6">Team Draft Process</h2>
            <div className="space-y-4 text-gray-300">
              <div className="border-l-4 border-white/30 pl-4">
                <h3 className="text-white font-semibold mb-2">Draft Overview</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Draft Date: July 21, 2025 (One week before tournament)</li>
                  <li>• Team captains will select their 5 additional players</li>
                  <li>• Each team will have exactly 6 players total</li>
                  <li>• Draft order will be determined by random selection</li>
                  <li>• Snake draft format: 1-2-3-4-5-6-6-5-4-3-2-1</li>
                </ul>
              </div>
              <div className="border-l-4 border-white/20 pl-4">
                <h3 className="text-white font-semibold mb-2">Team Structure</h3>
                <ul className="space-y-2 text-sm">
                  <li>• 6-8 teams total (depending on registration)</li>
                  <li>• Each team: 1 captain + 5 drafted players</li>
                  <li>• Teams will compete in 6v6 format</li>
                  <li>• Team captains responsible for coordination</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link 
                href="/draft" 
                className="glass-button text-white px-6 py-3 rounded-lg font-semibold"
              >
                View Team Draft
              </Link>
            </div>
          </div>

          {/* Tournament Rules */}
          <div className="mt-8 glass-card rounded-lg p-6 depth-2">
            <h2 className="text-2xl font-bold text-white mb-6">Tournament Rules</h2>
            <div className="space-y-4 text-gray-300">
              <div className="border-l-4 border-white/40 pl-4">
                <h3 className="text-white font-semibold mb-2">General Rules</h3>
                <ul className="space-y-2 text-sm">
                  <li>• All players must be 13 years or older</li>
                  <li>• Players must have a stable internet connection</li>
                  <li>• No account sharing or smurfing allowed</li>
                  <li>• Respect all other players and tournament staff</li>
                  <li>• Decisions made by tournament organizers are final</li>
                </ul>
              </div>

              <div className="border-l-4 border-white/30 pl-4">
                <h3 className="text-white font-semibold mb-2">Tournament Format: Group Stage</h3>
                <ul className="space-y-2 text-sm">
                  <li>• 2 groups of 4 teams play in a round robin format</li>
                  <li>• Each match is 3 maps, each win is 1 point</li>
                  <li>• Map Order: Domination, Convoy, Convergence</li>
                  <li>• Top 3 teams from each group advance to the final stage</li>
                </ul>
              </div>

              <div className="border-l-4 border-white/30 pl-4">
                <h3 className="text-white font-semibold mb-2">Tournament Format: Final Stage</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Seed 1s from groups advance to the semifinal in a Best of 3 games</li>
                  <li>• Seed 2 and 3 would battle each other in single elimination games in Best of 3 games</li>
                  <li>• Seed 2 Group A vs. Seed 3 Group B and Seed 2 Group B vs. Seed 3 Group A</li>
                  <li>• Winners of seed 2 and 3 then battle Seed 1 in a Best of 3 games</li>
                  <li>• Seed 2 Group B vs. Seed 3 Group A winner takes on See 1 of Group A in a Best of 3 games</li>
                  <li>• Seed 2 Group A vs. Seed 3 Group B winner takes on See 1 of Group B in a Best of 3 games</li>
                </ul>
              </div>

              <div className="border-l-4 border-white/30 pl-4">
                <h3 className="text-white font-semibold mb-2">Tournament Format: Grand Finals</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Semifinal winners battle each other in a Best of 5 games for the grand finals</li>
                </ul>
              </div>

              <div className="border-l-4 border-white/25 pl-4">
                <h3 className="text-white font-semibold mb-2">Game Rules</h3>
                <ul className="space-y-2 text-sm">
                  <li>• No pick/bans system - players choose any hero freely</li>
                  <li>• All players can select their preferred heroes</li>
                  <li>• No hero restrictions or limitations</li>
                  <li>• <b><u>Wolverene is banned</u></b></li>
                  <li>• Map selection: Random or mutual agreement</li>
                  <li>• No intentional disconnections or game throwing</li>
                </ul>
              </div>
              <div className="border-l-4 border-white/20 pl-4">
                <h3 className="text-white font-semibold mb-2">Streaming & Content</h3>
                <ul className="space-y-2 text-sm">
                  <li>• All matches will be streamed on BasimZB&apos;s Twitch channel</li>
                  <li>• Players may stream their own perspective</li>
                  <li>• No stream sniping or using stream information</li>
                  <li>• Players must have voice chat enabled for coordination</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="mt-8 glass-card rounded-lg p-6 depth-2">
            <h2 className="text-2xl font-bold text-white mb-6">Tournament Schedule</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-black/20 rounded border border-white/10">
                <div className="text-white font-bold">July 18, 2025</div>
                <div className="text-white">Team Draft Day - Captains Select Players</div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-black/20 rounded border border-white/10">
                <div className="text-white font-bold">05:30 PM EST</div>
                <div className="text-white">July 26 - Team Check-in Begins</div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-black/20 rounded border border-white/10">
                <div className="text-white font-bold">6:00 PM EST</div>
                <div className="text-white">Tournament Begins - Group Stage</div>
              </div>
            </div>
          </div>

          {/* Watch Tournament */}
          <div className="mt-8 glass-card rounded-lg p-6 depth-2 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Watch the Tournament</h2>
            <p className="text-gray-300 mb-6">
              Tune in to BasimZB&apos;s Twitch channel to watch the ultimate Marvel Rivals tournament!
            </p>
            <a 
              href="https://www.twitch.tv/basimzb" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block glass-button text-white px-8 py-4 rounded-lg font-bold text-lg"
            >
              Watch on Twitch
            </a>
          </div>

          {/* Contact Info */}
          <div className="mt-8 glass-card rounded-lg p-6 depth-2">
            <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
            <div className="grid md:grid-cols-2 gap-6 text-gray-300">
              <div>
                <h3 className="text-white font-semibold mb-2">Tournament Host</h3>
                <p>BasimZB</p>
                <a 
                  href="https://www.twitch.tv/basimzb" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  twitch.tv/basimzb
                </a>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Strategist</h3>
                <p>For questions or issues:</p>
                <p className="text-white">tournament@marvelcreatorcup.com</p>
                <p className="text-sm text-gray-400">Response within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 