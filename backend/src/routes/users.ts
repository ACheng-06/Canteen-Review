import { Router } from 'express'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { authMiddleware } from '../middleware/auth'

const router = Router()
const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

// GET /api/users/me
router.get('/me', authMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: { id: true, email: true, nickname: true, avatar: true, bio: true, createdAt: true },
  })

  if (!user) {
    return res.status(404).json({ error: '用户不存在' })
  }

  res.json({ data: user })
})

// GET /api/users/me/reviews
router.get('/me/reviews', authMiddleware, async (req, res) => {
  const reviews = await prisma.review.findMany({
    where: { userId: req.user!.userId },
    include: {
      dish: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const data = reviews.map((r: any) => ({
    id: r.id,
    dishId: r.dishId,
    dishName: r.dish.name,
    rating: r.rating,
    content: r.content,
    likes: r.likes,
    createdAt: r.createdAt,
  }))

  res.json({ data })
})

export default router
