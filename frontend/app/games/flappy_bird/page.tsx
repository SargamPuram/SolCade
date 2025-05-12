import FlappyBirdGameLayout from "@/app/games/flappy_bird/GameLayout";

export default function FlappyBird() {
  return (
    <div className="h-screen text-white">
      <section className="relative w-full min-h-[80vh] pt-20 overflow-hidden rounded-3xl flex justify-center items-center">
        <div className="container mx-auto px-4">
          <FlappyBirdGameLayout />
        </div>
      </section>
    </div>
  );
}
