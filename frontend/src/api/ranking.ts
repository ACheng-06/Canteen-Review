import client from './client'

export async function getRanking(
  category = 'popularity',
  period = 'today',
  limit = 30
) {
  const res = await client.get('/ranking', { params: { category, period, limit } })
  return res.data.data
}
