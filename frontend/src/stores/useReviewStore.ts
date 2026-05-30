// DEPRECATED: 数据已迁移到后端 API，此文件仅供参考
import { create } from 'zustand'
import type { Review } from '../types'
import { reviews as mockReviews } from '../mock'
import { getStorage, setStorage } from '../utils/storage'

const STORAGE_KEY = 'canteen-user-reviews'

interface ReviewState {
  allReviews: Review[]
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'likes'>) => void
  getDishReviews: (dishId: string) => Review[]
}

export const useReviewStore = create<ReviewState>((set, get) => {
  const userReviews = getStorage<Review[]>(STORAGE_KEY, [])
  const allReviews = [...mockReviews, ...userReviews]

  return {
    allReviews,

    addReview: (reviewData) => {
      const newReview: Review = {
        ...reviewData,
        id: `user-${Date.now()}`,
        createdAt: new Date().toISOString(),
        likes: 0,
      }
      const userReviews = getStorage<Review[]>(STORAGE_KEY, [])
      const updatedUserReviews = [newReview, ...userReviews]
      setStorage(STORAGE_KEY, updatedUserReviews)

      set({ allReviews: [...mockReviews, ...updatedUserReviews] })
    },

    getDishReviews: (dishId) => {
      return get().allReviews.filter((r) => r.dishId === dishId)
    },
  }
})
