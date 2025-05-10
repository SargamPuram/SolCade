"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Wallet, Zap, Clock, ArrowRight } from "lucide-react";

export default function SplitScreenLayout() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameScore, setGameScore] = useState(0);

  // Mock function to simulate starting a game
  const handleStartGame = () => {
    setIsPlaying(true);
    // In a real implementation, this would trigger the wallet adapter
    // and then start the game after payment confirmation

    // Simulate score increasing during gameplay
    const interval = setInterval(() => {
      setGameScore((prev) => prev + Math.floor(Math.random() * 10));
    }, 2000);

    // End game after 20 seconds for demo purposes
    setTimeout(() => {
      clearInterval(interval);
      setIsPlaying(false);
    }, 20000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-green-400">
          Cosmic Racer
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Canvas - Takes up 2/3 of the screen on desktop */}
          <div className="lg:col-span-2">
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden border-2 border-cyan-500/50 shadow-[0_0_20px_rgba(0,255,255,0.2)]">
              {/* Game Canvas */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                {isPlaying ? (
                  <div className="text-center">
                    <div className="text-6xl font-bold text-cyan-400 mb-4">
                      {gameScore}
                    </div>
                    <div className="text-xl text-gray-400">
                      Game in progress...
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <div className="text-5xl mb-4">🚀</div>
                    <h2 className="text-2xl font-bold mb-2">Ready to Race?</h2>
                    <p className="text-gray-400 mb-6">
                      Pay 0.1 SOL to start the game and compete for the top
                      spot!
                    </p>
                    <Button
                      onClick={handleStartGame}
                      className="bg-green-500 hover:bg-green-400 text-white px-8 py-6 h-auto rounded-full text-lg shadow-[0_0_15px_rgba(0,255,136,0.5)] hover:shadow-[0_0_25px_rgba(0,255,136,0.7)] transition-all duration-300"
                    >
                      <Wallet className="mr-2 h-5 w-5" />
                      Pay & Play (0.1 SOL)
                    </Button>
                  </div>
                )}
              </div>

              {/* Game UI Overlay - Only visible during gameplay */}
              {isPlaying && (
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                  <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                    <Clock className="h-4 w-4 text-cyan-400 mr-2" />
                    <span className="text-cyan-400 font-mono">00:20</span>
                  </div>
                  <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                    <Zap className="h-4 w-4 text-green-400 mr-2" />
                    <span className="text-green-400 font-mono">
                      {gameScore}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Game Info */}
            <div className="mt-4 grid grid-cols-3 gap-4">
              <Card className="bg-gray-900/60 border-gray-800">
                <CardContent className="p-4 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-cyan-500/20 flex items-center justify-center mr-3">
                    <Trophy className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Prize Pool</div>
                    <div className="font-bold">12.5 SOL</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/60 border-gray-800">
                <CardContent className="p-4 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                    <Wallet className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Entry Fee</div>
                    <div className="font-bold">0.1 SOL</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/60 border-gray-800">
                <CardContent className="p-4 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-pink-500/20 flex items-center justify-center mr-3">
                    <Clock className="h-5 w-5 text-pink-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Game Time</div>
                    <div className="font-bold">20 Seconds</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Leaderboard Section - Takes up 1/3 of the screen on desktop */}
          <div>
            <Card className="bg-gray-900/60 border-gray-800 h-full">
              <CardHeader className="border-b border-gray-800">
                <CardTitle className="flex items-center">
                  <Trophy className="mr-2 h-5 w-5 text-yellow-400" />
                  Live Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-800">
                  {[
                    {
                      rank: 1,
                      name: "CryptoKing",
                      address: "Hx7...3kF9",
                      score: 9840,
                      isYou: false,
                    },
                    {
                      rank: 2,
                      name: "SolWarrior",
                      address: "9Tz...j2Kp",
                      score: 8720,
                      isYou: false,
                    },
                    {
                      rank: 3,
                      name: "BlockNinja",
                      address: "Lm5...8sQr",
                      score: 7650,
                      isYou: true,
                    },
                    {
                      rank: 4,
                      name: "MetaRacer",
                      address: "Vb2...7pZx",
                      score: 6540,
                      isYou: false,
                    },
                    {
                      rank: 5,
                      name: "CoinHunter",
                      address: "Kj9...4tYn",
                      score: 5980,
                      isYou: false,
                    },
                    {
                      rank: 6,
                      name: "ChainMaster",
                      address: "Rt6...2mNp",
                      score: 4870,
                      isYou: false,
                    },
                    {
                      rank: 7,
                      name: "TokenWhiz",
                      address: "Zx3...9qWs",
                      score: 3760,
                      isYou: false,
                    },
                    {
                      rank: 8,
                      name: "ByteRunner",
                      address: "Fp1...5jRt",
                      score: 2650,
                      isYou: false,
                    },
                    {
                      rank: 9,
                      name: "HashDasher",
                      address: "Qm8...0vBn",
                      score: 1540,
                      isYou: false,
                    },
                    {
                      rank: 10,
                      name: "NodeJumper",
                      address: "Yw4...6zAx",
                      score: 980,
                      isYou: false,
                    },
                  ].map((player) => (
                    <div
                      key={player.rank}
                      className={`flex items-center p-4 ${
                        player.isYou
                          ? "bg-green-500/10"
                          : "hover:bg-gray-800/30"
                      } transition-colors`}
                    >
                      <div className="w-8 font-bold text-center">
                        {player.rank === 1 && (
                          <span className="text-yellow-400">#1</span>
                        )}
                        {player.rank === 2 && (
                          <span className="text-gray-400">#2</span>
                        )}
                        {player.rank === 3 && (
                          <span className="text-amber-700">#3</span>
                        )}
                        {player.rank > 3 && (
                          <span className="text-gray-500">#{player.rank}</span>
                        )}
                      </div>

                      <div className="ml-4 flex-1">
                        <div className="flex items-center">
                          <span className="font-bold">{player.name}</span>
                          {player.isYou && (
                            <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-400 font-mono">
                          {player.address}
                        </div>
                      </div>

                      <div className="font-bold font-mono text-cyan-400">
                        {player.score.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-gray-800">
                  <Button
                    variant="outline"
                    className="w-full border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                  >
                    View All Rankings
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
