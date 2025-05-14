import { create } from "zustand";

interface GameStore {
  gameData: { [key: string]: { gameId: string; currentPotDetails: Object } };
  setGameData: (gameId: string, potDetails: Object) => void;
  setCurrentPotDetails: (gameId: string, potDetails: Object) => void;
}

interface UserStore {
  userId: string;
  setUserId: (userId: string) => void;
}

interface ScoreStore {
  score: number;
  setScore: (score: number) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  //TODO: change according to new data
  gameData: {
    flappy_bird: { gameId: "6822a17cc32d4c0783a20047", currentPotDetails: {} },
    pacman: { gameId: "TODO: Add gameId", currentPotDetails: {} },
  },

  setGameData: (gameId, potDetails) =>
    set((state) => ({
      gameData: {
        ...state.gameData,
        [gameId]: { gameId, currentPotDetails: potDetails },
      },
    })),

  setCurrentPotDetails: (gameId, potDetails) =>
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
  score: 0,
  setScore: (score) => set({ score }),
}));
