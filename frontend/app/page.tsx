import HeroSection from "@/components/hero-section";
import WalletSection from "@/components/wallet-section";
import GamesArena from "@/components/games-arena";
import LeaderboardSection from "@/components/leaderboard-section";
import ToolsSection from "@/components/tools-section";
import Header from "@/components/Header";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 text-white max-h-screen">
      <div className="container mx-auto px-4">
        <Header />
        <div className="w-full max-w-[120rem] mx-auto mt-20">
          <HeroSection />
        </div>
        {/* <WalletSection />
        <GamesArena />
        <LeaderboardSection />
        <ToolsSection /> */}
      </div>
    </div>
  );
}
