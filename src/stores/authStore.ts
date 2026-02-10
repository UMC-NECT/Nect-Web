import { create } from 'zustand';
import { LOCAL_STORAGE_KEY } from '@/constants/key';

interface AuthState {
    isLoggedIn: boolean;
    login: (token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isLoggedIn: !!localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN),
    
    login: (token: string) => {
        localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, token);
        set({ isLoggedIn: true });
    },
    
    logout: () => {
        localStorage.removeItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
        set({ isLoggedIn: false });
    },
}));