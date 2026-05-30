import { Router } from 'express'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { authMiddleware } from '../middleware/auth'

const router = Router()
const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

// GET /api/dishes（列表，支持 category/search/page/limit）
router.get('/', async (req, res) => {
  const { category, search, page = '1', limit = '20' } = req.query
  const pageNum = parseInt(page as string, 10)
  const limitNum = parseInt(limit as string, 10)
  const skip = (pageNum - 1) * limitNum

  const where: any = {}
  if (category && category !== 'all') {
    where.category = category
  }
  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { tags: { has: search as string } },
    ]
  }

  const [dishes, total] = await Promise.all([
    prisma.dish.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { popularity: 'desc' },
      include: {
        window: { select: { name: true } },
        canteen: { select: { name: true } },
      },
    }),
    prisma.dish.count({ where }),
  ])

  const data = dishes.map((d) => ({
    id: d.id,
    name: d.name,
    category: d.category,
    price: d.price,
    description: d.description,
    image: d.image,
    rating: d.rating,
    reviewCount: d.reviewCount,
    speedScore: d.speedScore,
    valueScore: d.valueScore,
    popularity: d.popularity,
    tags: d.tags,
    windowId: d.windowId,
    windowName: d.window.name,
    canteenId: d.canteenId,
    canteenName: d.canteen.name,
  }))

  res.json({ data, total, page: pageNum, limit: limitNum })
})

// GET /api/dishes/:id
router.get('/:id', async (req, res) => {
  const dish = await prisma.dish.findUnique({
    where: { id: req.params.id },
    include: {
      window: { select: { name: true } },
      canteen: { select: { name: true } },
    },
  })

  if (!dish) {
    return res.status(404).json({ error: '菜品不存在' })
  }

  res.json({
    data: {
      ...dish,
      windowName: dish.window.name,
      canteenName: dish.canteen.name,
    },
  })
})

// GET /api/dishes/:id/reviews
router.get('/:id/reviews', async (req, res) => {
  const { page = '1', limit = '10' } = req.query
  const pageNum = parseInt(page as string, 10)
  const limitNum = parseInt(limit as string, 10)
  const skip = (pageNum - 1) * limitNum

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { dishId: req.params.id },
      skip,
      take: limitNum,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { nickname: true, avatar: true } } },
    }),
    prisma.review.count({ where: { dishId: req.params.id } }),
  ])

  const data = reviews.map((r) => ({
    id: r.id,
    rating: r.rating,
    content: r.content,
    likes: r.likes,
    createdAt: r.createdAt,
    userId: r.userId,
    userName: r.user.nickname,
    userAvatar: r.user.avatar,
  }))

  res.json({ data, total, page: pageNum, limit: limitNum })
})

// POST /api/dishes/:id/reviews（需登录）
router.post('/:id/reviews', authMiddleware, async (req, res) => {
  const dishId = String(req.params.id)
  const { rating, content } = req.body

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: '评分必须为 1-5' })
  }
  if (!content || !content.trim()) {
    return res.status(400).json({ error: '评价内容不能为空' })
  }

  const dish = await prisma.dish.findUnique({ where: { id: dishId } })
  if (!dish) {
    return res.status(404).json({ error: '菜品不存在' })
  }

  const review = await prisma.review.create({
    data: {
      dishId,
      userId: req.user!.userId,
      rating,
      content: content.trim(),
    },
    include: { user: { select: { nickname: true, avatar: true } } },
  })

  // 聚合更新 dish 的 rating 和 reviewCount
  const agg = await prisma.review.aggregate({
    where: { dishId },
    _avg: { rating: true },
    _count: true,
  })

  await prisma.dish.update({
    where: { id: dishId },
    data: {
      rating: agg._avg?.rating ?? 0,
      reviewCount: (agg._count as number) ?? 0,
    },
  })

  const reviewWithUser = review as typeof review & { user: { nickname: string; avatar: string } }

  res.status(201).json({
    data: {
      id: reviewWithUser.id,
      rating: reviewWithUser.rating,
      content: reviewWithUser.content,
      likes: reviewWithUser.likes,
      createdAt: reviewWithUser.createdAt,
      userId: reviewWithUser.userId,
      userName: reviewWithUser.user.nickname,
      userAvatar: reviewWithUser.user.avatar,
    },
  })
})

export default router
