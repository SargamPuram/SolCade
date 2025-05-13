import RewardsHeader from "@/components/rewards/rewards-header"
import StakingRewards from "@/components/rewards/staking-rewards"
import GameRewards from "@/components/rewards/game-rewards"
import DailyRewards from "@/components/rewards/daily-rewards"
import NFTRewards from "@/components/rewards/nft-rewards"

export default function RewardsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 text-white pt-24">
      <div className="container mx-auto px-4 py-8">
        <RewardsHeader />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <StakingRewards />
          <GameRewards />
        </div>

        <div className="mt-8">
          <DailyRewards />
        </div>

        <div className="mt-8">
          <NFTRewards />
        </div>
      </div>
    </div>
  )
}
