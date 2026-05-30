import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth'
import usersRoutes from './routes/users'
import canteensRoutes from './routes/canteens'
import windowsRoutes from './routes/windows'
import dishesRoutes from './routes/dishes'
import rankingRoutes from './routes/ranking'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/canteens', canteensRoutes)
app.use('/api/windows', windowsRoutes)
app.use('/api/dishes', dishesRoutes)
app.use('/api/ranking', rankingRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

export default app
