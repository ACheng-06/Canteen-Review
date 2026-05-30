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
    include: { _count: { select: { windows: true } } },
  })

  const data = canteens.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    floors: c.floors,
    status: c.status,
    tags: c.tags,
    location: c.location,
    cover: c.cover,
    rating: c.rating,
    windowCount: c._count.windows,
  }))

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
