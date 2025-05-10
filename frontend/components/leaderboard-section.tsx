import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Gift } from "lucide-react"

const leaderboardData = [
  { rank: 1, avatar: "/placeholder.svg?height=40&width=40", address: "Hx7...3kF9", points: 12450 },
  { rank: 2, avatar: "/placeholder.svg?height=40&width=40", address: "9Tz...j2Kp", points: 10280 },
  { rank: 3, avatar: "/placeholder.svg?height=40&width=40", address: "Lm5...8sQr", points: 9875 },
  { rank: 4, avatar: "/placeholder.svg?height=40&width=40", address: "Vb2...7pZx", points: 8640 },
  { rank: 5, avatar: "/placeholder.svg?height=40&width=40", address: "Kj9...4tYn", points: 7520 },
]

const rewards = [
  { id: 1, name: "Legendary Loot Box", points: 10000, image: "/placeholder.svg?height=80&width=80" },
  { id: 2, name: "Rare NFT Drop", points: 5000, image: "/placeholder.svg?height=80&width=80" },
  { id: 3, name: "Common Token Pack", points: 1000, image: "/placeholder.svg?height=80&width=80" },
]

export default function LeaderboardSection() {
  return (
    <section className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Leaderboard */}
      <Card className="bg-gray-900/40 backdrop-blur-md border-gray-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 to-green-900/10" />
        <CardHeader className="relative border-b border-gray-800">
          <CardTitle className="flex items-center text-xl">
            <Trophy className="mr-2 h-5 w-5 text-yellow-400" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 relative">
          <div className="divide-y divide-gray-800">
            {leaderboardData.map((player) => (
              <div key={player.rank} className="flex items-center p-4 hover:bg-gray-800/30 transition-colors">
                <div className="w-8 font-bold text-center">
                  {player.rank === 1 && <span className="text-yellow-400">#1</span>}
                  {player.rank === 2 && <span className="text-gray-400">#2</span>}
                  {player.rank === 3 && <span className="text-amber-700">#3</span>}
                  {player.rank > 3 && <span className="text-gray-500">#{player.rank}</span>}
                </div>

                <div className="h-10 w-10 rounded-full overflow-hidden ml-4">
                  <img
                    src={player.avatar || "/placeholder.svg"}
                    alt={`Player ${player.rank} avatar`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="ml-4 font-mono">{player.address}</div>

                <div className="ml-auto font-bold">
                  <span className="text-cyan-400">{player.points.toLocaleString()}</span>
                  <span className="text-xs text-gray-400 ml-1">pts</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rewards */}
      <Card className="bg-gray-900/40 backdrop-blur-md border-gray-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 to-green-900/10" />
        <CardHeader className="relative border-b border-gray-800">
          <CardTitle className="flex items-center text-xl">
            <Gift className="mr-2 h-5 w-5 text-pink-400" />
            Rewards
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 relative">
          <div className="grid grid-cols-1 gap-4">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className="flex items-center p-4 bg-gray-800/30 rounded-lg border border-gray-800 hover:border-green-500/50 transition-all group"
              >
                <div className="h-16 w-16 rounded-lg bg-gray-800 overflow-hidden flex items-center justify-center p-2 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <img
                    src={reward.image || "/placeholder.svg"}
                    alt={`${reward.name}`}
                    className="w-full h-full object-contain relative"
                  />
                </div>

                <div className="ml-4 flex-1">
                  <h3 className="font-bold">{reward.name}</h3>
                  <p className="text-sm text-gray-400">
                    <span className="text-pink-400">{reward.points.toLocaleString()}</span> points required
                  </p>
                </div>

                <Button className="bg-pink-500 hover:bg-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.3)] hover:shadow-[0_0_15px_rgba(236,72,153,0.5)] transition-all duration-300 border-0">
                  Claim
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
