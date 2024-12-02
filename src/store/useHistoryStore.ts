import { create } from "zustand";
import type { Schema } from "@/types/schema";

interface HistoryState {
  past: Schema[];
  future: Schema[];
  present: Schema;
  push: (state: Schema) => void;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  past: [],
  future: [],
  present: { runnables: [] },

  push: (newState) => {
    set((state) => ({
      past: [...state.past, state.present],
      present: newState,
      future: [],
    }));
  },
}));
