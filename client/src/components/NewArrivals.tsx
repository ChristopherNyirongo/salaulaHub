import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'

type Product = {
  id: number
  title: string
  brand: string
  price: number
  image: string
}

function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/products')
      .then((res) => res.json())
      .then((json) => {
        setProducts(json.data)
        setLoading(false)
      })
      .catch(() => {
        setError('Could not load products.')
        setLoading(false)
      })
  }, [])

  if (loading) return <p className="px-6 py-12">Loading products...</p>
  if (error) return <p className="px-6 py-12 text-red-500">{error}</p>

  return (
    <section className="px-6 py-12">
      <h2 className="font-heading text-2xl font-bold text-black mb-6">
        🔥 New Arrivals
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            title={product.title}
            brand={product.brand}
            price={product.price}
            image={product.image}
          />
        ))}
      </div>
    </section>
  )
}

export default NewArrivals