import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GamepadIcon, Trophy, ArrowRight } from "lucide-react"

export default function GameRewards() {
  return (
    <Card className="bg-gray-900/60 border-gray-800 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 to-cyan-900/10" />
      <CardHeader className="relative border-b border-gray-800">
        <CardTitle className="flex items-center text-xl">
          <GamepadIcon className="mr-2 h-5 w-5 text-green-400" />
          Game Rewards
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 relative">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">Weekly Tournament</h3>
              <p className="text-gray-400 text-sm">Top 10 players share the prize pool</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">12.5 SOL</div>
              <div className="text-sm text-gray-400">Prize Pool</div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[
              { rank: "1st Place", reward: "5 SOL", status: "Unclaimed", game: "Cosmic Racer" },
              { rank: "3rd Place", reward: "1.5 SOL", status: "Claimed", game: "Solana Kart" },
              { rank: "5th Place", reward: "0.5 SOL", status: "Unclaimed", game: "DeFi Land" },
            ].map((reward, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700"
              >
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                    <Trophy className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <div className="font-bold">{reward.rank}</div>
                    <div className="text-sm text-gray-400">{reward.game}</div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="font-bold text-green-400">{reward.reward}</div>
                  <div className="text-xs text-gray-400">{reward.status}</div>
                </div>

                <Button
                  variant={reward.status === "Claimed" ? "ghost" : "outline"}
                  className={
                    reward.status === "Claimed"
                      ? "text-gray-500 cursor-not-allowed"
                      : "border-green-500/50 text-green-400 hover:bg-green-500/10"
                  }
                  disabled={reward.status === "Claimed"}
                >
                  {reward.status === "Claimed" ? "Claimed" : "Claim"}
                </Button>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full border-green-500/50 text-green-400 hover:bg-green-500/10">
            View All Game Rewards
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
