import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

// 路由将在后续任务中挂载
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

export default app
