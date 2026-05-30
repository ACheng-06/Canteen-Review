import { Router } from 'express'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const router = Router()
const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

// GET /api/windows/:id
router.get('/:id', async (req, res) => {
  const window = await prisma.window.findUnique({
    where: { id: req.params.id },
    include: { dishes: true },
  })

  if (!window) {
    return res.status(404).json({ error: '窗口不存在' })
  }

  res.json({ data: window })
})

export default router
