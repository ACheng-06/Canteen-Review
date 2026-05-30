import { create } from 'zustand'
import * as authApi from '../api/auth'

interface User {
  id: string
  email: string
  nickname: string
  avatar: string
  bio: string
  createdAt: string
}

interface AuthState {
  token: string | null
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, nickname: string) => Promise<void>
  logout: () => void
  fetchMe: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('canteen-auth-token'),
  user: null,
  isLoading: false,

  login: async (email, password) => {
    const { token, user } = await authApi.login(email, password)
    localStorage.setItem('canteen-auth-token', token)
    set({ token, user })
  },

  register: async (email, password, nickname) => {
    const { token, user } = await authApi.register(email, password, nickname)
    localStorage.setItem('canteen-auth-token', token)
    set({ token, user })
  },

  logout: () => {
    localStorage.removeItem('canteen-auth-token')
    set({ token: null, user: null })
  },

  fetchMe: async () => {
    set({ isLoading: true })
    try {
      const user = await authApi.getMe()
      set({ user, isLoading: false })
    } catch {
      localStorage.removeItem('canteen-auth-token')
      set({ token: null, user: null, isLoading: false })
    }
  },
}))
