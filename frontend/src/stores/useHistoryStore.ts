import { create } from 'zustand'
import { getStorage, setStorage } from '../utils/storage'

const STORAGE_KEY = 'canteen-browse-history'
const MAX_HISTORY = 50

interface HistoryState {
  historyDishIds: string[]
  addHistory: (dishId: string) => void
}

export const useHistoryStore = create<HistoryState>((set, get) => {
  const saved = getStorage<string[]>(STORAGE_KEY, [])

  return {
    historyDishIds: saved,

    addHistory: (dishId) => {
      const current = get().historyDishIds
      const filtered = current.filter((id) => id !== dishId)
      const next = [dishId, ...filtered].slice(0, MAX_HISTORY)
      setStorage(STORAGE_KEY, next)
      set({ historyDishIds: next })
    },
  }
})
