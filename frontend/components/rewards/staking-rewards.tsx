import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, LockIcon } from "lucide-react"

export default function StakingRewards() {
  return (
    <Card className="bg-gray-900/60 border-gray-800 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 to-green-900/10" />
      <CardHeader className="relative border-b border-gray-800">
        <CardTitle className="flex items-center text-xl">
          <Wallet className="mr-2 h-5 w-5 text-cyan-400" />
          Staking Rewards
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 relative">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">Current Stake</h3>
              <p className="text-gray-400 text-sm">Earn 12% APY on your staked SOL</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">50 SOL</div>
              <div className="text-sm text-green-400">+0.016 SOL daily</div>
            </div>
          </div>

          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-green-500 w-[65%]"></div>
          </div>

          <div className="flex justify-between text-sm text-gray-400">
            <div>Staking Period: 65% complete</div>
            <div>26 days remaining</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {[
              { period: "30 Days", apy: "8% APY", amount: "10 SOL min" },
              { period: "60 Days", apy: "12% APY", amount: "25 SOL min" },
              { period: "90 Days", apy: "16% APY", amount: "50 SOL min" },
            ].map((tier, index) => (
              <Card
                key={index}
                className="bg-gray-800/50 border-gray-700 hover:border-cyan-500/50 transition-all duration-300"
              >
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="font-bold mb-1">{tier.period}</div>
                    <div className="text-xl text-cyan-400 font-bold mb-1">{tier.apy}</div>
                    <div className="text-sm text-gray-400">{tier.amount}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="flex-1 bg-cyan-500 hover:bg-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.3)] hover:shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-all duration-300">
              <Wallet className="mr-2 h-4 w-4" />
              Stake More
            </Button>
            <Button variant="outline" className="flex-1 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
              <LockIcon className="mr-2 h-4 w-4" />
              Unstake (Locked for 26 days)
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
