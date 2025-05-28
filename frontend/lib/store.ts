import { create } from "zustand";

interface GameStore {
  gameData: { [key: string]: { gameId: string; currentPotDetails: Object } };
  setGameData: (gameId: string, potDetails: Object) => void;
}

interface UserStore {
  userId: string;
  setUserId: (userId: string) => void;
}

interface ScoreStore {
  flappy_bird_score: number;
  pacman_score: number;
  setFlappyBirdScore: (score: number) => void;
  setPacmanScore: (score: number) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  // gameData: {
  //   flappy_bird: { gameId: "6822a17cc32d4c0783a20047", currentPotDetails: {} },
  //   pacman: { gameId: "682a469a89ba63c2685e4f6c", currentPotDetails: {} },
  // },
  //test data
  gameData: {
    flappy_bird: { gameId: "68210f89681811dd521231f4", currentPotDetails: {} },
    pacman: { gameId: "6821cb510d3f7c6aef6e0a17", currentPotDetails: {} },
  },

  setGameData: (gameId, potDetails) =>
    set((state) => ({
      gameData: {
        ...state.gameData,
        [gameId]: {
          ...state.gameData[gameId],
          currentPotDetails: potDetails,
        },
      },
    })),
}));

export const useUserStore = create<UserStore>((set) => ({
  userId: "",
  setUserId: (userId) => set({ userId }),
}));

export const useScoreStore = create<ScoreStore>((set) => ({
  flappy_bird_score: 0,
  pacman_score: 0,
  setFlappyBirdScore: (score) => set({ flappy_bird_score: score }),
  setPacmanScore: (score) => set({ pacman_score: score }),
}));
