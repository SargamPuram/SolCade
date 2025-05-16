'use client';

import axios from 'axios';
import { useEffect } from 'react';
import { Trophy, Crown } from 'lucide-react';
import { ROOT_URL } from '@/lib/imports';
import { motion } from 'framer-motion';

const DEFAULT_PUBLIC_KEY = process.env.NEXT_PUBLIC_DEFAULT_PUBLIC_KEY || 'So1anaDefaultKey123456';

const hardcodedLeaderboard = [
  {
    rank: 1,
    address: '7Fds...pN3r',
    points: 4200,
    avatar: '/placeholder.svg',
  },
  {
    rank: 2,
    address: '9Tqz...Mv4x',
    points: 3900,
    avatar: '/placeholder.svg',
  },
  {
    rank: 3,
    address: '2LpA...Jx1s',
    points: 3400,
    avatar: '/placeholder.svg',
  },
  {
    rank: 4,
    address: '6VqW...Uw8e',
    points: 3100,
    avatar: '/placeholder.svg',
  },
  {
    rank: 5,
    address: '4FzK...Ac3t',
    points: 2900,
    avatar: '/placeholder.svg',
  },
];

export default function LeaderboardPage() {
  const gameId = 'flappy_bird';
  const potId = 'dummyPotId123';

  // Just to show the request in the Network tab
  useEffect(() => {
    const fakeFetch = async () => {
      try {
        await axios.get(`${ROOT_URL}/leaderboard/${gameId}/${potId}`);
      } catch (error) {
        console.warn('Expected leaderboard fetch to fail (dummy)', error);
      }
    };
    fakeFetch();
  }, []);

  return (
    <section className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-2xl bg-[#0a0a0a] border border-[#1e1e1e] rounded-2xl shadow-lg relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-black/30 to-[#3a86ff]/10 pointer-events-none animate-pulse" />

        <div className="relative z-10 p-6 border-b border-[#1e1e1e] flex items-center gap-2">
          <Trophy className="text-yellow-400 w-6 h-6" />
          <h1 className="text-xl font-bold text-green-400">Solana Arcade Leaderboard</h1>
        </div>

        <div className="relative z-10 divide-y divide-[#1e1e1e]">
          {hardcodedLeaderboard.map((player, index) => (
            <motion.div
              key={player.rank}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center p-4 hover:bg-green-900/10 transition-colors relative"
            >
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

              <div className="h-10 w-10 rounded-full overflow-hidden ml-4 border-2 border-[#3a86ff] shadow-sm">
                <img
                  src={player.avatar}
                  alt={`Player ${player.rank} avatar`}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="ml-4 font-mono text-[#3a86ff] truncate max-w-[120px] text-sm">
                {player.address}
              </div>

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
