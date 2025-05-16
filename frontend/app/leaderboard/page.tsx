'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { Trophy, Crown } from 'lucide-react';
import { ROOT_URL } from '@/lib/imports';
import { motion } from 'framer-motion';

const DEFAULT_PUBLIC_KEY = process.env.NEXT_PUBLIC_DEFAULT_PUBLIC_KEY || 'So1anaDefaultKey123456';

interface Player {
  rank: number;
  address: string;
  points: number;
  avatar?: string;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const gameId = 'flappy_bird'; 
  const potId = '6822a3a8558a262662d0883d'; 

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`${ROOT_URL}/leaderboard/${gameId}/${potId}`);
        const { leaderboard: data } = response.data;

        const top5 = data
          .slice(0, 5)
          .map((entry: any, index: number) => ({
            rank: index + 1,
            address: entry.userId?.publicKey || DEFAULT_PUBLIC_KEY,
            points: entry.score,
            avatar: '/placeholder.svg',
          }));

        while (top5.length < 5) {
          top5.push({
            rank: top5.length + 1,
            address: DEFAULT_PUBLIC_KEY,
            points: 0,
            avatar: '/placeholder.svg',
          });
        }

        setLeaderboard(top5);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <section className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-2xl bg-[#0a0a0a] border border-[#1e1e1e] rounded-2xl shadow-lg relative overflow-hidden"
      >
        {/* Background shimmer */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-black/30 to-[#3a86ff]/10 pointer-events-none animate-pulse" />

        <div className="relative z-10 p-6 border-b border-[#1e1e1e] flex items-center gap-2">
          <Trophy className="text-yellow-400 w-6 h-6" />
          <h1 className="text-xl font-bold text-green-400">Solana Arcade Leaderboard</h1>
        </div>

        <div className="relative z-10 divide-y divide-[#1e1e1e]">
          {leaderboard.map((player, index) => (
            <motion.div
              key={player.rank}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center p-4 hover:bg-green-900/10 transition-colors relative"
            >
              {/* Rank */}
              <div className="w-8 font-bold text-center text-xl">
                {player.rank === 1 && (
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="text-yellow-400"
                  >
                    <Crown className="inline w-6 h-6 mr-1" />
                  </motion.div>
                )}
                {player.rank === 2 && <span className="text-gray-400">#2</span>}
                {player.rank === 3 && <span className="text-amber-700">#3</span>}
                {player.rank > 3 && <span className="text-gray-500">#{player.rank}</span>}
              </div>

              {/* Avatar */}
              <div className="h-10 w-10 rounded-full overflow-hidden ml-4 border-2 border-[#3a86ff] shadow-sm">
                <img
                  src={player.avatar}
                  alt={`Player ${player.rank} avatar`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Address */}
              <div className="ml-4 font-mono text-[#3a86ff] truncate max-w-[120px] text-sm">
                {player.address.slice(0, 4)}...{player.address.slice(-4)}
              </div>

              {/* Points */}
              <div className="ml-auto font-bold">
                <span className="text-green-400">{player.points.toLocaleString()}</span>
                <span className="text-xs text-gray-400 ml-1">pts</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
