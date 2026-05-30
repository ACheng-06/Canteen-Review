import client from './client'

export async function getCanteens() {
  const res = await client.get('/canteens')
  return res.data.data
}

export async function getCanteenById(id: string) {
  const res = await client.get(`/canteens/${id}`)
  return res.data.data
}
