'use client';

import { create } from 'zustand';

interface CompareState {
  selectedRaces: string[];
  maxRaces: number;

  // Actions
  addRace: (raceId: string) => boolean;
  removeRace: (raceId: string) => void;
  toggleRace: (raceId: string) => boolean;
  isSelected: (raceId: string) => boolean;
  clearAll: () => void;
  canAddMore: () => boolean;
}

export const useCompareStore = create<CompareState>((set, get) => ({
  selectedRaces: [],
  maxRaces: 3,

  addRace: (raceId: string) => {
    if (get().selectedRaces.length >= get().maxRaces) {
      return false;
    }
    if (get().isSelected(raceId)) {
      return false;
    }
    set((state) => ({
      selectedRaces: [...state.selectedRaces, raceId],
    }));
    return true;
  },

  removeRace: (raceId: string) => {
    set((state) => ({
      selectedRaces: state.selectedRaces.filter((id) => id !== raceId),
    }));
  },

  toggleRace: (raceId: string) => {
    if (get().isSelected(raceId)) {
      get().removeRace(raceId);
      return true;
    }
    return get().addRace(raceId);
  },

  isSelected: (raceId: string) => {
    return get().selectedRaces.includes(raceId);
  },

  clearAll: () => {
    set({ selectedRaces: [] });
  },

  canAddMore: () => {
    return get().selectedRaces.length < get().maxRaces;
  },
}));
