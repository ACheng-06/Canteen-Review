import client from './client'

export async function register(email: string, password: string, nickname: string) {
  const res = await client.post('/auth/register', { email, password, nickname })
  return res.data.data
}

export async function login(email: string, password: string) {
  const res = await client.post('/auth/login', { email, password })
  return res.data.data
}

export async function getMe() {
  const res = await client.get('/users/me')
  return res.data.data
}

export async function getMyReviews() {
  const res = await client.get('/users/me/reviews')
  return res.data.data
}
