'use client';

import { create } from 'zustand';

interface AuthUIState {
  isLoginModalOpen: boolean;
  redirectAfterLogin: string | null;

  openLoginModal: (redirect?: string) => void;
  closeLoginModal: () => void;
}

export const useAuthStore = create<AuthUIState>((set) => ({
  isLoginModalOpen: false,
  redirectAfterLogin: null,

  openLoginModal: (redirect) => {
    set({ isLoginModalOpen: true, redirectAfterLogin: redirect || null });
  },

  closeLoginModal: () => {
    set({ isLoginModalOpen: false, redirectAfterLogin: null });
  },
}));
