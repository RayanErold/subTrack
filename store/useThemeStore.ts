import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';
import Colors from '../constants/Colors';

export type ThemeType = keyof typeof Colors.themes;

interface ThemeState {
    currentTheme: ThemeType;
    setTheme: (theme: ThemeType) => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            currentTheme: 'dark', // Default
            setTheme: (theme) => set({ currentTheme: theme }),
        }),
        {
            name: 'theme-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
