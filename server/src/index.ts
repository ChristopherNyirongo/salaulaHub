import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from './lib/prisma'
import { requireAuth, AuthRequest } from './middleware/auth'

const app = express()
const PORT = 5000

app.use(express.json())
app.use(cors({
  origin: 'http://localhost:5173',
}))

// ---------- Health & test routes ----------

app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, message: 'SalaulaHub API is running.' })
})

app.post('/api/v1/echo', (req, res) => {
  res.json({ success: true, message: 'Received your data.', data: req.body })
})

// ---------- Products ----------

app.get('/api/v1/products', async (req, res) => {
  const products = await prisma.product.findMany({
    include: {
      shop: { select: { shopName: true } },
      category: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  res.json({
    success: true,
    message: "Products fetched successfully.",
    data: products,
  })
})

app.get('/api/v1/products/:id', async (req, res) => {
  const productId = Number(req.params.id)

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      shop: { select: { shopName: true, phone: true, sellerId: true } },
      category: { select: { name: true } },
    },
  })

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

app.post('/api/v1/products', requireAuth, async (req: AuthRequest, res) => {
  try {
    if (req.userRole !== 'SELLER') {
      return res.status(403).json({
        success: false,
        message: "Only sellers can upload products.",
        errors: [],
      })
    }

    const shop = await prisma.shop.findUnique({
      where: { sellerId: req.userId },
    })

    if (!shop) {
      return res.status(400).json({
        success: false,
        message: "You need to create a shop before uploading products.",
        errors: [],
      })
    }

    const { title, description, brand, condition, gender, size, colour, price, categoryId, image } = req.body

    const product = await prisma.product.create({
      data: {
        shopId: shop.id,
        categoryId: Number(categoryId),
        title,
        description,
        brand,
        condition,
        gender,
        size,
        colour,
        price: Number(price),
        image,
      },
    })

    res.status(201).json({
      success: true,
      message: "Product uploaded successfully.",
      data: product,
    })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Something went wrong while uploading the product.",
      errors: [],
    })
  }
})

// ---------- Product status ----------

app.patch('/api/v1/products/:id/sold', requireAuth, async (req: AuthRequest, res) => {
  await updateProductStatus(req, res, 'Sold')
})

app.patch('/api/v1/products/:id/reserve', requireAuth, async (req: AuthRequest, res) => {
  await updateProductStatus(req, res, 'Reserved')
})

async function updateProductStatus(req: AuthRequest, res: any, newStatus: string) {
  try {
    const productId = Number(req.params.id)

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { shop: true },
    })

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
        errors: [],
      })
    }

    if (product.shop.sellerId !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this product.",
        errors: [],
      })
    }

    const updated = await prisma.product.update({
      where: { id: productId },
      data: { status: newStatus },
    })

    res.json({
      success: true,
      message: `Product marked as ${newStatus}.`,
      data: updated,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
      errors: [],
    })
  }
}

// ---------- Categories ----------

app.get('/api/v1/categories', async (req, res) => {
  const categories = await prisma.category.findMany()
  res.json({
    success: true,
    message: "Categories fetched successfully.",
    data: categories,
  })
})

// ---------- Search ----------

app.get('/api/v1/search', async (req, res) => {
  const { q, category, minPrice, maxPrice, size, gender } = req.query

  const products = await prisma.product.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { title: { contains: String(q), mode: 'insensitive' } },
                { brand: { contains: String(q), mode: 'insensitive' } },
                { description: { contains: String(q), mode: 'insensitive' } },
              ],
            }
          : {},
        category ? { category: { name: { equals: String(category), mode: 'insensitive' } } } : {},
        size ? { size: { equals: String(size), mode: 'insensitive' } } : {},
        gender ? { gender: { equals: String(gender), mode: 'insensitive' } } : {},
        minPrice ? { price: { gte: Number(minPrice) } } : {},
        maxPrice ? { price: { lte: Number(maxPrice) } } : {},
      ],
    },
    include: {
      shop: { select: { shopName: true } },
      category: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  res.json({
    success: true,
    message: "Search results fetched successfully.",
    data: products,
  })
})

// ---------- Auth ----------

app.post('/api/v1/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, username, email, phoneNumber, password, role } = req.body

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
        errors: [],
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

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
  } catch (error: any) {
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'field'
      return res.status(409).json({
        success: false,
        message: `This ${field} is already in use.`,
        errors: [],
      })
    }

    console.error(error)
    res.status(500).json({
      success: false,
      message: "Something went wrong while creating the account.",
      errors: [],
    })
  }
})

app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
        errors: [],
      })
    }

    const passwordMatches = await bcrypt.compare(password, user.password)

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
        errors: [],
      })
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      message: "Login successful.",
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
      message: "Something went wrong while logging in.",
      errors: [],
    })
  }
})

// ---------- Users ----------

app.get('/api/v1/users/me', requireAuth, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } })

  res.json({
    success: true,
    message: "User fetched successfully.",
    data: {
      id: user?.id,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      role: user?.role,
    },
  })
})

// ---------- Shops ----------

app.post('/api/v1/shops', requireAuth, async (req: AuthRequest, res) => {
  try {
    if (req.userRole !== 'SELLER') {
      return res.status(403).json({
        success: false,
        message: "Only sellers can create a shop.",
        errors: [],
      })
    }

    const existingShop = await prisma.shop.findUnique({
      where: { sellerId: req.userId },
    })
    if (existingShop) {
      return res.status(409).json({
        success: false,
        message: "You already have a shop.",
        errors: [],
      })
    }

    const { shopName, description, phone } = req.body

    const shop = await prisma.shop.create({
      data: {
        sellerId: req.userId as number,
        shopName,
        description,
        phone,
      },
    })

    res.status(201).json({
      success: true,
      message: "Shop created successfully.",
      data: shop,
    })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: "Shop name is already taken.",
        errors: [],
      })
    }

    console.error(error)
    res.status(500).json({
      success: false,
      message: "Something went wrong while creating the shop.",
      errors: [],
    })
  }
})

app.get('/api/v1/shops', async (req, res) => {
  const shops = await prisma.shop.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  res.json({
    success: true,
    message: "Shops fetched successfully.",
    data: shops,
  })
})

// ---------- Favorites ----------

app.post('/api/v1/favorites/:productId', requireAuth, async (req: AuthRequest, res) => {
  try {
    const favorite = await prisma.favorite.create({
      data: {
        buyerId: req.userId as number,
        productId: Number(req.params.productId),
      },
    })

    res.status(201).json({
      success: true,
      message: "Added to favorites.",
      data: favorite,
    })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: "Already in your favorites.",
        errors: [],
      })
    }

    console.error(error)
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
      errors: [],
    })
  }
})

app.delete('/api/v1/favorites/:productId', requireAuth, async (req: AuthRequest, res) => {
  try {
    await prisma.favorite.delete({
      where: {
        buyerId_productId: {
          buyerId: req.userId as number,
          productId: Number(req.params.productId),
        },
      },
    })

    res.json({
      success: true,
      message: "Removed from favorites.",
      data: {},
    })
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Favorite not found.",
      errors: [],
    })
  }
})

app.get('/api/v1/favorites', requireAuth, async (req: AuthRequest, res) => {
  const favorites = await prisma.favorite.findMany({
    where: { buyerId: req.userId },
    include: {
      product: {
        include: { shop: { select: { shopName: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  res.json({
    success: true,
    message: "Favorites fetched successfully.",
    data: favorites.map((f) => f.product),
  })
})

// ---------- Start server ----------

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
// ---------- Reviews ----------

app.post('/api/v1/reviews', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { sellerId, rating, comment } = req.body

    if (Number(sellerId) === req.userId) {
      return res.status(400).json({
        success: false,
        message: "You can't review yourself.",
        errors: [],
      })
    }

    const review = await prisma.review.create({
      data: {
        buyerId: req.userId as number,
        sellerId: Number(sellerId),
        rating: Number(rating),
        comment,
      },
    })

    res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      data: review,
    })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: "You've already reviewed this seller.",
        errors: [],
      })
    }

    console.error(error)
    res.status(500).json({
      success: false,
      message: "Something went wrong while submitting the review.",
      errors: [],
    })
  }
})

app.get('/api/v1/reviews/:sellerId', async (req, res) => {
  const sellerId = Number(req.params.sellerId)

  const reviews = await prisma.review.findMany({
    where: { sellerId },
    include: { buyer: { select: { firstName: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const average =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

  res.json({
    success: true,
    message: "Reviews fetched successfully.",
    data: {
      reviews,
      averageRating: Math.round(average * 10) / 10,
      totalReviews: reviews.length,
    },
  })
})