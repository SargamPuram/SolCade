"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, GamepadIcon } from "lucide-react";
import { ROOT_URL } from "@/lib/imports";
import { useRouter } from "next/navigation";
interface Game {
  id: number;
  name: string;
  gameId: string;
  description: string;
  entryFee: number;
  logo: string;
  genre: string;
}

export default function GamesArena() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      const response = await fetch(`${ROOT_URL}/games/all`);
      const data = await response.json();
      setGames(data);
      setLoading(false);
    };
    fetchGames();
  }, []);

  const filteredGames = games.filter((game) => {
    return (
      game.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedGenre === "" ||
        selectedGenre === "all" ||
        game.genre === selectedGenre)
    );
  });

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-green-400">
          Games Arena
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search games..."
            className="pl-10 bg-gray-900/40 border-gray-800 focus-visible:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedGenre} onValueChange={setSelectedGenre}>
          <SelectTrigger className="w-full md:w-[180px] bg-gray-900/40 border-gray-800 focus:ring-green-500">
            <SelectValue placeholder="Filter by Genre" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-800">
            <SelectItem value="all">All Genres</SelectItem>
            <SelectItem value="RPG">RPG</SelectItem>
            <SelectItem value="Adventure">Adventure</SelectItem>
            <SelectItem value="Simulation">Simulation</SelectItem>
            <SelectItem value="Casino">Casino</SelectItem>
            <SelectItem value="Racing">Racing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <Card
                key={idx}
                className="bg-gray-900/40 border-gray-800 animate-pulse h-52"
              >
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-700 rounded w-1/2 mb-4" />
                  <div className="h-3 bg-gray-700 rounded w-full mb-2" />
                  <div className="h-3 bg-gray-700 rounded w-5/6 mb-4" />
                  <div className="h-8 bg-gray-700 rounded w-full" />
                </CardContent>
              </Card>
            ))
          : filteredGames.map((game, index) => (
              <Card
                key={index}
                className="bg-gray-900/40 backdrop-blur-md border-gray-800 hover:border-green-500/50 transition-all duration-300 group overflow-hidden"
              >
                <CardContent className="p-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 to-green-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="flex items-start gap-4 relative">
                    <div className="h-20 w-20 rounded-lg bg-gray-800 overflow-hidden flex items-center justify-center p-2">
                      <img
                        src={game.logo || "/placeholder.svg"}
                        alt={`${game.name} logo`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg">{game.name}</h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300">
                          {game.genre}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                        {game.description}
                      </p>
                      <Button
                        onClick={() => {
                          router.push(`/games/${game.gameId}`);
                        }}
                        className="mt-4 w-full bg-cyan-500 hover:bg-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.3)] hover:shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-all duration-300 border-0"
                      >
                        <GamepadIcon className="mr-2 h-4 w-4" />
                        Play Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
    </section>
  );
}
