import { create } from 'zustand';

import type { PlayStyle, Surface } from '@/types/api';

type UiState = {
  selectedStyleFilter: PlayStyle | 'ALL';
  selectedSurfaceFilter: Surface | 'ALL';
  setStyleFilter: (style: PlayStyle | 'ALL') => void;
  setSurfaceFilter: (surface: Surface | 'ALL') => void;
};

export const useUiStore = create<UiState>((set) => ({
  selectedStyleFilter: 'ALL',
  selectedSurfaceFilter: 'ALL',
  setStyleFilter: (style) => set({ selectedStyleFilter: style }),
  setSurfaceFilter: (surface) => set({ selectedSurfaceFilter: surface }),
}));
