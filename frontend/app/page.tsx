import HeroSection from "@/components/hero-section"
import WalletSection from "@/components/wallet-section"
import GamesArena from "@/components/games-arena"
import LeaderboardSection from "@/components/leaderboard-section"
import ToolsSection from "@/components/tools-section"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <HeroSection />
        <WalletSection />
        <GamesArena />
        <LeaderboardSection />
        <ToolsSection />
      </div>
    </div>
  )
}
