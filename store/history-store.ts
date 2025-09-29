import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface HistoryItem {
  id: string;
  tool: string;
  input: any;
  output: any;
  timestamp: string;
  href: string;
}

interface HistoryState {
  history: HistoryItem[];
  addHistoryItem: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      history: [],
      addHistoryItem: (item) => {
        const newHistoryItem: HistoryItem = {
          ...item,
          id: new Date().toISOString() + Math.random(),
          timestamp: new Date().toISOString(),
        };
        set({ history: [newHistoryItem, ...get().history] });
      },
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'qtools-ai-global-history',
      storage: createJSONStorage(() => localStorage),
    }
  )
);