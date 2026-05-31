import { Router } from 'express'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const router = Router()
const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

// 计算时间范围
function getDateRange(period: string): Date | null {
  const now = new Date()
  switch (period) {
    case 'today': {
      // 今天 00:00:00
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      return start
    }
    case 'week': {
      // 7天前
      const start = new Date(now)
      start.setDate(start.getDate() - 7)
      return start
    }
    case 'month': {
      // 30天前
      const start = new Date(now)
      start.setDate(start.getDate() - 30)
      return start
    }
    default:
      return null
  }
}

// GET /api/ranking
router.get('/', async (req, res) => {
  const { category = 'popularity', period = 'today', limit = '30' } = req.query
  const limitNum = parseInt(limit as string, 10)
  const startDate = getDateRange(period as string)

  // 如果是按时间段筛选，需要根据该时间段内的评价重新计算分数
  if (startDate && (period === 'today' || period === 'week' || period === 'month')) {
    // 查询该时间段内的评价，按菜品聚合
    const reviews = await prisma.review.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      select: {
        dishId: true,
        rating: true,
        speedRating: true,
        valueRating: true,
        likes: true,
      },
    })

    // 按菜品聚合
    const dishStats: Record<string, {
      count: number
      totalRating: number
      totalSpeed: number
      totalValue: number
      totalLikes: number
    }> = {}

    for (const review of reviews) {
      if (!dishStats[review.dishId]) {
        dishStats[review.dishId] = {
          count: 0,
          totalRating: 0,
          totalSpeed: 0,
          totalValue: 0,
          totalLikes: 0,
        }
      }
      const stat = dishStats[review.dishId]
      stat.count++
      stat.totalRating += review.rating
      stat.totalSpeed += review.speedRating
      stat.totalValue += review.valueRating
      stat.totalLikes += review.likes
    }

    // 计算每个菜品的分数
    const scoredDishes = Object.entries(dishStats).map(([dishId, stat]) => {
      const avgRating = stat.totalRating / stat.count
      const avgSpeed = stat.totalSpeed / stat.count
      const avgValue = stat.totalValue / stat.count
      // 人气 = 评价数 × 10 + 点赞数 × 2
      const popularity = stat.count * 10 + stat.totalLikes * 2

      return {
        dishId,
        rating: avgRating,
        speedScore: avgSpeed,
        valueScore: avgValue,
        popularity,
        reviewCount: stat.count,
      }
    })

    // 根据 category 排序
    let sortKey: string
    switch (category) {
      case 'speed':
        sortKey = 'speedScore'
        break
      case 'value':
        sortKey = 'valueScore'
        break
      case 'popularity':
      default:
        sortKey = 'popularity'
        break
    }

    scoredDishes.sort((a, b) => {
      const aVal = a[sortKey as keyof typeof a] as number
      const bVal = b[sortKey as keyof typeof b] as number
      return bVal - aVal
    })

    // 取前 N 个
    const topDishes = scoredDishes.slice(0, limitNum)

    // 查询菜品详情
    const dishIds = topDishes.map((d) => d.dishId)
    const dishes = await prisma.dish.findMany({
      where: { id: { in: dishIds } },
      include: {
        window: { select: { name: true } },
        canteen: { select: { name: true } },
      },
    })

    // 按排序顺序组装结果
    const dishMap = new Map(dishes.map((d) => [d.id, d]))
    const data = topDishes
      .map((scored) => {
        const dish = dishMap.get(scored.dishId)
        if (!dish) return null
        return {
          id: dish.id,
          name: dish.name,
          category: dish.category,
          price: dish.price,
          rating: scored.rating,
          reviewCount: scored.reviewCount,
          speedScore: scored.speedScore,
          valueScore: scored.valueScore,
          popularity: scored.popularity,
          image: dish.image,
          windowName: dish.window.name,
          canteenName: dish.canteen.name,
        }
      })
      .filter(Boolean)

    return res.json({ data })
  }

  // 全量排行（不筛选时间）
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
