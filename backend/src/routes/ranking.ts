import { Router } from 'express'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const router = Router()
const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

// GET /api/ranking
router.get('/', async (req, res) => {
  const { category = 'popularity', limit = '30' } = req.query
  const limitNum = parseInt(limit as string, 10)

  const orderByMap: Record<string, any> = {
    popularity: { popularity: 'desc' },
    speed: { speedScore: 'desc' },
    value: { valueScore: 'desc' },
  }

  const orderBy = orderByMap[category as string] || orderByMap.popularity

  const dishes = await prisma.dish.findMany({
    orderBy,
    take: limitNum,
    include: {
      window: { select: { name: true } },
      canteen: { select: { name: true } },
    },
  })

  const data = dishes.map((d) => ({
    id: d.id,
    name: d.name,
    category: d.category,
    price: d.price,
    rating: d.rating,
    reviewCount: d.reviewCount,
    speedScore: d.speedScore,
    valueScore: d.valueScore,
    popularity: d.popularity,
    image: d.image,
    windowName: d.window.name,
    canteenName: d.canteen.name,
  }))

  res.json({ data })
})

export default router
