import { create } from 'zustand'
import { getStorage, setStorage } from '../utils/storage'

const STORAGE_KEY = 'canteen-favorites'

interface FavoriteState {
  favoriteDishIds: string[]
  toggleFavorite: (dishId: string) => void
  isFavorite: (dishId: string) => boolean
}

export const useFavoriteStore = create<FavoriteState>((set, get) => {
  const saved = getStorage<string[]>(STORAGE_KEY, [])

  return {
    favoriteDishIds: saved,

    toggleFavorite: (dishId) => {
      const current = get().favoriteDishIds
      const next = current.includes(dishId)
        ? current.filter((id) => id !== dishId)
        : [...current, dishId]
      setStorage(STORAGE_KEY, next)
      set({ favoriteDishIds: next })
    },

    isFavorite: (dishId) => {
      return get().favoriteDishIds.includes(dishId)
    },
  }
})
