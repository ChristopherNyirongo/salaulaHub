import express from 'express'
import { products } from './data/products'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from './lib/prisma'

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

app.post('/api/v1/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, username, email, phoneNumber, password, role } = req.body

    // Check if a user with this email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
        errors: [],
      })
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create the user in the database
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        email,
        phoneNumber,
        password: hashedPassword,
        role: role || 'BUYER',
      },
    })

    // Generate a JWT for this new user
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      success: true,
      message: "Account created successfully.",
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          role: user.role,
        },
        token,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Something went wrong while creating the account.",
      errors: [],
    })
  }
})