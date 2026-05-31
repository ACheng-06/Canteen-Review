import { Router } from 'express'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { hashPassword, comparePassword } from '../utils/password'
import { signToken } from '../utils/jwt'

const router = Router()
const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password, nickname, currentSchool, newSchool } = req.body

  if (!email || !password || !nickname) {
    return res.status(400).json({ error: '邮箱、密码、昵称均为必填' })
  }

  // 验证学校名称
  if (currentSchool !== '北华航天工业学院') {
    return res.status(400).json({ error: '请输入正确的学校全名' })
  }
  if (newSchool !== '河北航空航天大学') {
    return res.status(400).json({ error: '请输入正确的即将更改的校名' })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return res.status(409).json({ error: '邮箱已注册' })
  }

  const hashed = await hashPassword(password)
  const user = await prisma.user.create({
    data: { email, password: hashed, nickname },
    select: { id: true, email: true, nickname: true, avatar: true, bio: true, createdAt: true },
  })

  const token = signToken({ userId: user.id, email: user.email })
  res.status(201).json({ data: { token, user } })
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: '邮箱和密码为必填' })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return res.status(401).json({ error: '邮箱或密码错误' })
  }

  const valid = await comparePassword(password, user.password)
  if (!valid) {
    return res.status(401).json({ error: '邮箱或密码错误' })
  }

  const token = signToken({ userId: user.id, email: user.email })
  const { password: _, ...userWithoutPassword } = user
  res.json({ data: { token, user: userWithoutPassword } })
})

export default router
