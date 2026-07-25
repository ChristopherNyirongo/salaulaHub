import express from 'express'
import { products } from './data/products'
import cors from 'cors'

const app = express()
const PORT = 5000

// Middleware: runs on every request, before any route below
app.use(express.json())

app.use(cors({
  origin: 'http://localhost:5173',
}))

app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, message: 'SalaulaHub API is running.' })
})

// New route: echoes back whatever JSON body you send it
app.post('/api/v1/echo', (req, res) => {
  res.json({ success: true, message: 'Received your data.', data: req.body })
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})

app.get('/api/v1/products', (req, res) => {
  res.json({
    success: true,
    message: "Products fetched successfully.",
    data: products,
  })
})
app.get('/api/v1/products/:id', (req, res) => {
  const productId = Number(req.params.id)
  const product = products.find((p) => p.id === productId)

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found.",
      errors: [],
    })
  }

  res.json({
    success: true,
    message: "Product fetched successfully.",
    data: product,
  })
})