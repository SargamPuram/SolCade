"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, BarChart3, ArrowRight } from "lucide-react";
import FlappyBirdGame from "@/components/gameComponents/FlappyBirdGame";

import EntryFeeButton from "@/components/EntryFeeButton";
import ModeToggle from "@/components/reusables/ModeToggle";
import { ROOT_URL } from "@/lib/imports";
import LiveIndicator from "@/components/reusables/LiveIndicator";
import { useGameStore, useUserStore, useScoreStore } from "@/lib/store";
import { toast } from "sonner";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
//The flow
/*
For leaderboard
  1. Fetch the potId from the database
  2. Store the potId in the state

*/
interface GameStats {
  entryFee: number;
  gameDuration: string;
  bestScore: number;
  players: number;
  rank: number;
  gamesPlayed: number;
}

export default function FlappyBirdGameLayout() {
  const [mode, setMode] = useState<"Fun" | "Bet">("Bet");
  const { flappy_bird_score, setFlappyBirdScore } = useScoreStore();
  const [gameStats, setGameStats] = useState<GameStats>({
    entryFee: 0.01,
    gameDuration: "-",
    bestScore: 0,
    players: 0,
    rank: 0,
    gamesPlayed: 0,
  });
  const [isPayEnabled, setIsPayEnabled] = useState<boolean>(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { gameData, setGameData } = useGameStore();
  const { userId } = useUserStore();
  const [txhashStore, setTxhashStore] = useState();
  //Utility functions
  const fetchLeaderboard = async () => {
    setLoading(true);
    if (gameData.flappy_bird.currentPotDetails) {
      const response = await fetch(
        //@ts-ignore
        `${ROOT_URL}/leaderboard/${gameData.flappy_bird.gameId}/${gameData.flappy_bird.currentPotDetails._id}/user/${userId}`
      );
      const data = await response.json();
      const leaderboard = data.leaderboard.map((item: any, index: number) => ({
        rank: index + 1,
        name: `${item.userId.publicKey.slice(
          0,
          4
        )}...${item.userId.publicKey.slice(-4)}`,
        score: item.score,
        isYou: item.userId._id == userId,
      }));
      setLeaderboard(leaderboard);
      setGameStats({
        ...gameStats,
        bestScore: leaderboard.find((item: any) => item.isYou)?.score,
        players: data.uniquePlayers,
        rank: leaderboard.find((item: any) => item.isYou)?.rank,
        gamesPlayed: data.totalGamesPlayed,
      });
      setLoading(false);
    }
  };

  const checkUserPlayedGame = async () => {
    //for easy fetch, we will take gameId, potId, userId. Fetch all of them and find the most recent one.
    //Check if the user has played the game, by populating the txhash.

    if (gameData.flappy_bird.currentPotDetails) {
      const response = await fetch(
        //@ts-ignore
        `${ROOT_URL}/user/${userId}/isPlayed/${gameData.flappy_bird.gameId}/${gameData.flappy_bird.currentPotDetails._id}`
      );
      const data = await response.json();
      // console.log(data);
      //If played == false, then allow the user to play the game. else the button to pay will be unlocked.
      // 3 cases, if there is no record (new player, it should return null), if there is a record, but not played (should return false), if there is a record and played (should return true)
      if (data.latestGameplay === null) {
        setIsPayEnabled(true);
      } else {
        setIsPayEnabled(data.latestGameplay.txhash.isPlayed);
      }
      setTxhashStore(data.latestGameplay.txhash);
    }
  };

  //1. fetched pot details
  useEffect(() => {
    const fetchPotId = async () => {
      const response = await fetch(`${ROOT_URL}/pot/latest/flappy_bird`);
      const data = await response.json();
      console.log(data.pot);
      setGameData("flappy_bird", data.pot);
    };
    fetchPotId();
  }, []);

  //Leaderboard fetch
  useEffect(() => {
    if (userId) {
      fetchLeaderboard();
    }
  }, [gameData, userId]);

  //When its on bet, check if the user has played the game.
  useEffect(() => {
    if (mode === "Bet" && userId) {
      checkUserPlayedGame();
    }
  }, [mode, userId, gameData]);

  //Game over event listener
  useEffect(() => {
    function handleGameOver(e: any) {
      const finalScore = e.detail;
      // console.log("Game ended with score:", finalScore);
      // Use setState or Zustand here
      setFlappyBirdScore(finalScore);
    }

    document.addEventListener("gameOver", handleGameOver);
    return () => document.removeEventListener("gameOver", handleGameOver);
  }, []);

  //Update the score in the database
  useEffect(() => {
    //This update happens only when the user has played the game.
    if (flappy_bird_score > 0 && mode === "Bet") {
      const updateScore = async () => {
        const response = await fetch(`${ROOT_URL}/score/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gameId: gameData.flappy_bird.gameId,
            //@ts-ignore
            potId: gameData.flappy_bird.currentPotDetails._id,
            userId: userId,
            score: flappy_bird_score,
            txhash: txhashStore,
          }),
        });
        const data = await response.json();
        if (!data.success) {
          console.error("Failed to update score:", data);
        } else {
          setIsPayEnabled(true);
          fetchLeaderboard();
          toast.success(`Your score: ${flappy_bird_score}`);
        }
      };
      updateScore();
    } else if (flappy_bird_score >= 0 && mode === "Fun") {
      toast.success(`Your score: ${flappy_bird_score}`);
    }
  }, [flappy_bird_score]);

  return (
    <div className=" text-white">
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
              <span className="text-white font-bold text-xs">
                {/* @ts-ignore */}
                {gameData.flappy_bird.currentPotDetails.totalLamports /
                  LAMPORTS_PER_SOL}{" "}
                SOL
              </span>
              <span className="text-gray-400 ml-1 text-xs">Prize Pool</span>
            </div>

            <div className="bg-gray-900/60 backdrop-blur-sm px-2 py-1 rounded-md flex items-center">
              <Users className="h-3 w-3 text-cyan-400 mr-1" />
              <span className="text-white font-bold text-xs">
                {gameStats.players}
              </span>
              <span className="text-gray-400 ml-1 text-xs">Players</span>
            </div>
          </div>
        </div>
        <ModeToggle mode={mode} setMode={setMode} className="mx-auto mb-4" />
        {/* <LiveIndicator /> */}

        {/* New layout with empty left section */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left side (Game canvas placeholder) */}

          <div className="relative min-h-[50vh] w-full md:w-[70%]">
            {/* Game always rendered */}
            <FlappyBirdGame />

            {/* Overlay Mask */}

            {isPayEnabled && mode === "Bet" && (
              <div className="absolute inset-0 z-10 bg-black bg-opacity-70 backdrop-blur-lg flex items-center justify-center  text-cyan-400 text-sm pointer-events-auto">
                <p className="text-center border border-dashed border-cyan-500 rounded-lg p-4 bg-[#0e121b]">
                  Pay to play the next game...
                </p>
              </div>
            )}
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
                    <span className="text-xs font-bold">
                      {gameStats.gameDuration}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                      Your Best Score
                    </span>
                    <span className="text-xs font-bold text-cyan-400">
                      {gameStats.bestScore}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Your Rank</span>
                    <span className="text-xs font-bold text-amber-700">
                      #{gameStats.rank}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Games Played</span>
                    <span className="text-xs font-bold">
                      {gameStats.gamesPlayed}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-400">Pot ID</p>
                    <p className="text-xs font-bold">
                      {
                        (
                          gameData.flappy_bird.currentPotDetails as {
                            potNumber?: number;
                          }
                        )?.potNumber
                      }
                    </p>
                  </div>
                </div>

                {isPayEnabled ? (
                  <EntryFeeButton
                    gameId={gameData.flappy_bird.gameId}
                    potPublicKey={
                      //@ts-ignore
                      gameData.flappy_bird.currentPotDetails.potPublicKey
                    }
                    mode={mode}
                    checkUserPlayedGame={checkUserPlayedGame}
                  />
                ) : (
                  <div className="flex justify-center items-center bg-gray-900/60 border border-dashed border-cyan-500 rounded-lg p-2 mt-2">
                    <span className="text-xs text-gray-400">
                      Continue your game......
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="relative">
              <div
                className={`${
                  mode === "Fun" ? "blur-sm pointer-events-none" : ""
                }`}
              >
                {/* Leaderboard Card */}
                <Card className="bg-gray-900/60 border-gray-800 ">
                  <CardHeader className="border-b border-gray-800 py-2 px-3">
                    <CardTitle className="flex items-center text-sm">
                      <Trophy className="mr-1 h-3 w-3 text-yellow-400" />
                      Top Players
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {loading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <Card
                          key={index}
                          className="bg-gray-900/40 border-gray-800 animate-pulse"
                        >
                          <CardContent className="p-2 space-y-2">
                            <div className="h-4 bg-gray-700 rounded w-1/4" />
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="divide-y divide-gray-800">
                        {leaderboard.slice(0, 5).map((player) => (
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
                                <span className="text-gray-500">
                                  #{player.rank}
                                </span>
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
                    )}

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

              {mode === "Fun" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg z-50">
                  <p className="text-md text-white text-center px-2">
                    Leaderboard will be visible in the betting mode.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
