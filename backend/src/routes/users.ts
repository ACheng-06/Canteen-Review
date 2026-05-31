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

// PUT /api/users/me - 更新用户信息
router.put('/me', authMiddleware, async (req, res) => {
  const { nickname, avatar, bio } = req.body
  const userId = req.user!.userId

  // 验证字段
  if (nickname !== undefined && (!nickname || !nickname.trim())) {
    return res.status(400).json({ error: '昵称不能为空' })
  }
  if (nickname && nickname.length > 20) {
    return res.status(400).json({ error: '昵称不能超过20个字符' })
  }
  if (bio && bio.length > 100) {
    return res.status(400).json({ error: '简介不能超过100个字符' })
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(nickname !== undefined && { nickname: nickname.trim() }),
        ...(avatar !== undefined && { avatar }),
        ...(bio !== undefined && { bio }),
      },
      select: { id: true, email: true, nickname: true, avatar: true, bio: true },
    })

    res.json({ data: updatedUser })
  } catch (error) {
    console.error('Update user error:', error)
    res.status(500).json({ error: '更新失败' })
  }
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
