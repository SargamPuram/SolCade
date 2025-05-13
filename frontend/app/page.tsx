import HeroSection from "@/components/hero-section";
import WalletSection from "@/components/wallet-section";
import GamesArena from "@/components/games-arena";
import LeaderboardSection from "@/components/leaderboard-section";
import ToolsSection from "@/components/tools-section";
import Header from "@/components/Header";

export default function Dashboard() {
  return (
    <div className=" text-white">
      <div className="container mx-auto px-4">
        <div className="w-full h-[80vh]  max-w-[120rem] mx-auto mt-24">
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