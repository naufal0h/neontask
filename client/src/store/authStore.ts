import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  handle: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('neontask_token'),
  isAuthenticated: !!localStorage.getItem('neontask_token'),
  setAuth: (user, token) => {
    localStorage.setItem('neontask_token', token);
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('neontask_token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));