import GamesArena from "@/components/games-arena";
import DashboardLayout from "@/layouts/dashboard-layout";

export default function Games() {
  return (
    <div className="min-h-screen text-white max-h-screen">
      <section className="relative w-full min-h-[80vh] pt-20 overflow-hidden rounded-3xl flex justify-center items-center">
        <div className="container mx-auto px-4">
          <GamesArena />
        </div>
      </section>
    </div>
  );
}

//DashboardLayout is nice
