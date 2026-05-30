import client from './client'

export async function getRanking(category = 'popularity', limit = 30) {
  const res = await client.get('/ranking', { params: { category, limit } })
  return res.data.data
}
