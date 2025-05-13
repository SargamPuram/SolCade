"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Wallet, Users, BarChart3, ArrowRight } from "lucide-react";
import FlappyBirdGame from "@/components/gameComponents/FlappyBirdGame";

import EntryFeeButton from "@/components/EntryFeeButton";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-2 py-2">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-green-400">
              Flappy Bird
            </h1>
            <p className="text-gray-400 text-xs">
              Flappy Bird is a game where you control a bird that flies through
              pipes.
            </p>
          </div>

          <div className="mt-2 md:mt-0 flex items-center space-x-2">
            <div className="bg-gray-900/60 backdrop-blur-sm px-2 py-1 rounded-md flex items-center">
              <Trophy className="h-3 w-3 text-yellow-400 mr-1" />
              <span className="text-white font-bold text-xs">12.5 SOL</span>
              <span className="text-gray-400 ml-1 text-xs">Prize</span>
            </div>

            <div className="bg-gray-900/60 backdrop-blur-sm px-2 py-1 rounded-md flex items-center">
              <Users className="h-3 w-3 text-cyan-400 mr-1" />
              <span className="text-white font-bold text-xs">128</span>
              <span className="text-gray-400 ml-1 text-xs">Players</span>
            </div>
          </div>
        </div>

        {/* New layout with empty left section */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left side (Game canvas placeholder) */}
          <div className="min-h-[50vh] w-full md:w-[70%] bg-gray-900/30 border border-dashed border-cyan-500 rounded-lg flex items-center justify-center text-cyan-400 text-sm">
            <FlappyBirdGame />
          </div>

          {/* Right side - Dashboard content */}
          <div className="w-full md:w-[30%] grid grid-cols-1 gap-3 max-w-[30vw]">
            {/* Game Info Card */}
            <Card className="bg-gray-900/60 border-gray-800">
              <CardHeader className="border-b border-gray-800 py-2 px-3">
                <CardTitle className="flex items-center text-xs">
                  <BarChart3 className="mr-1 h-3 w-3 text-cyan-400" />
                  Game Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Entry Fee</span>
                    <span className="text-xs font-bold">0.01 SOL</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Game Duration</span>
                    <span className="text-xs font-bold">-</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                      Your Best Score
                    </span>
                    <span className="text-xs font-bold text-cyan-400">
                      7,650
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Your Rank</span>
                    <span className="text-xs font-bold text-amber-700">#3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Games Played</span>
                    <span className="text-xs font-bold">12</span>
                  </div>
                </div>

                {/* <EntryFeeButton /> */}

              </CardContent>
            </Card>

            {/* Leaderboard Card */}
            <Card className="bg-gray-900/60 border-gray-800 w-32">
              <CardHeader className="border-b border-gray-800 py-2 px-3">
                <CardTitle className="flex items-center text-xs">
                  <Trophy className="mr-1 h-3 w-3 text-yellow-400" />
                  Top Players
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-800">
                  {[
                    { rank: 1, name: "CryptoKing", score: 9840, isYou: false },
                    { rank: 2, name: "SolWarrior", score: 8720, isYou: false },
                    { rank: 3, name: "BlockNinja", score: 7650, isYou: true },
                    { rank: 4, name: "MetaRacer", score: 6540, isYou: false },
                    { rank: 5, name: "CoinHunter", score: 5980, isYou: false },
                  ].map((player) => (
                    <div
                      key={player.rank}
                      className={`flex items-center p-2 ${
                        player.isYou
                          ? "bg-green-500/10"
                          : "hover:bg-gray-800/30"
                      } transition-colors`}
                    >
                      <div className="w-4 font-bold text-center text-xs">
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

                      <div className="ml-2 flex-1">
                        <div className="flex items-center">
                          <span className="font-bold text-xs">
                            {player.name}
                          </span>
                          {player.isYou && (
                            <span className="ml-1 text-xs bg-green-500/20 text-green-400 px-1 py-0 rounded-full">
                              You
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="font-bold font-mono text-cyan-400 text-xs">
                        {player.score.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2 border-t border-gray-800">
                  <Button
                    variant="ghost"
                    className="w-full h-6 text-cyan-400 hover:bg-cyan-500/10 text-xs"
                  >
                    View Full Leaderboard
                    <ArrowRight className="ml-1 h-3 w-3" />
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
