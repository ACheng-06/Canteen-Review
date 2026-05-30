import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth'
import usersRoutes from './routes/users'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/users', usersRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

export default app
