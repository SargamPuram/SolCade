import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Gift, Wallet, Trophy, Clock } from "lucide-react"

export default function RewardsHeader() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-green-400">
            Rewards Hub
          </h1>
          <p className="text-gray-400 mt-2">Earn rewards by playing games, staking, and completing daily tasks</p>
        </div>

        <Button className="mt-4 md:mt-0 bg-green-500 hover:bg-green-400 shadow-[0_0_10px_rgba(0,255,136,0.3)] hover:shadow-[0_0_15px_rgba(0,255,136,0.5)] transition-all duration-300">
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet to Claim
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-900/60 border-gray-800 hover:border-cyan-500/50 transition-all duration-300">
          <CardContent className="p-6 flex items-center">
            <div className="h-12 w-12 rounded-lg bg-cyan-500/20 flex items-center justify-center mr-4">
              <Trophy className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Available Rewards</div>
              <div className="text-2xl font-bold">24.5 SOL</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/60 border-gray-800 hover:border-green-500/50 transition-all duration-300">
          <CardContent className="p-6 flex items-center">
            <div className="h-12 w-12 rounded-lg bg-green-500/20 flex items-center justify-center mr-4">
              <Gift className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Claimed Rewards</div>
              <div className="text-2xl font-bold">12.8 SOL</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/60 border-gray-800 hover:border-pink-500/50 transition-all duration-300">
          <CardContent className="p-6 flex items-center">
            <div className="h-12 w-12 rounded-lg bg-pink-500/20 flex items-center justify-center mr-4">
              <Wallet className="h-6 w-6 text-pink-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Staked Amount</div>
              <div className="text-2xl font-bold">50 SOL</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/60 border-gray-800 hover:border-yellow-500/50 transition-all duration-300">
          <CardContent className="p-6 flex items-center">
            <div className="h-12 w-12 rounded-lg bg-yellow-500/20 flex items-center justify-center mr-4">
              <Clock className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Next Reward</div>
              <div className="text-2xl font-bold">2h 15m</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
