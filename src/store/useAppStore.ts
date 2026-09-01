import { create } from 'zustand'
import { AppModule, ThemeMode, UserProfile } from '../types'

interface AppState {
  activeModule: AppModule
  setActiveModule: (module: AppModule) => void
  theme: ThemeMode
  toggleTheme: () => void
  setTheme: (theme: ThemeMode) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  currentUser: UserProfile
  setCurrentUser: (user: UserProfile) => void
}

const getInitialTheme = (): ThemeMode => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('pos_theme') as ThemeMode
    if (saved === 'dark' || saved === 'light') {
      if (saved === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      return saved
    }
  }
  return 'light'
}

export const useAppStore = create<AppState>((set, get) => ({
  activeModule: 'dashboard',
  setActiveModule: (module) => set({ activeModule: module }),
  
  theme: getInitialTheme(),
  toggleTheme: () => {
    const nextTheme = get().theme === 'dark' ? 'light' : 'dark'
    if (typeof window !== 'undefined') {
      localStorage.setItem('pos_theme', nextTheme)
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
    set({ theme: nextTheme })
  },
  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pos_theme', theme)
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
    set({ theme })
  },

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  currentUser: {
    id: 'u1',
    name: 'Savi Admin',
    role: 'admin',
  },
  setCurrentUser: (user) => set({ currentUser: user }),
}))
