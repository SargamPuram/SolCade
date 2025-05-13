import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, CheckCircle, Clock } from "lucide-react"

export default function DailyRewards() {
  return (
    <Card className="bg-gray-900/60 border-gray-800 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-900/10 to-purple-900/10" />
      <CardHeader className="relative border-b border-gray-800">
        <CardTitle className="flex items-center text-xl">
          <Calendar className="mr-2 h-5 w-5 text-pink-400" />
          Daily Rewards
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 relative">
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-2">Daily Check-in Streak</h3>
          <p className="text-gray-400 text-sm">Log in daily to earn rewards. Current streak: 4 days</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {[
            { day: "Day 1", reward: "0.01 SOL", claimed: true },
            { day: "Day 2", reward: "0.02 SOL", claimed: true },
            { day: "Day 3", reward: "0.05 SOL", claimed: true },
            { day: "Day 4", reward: "0.1 SOL", claimed: true },
            { day: "Day 5", reward: "0.2 SOL", claimed: false, current: true },
            { day: "Day 6", reward: "0.5 SOL", claimed: false },
            { day: "Day 7", reward: "1 SOL", claimed: false },
          ].map((day, index) => (
            <Card
              key={index}
              className={`bg-gray-800/50 border-gray-700 ${
                day.current
                  ? "border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.2)]"
                  : day.claimed
                    ? "opacity-80"
                    : "opacity-60"
              } hover:opacity-100 transition-all duration-300`}
            >
              <CardContent className="p-4 text-center">
                <div className="font-bold mb-2">{day.day}</div>
                <div className="text-lg text-pink-400 font-bold mb-2">{day.reward}</div>
                <div className="flex justify-center">
                  {day.claimed ? (
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  ) : day.current ? (
                    <Button
                      size="sm"
                      className="bg-pink-500 hover:bg-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.3)] hover:shadow-[0_0_15px_rgba(236,72,153,0.5)] transition-all duration-300 w-full"
                    >
                      Claim
                    </Button>
                  ) : (
                    <Clock className="h-6 w-6 text-gray-500" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-pink-500/20 flex items-center justify-center mr-3">
                  <CheckCircle className="h-5 w-5 text-pink-400" />
                </div>
                <div>
                  <div className="font-bold">Daily Mission</div>
                  <div className="text-sm text-gray-400">Play 3 games today</div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-pink-400">0.1 SOL</div>
                <div className="text-xs text-gray-400">2/3 completed</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-pink-500/20 flex items-center justify-center mr-3">
                  <CheckCircle className="h-5 w-5 text-pink-400" />
                </div>
                <div>
                  <div className="font-bold">Daily Mission</div>
                  <div className="text-sm text-gray-400">Reach top 10 in any game</div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-pink-400">0.25 SOL</div>
                <div className="text-xs text-green-400">Completed!</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
