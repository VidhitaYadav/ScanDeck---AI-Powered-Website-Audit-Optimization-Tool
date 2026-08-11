import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import aiRoutes from './routes/ai.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',')

app.use(cors({ origin: allowedOrigins }))
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'website-audit-server' })
})

app.use('/api', aiRoutes)

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.listen(PORT, () => {
  console.log(`Website audit backend running on http://localhost:${PORT}`)
})
