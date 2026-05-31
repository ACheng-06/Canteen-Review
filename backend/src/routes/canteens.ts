import { Router } from 'express'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const router = Router()
const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

// GET /api/canteens
router.get('/', async (_req, res) => {
  const canteens = await prisma.canteen.findMany({
    include: {
      _count: { select: { windows: true } },
      dishes: { select: { rating: true } },
    },
  })

  const data = canteens.map((c) => {
    // 动态计算食堂评分：该食堂所有菜品的平均评分
    const dishesWithRating = c.dishes.filter((d) => d.rating > 0)
    const avgRating = dishesWithRating.length > 0
      ? dishesWithRating.reduce((sum, d) => sum + d.rating, 0) / dishesWithRating.length
      : 0

    return {
      id: c.id,
      name: c.name,
      description: c.description,
      floors: c.floors,
      status: c.status,
      tags: c.tags,
      location: c.location,
      cover: c.cover,
      rating: Math.round(avgRating * 10) / 10, // 保留一位小数
      windowCount: c._count.windows,
    }
  })

  res.json({ data })
})

// GET /api/canteens/:id
router.get('/:id', async (req, res) => {
  const canteen = await prisma.canteen.findUnique({
    where: { id: req.params.id },
    include: { windows: { include: { dishes: true } } },
  })

  if (!canteen) {
    return res.status(404).json({ error: '食堂不存在' })
  }

  res.json({ data: canteen })
})

export default router
