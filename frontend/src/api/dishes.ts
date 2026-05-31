import client from './client'

export async function getDishes(params?: { category?: string; search?: string; page?: number; limit?: number }) {
  const res = await client.get('/dishes', { params })
  return res.data
}

export async function getDishById(id: string) {
  const res = await client.get(`/dishes/${id}`)
  return res.data.data
}

export async function getDishReviews(dishId: string, page = 1, limit = 10) {
  const res = await client.get(`/dishes/${dishId}/reviews`, { params: { page, limit } })
  return res.data
}

export async function submitReview(
  dishId: string,
  rating: number,
  speedRating: number,
  valueRating: number,
  content: string
) {
  const res = await client.post(`/dishes/${dishId}/reviews`, {
    rating,
    speedRating,
    valueRating,
    content,
  })
  return res.data.data
}
