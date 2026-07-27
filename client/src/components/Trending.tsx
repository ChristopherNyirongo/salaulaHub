import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'

type Product = {
  id: number
  title: string
  brand: string | null
  price: number
  image: string | null
}

function Trending() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/products')
      .then((res) => res.json())
      .then((json) => {
        // Placeholder "trending" logic: just reverse the order for now.
        // Real trending (views, favorites count) is a future improvement.
        setProducts([...json.data].reverse())
        setLoading(false)
      })
  }, [])

  if (loading) return null
  if (products.length === 0) return null

  return (
    <section className="px-6 py-12 bg-gray-50">
      <h2 className="font-heading text-2xl font-bold text-black mb-6">
        ⭐ Trending
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            brand={product.brand || ''}
            price={product.price}
            image={product.image || ''}
          />
        ))}
      </div>
    </section>
  )
}

export default Trending