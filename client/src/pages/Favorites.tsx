import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import ProductCard from '../components/ProductCard'

type Product = {
  id: number
  title: string
  brand: string | null
  price: number
  image: string | null
}

function Favorites() {
  const [favorites, setFavorites] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/favorites', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => {
        setFavorites(json.data)
        setLoading(false)
      })
  }, [token])

  if (loading) return <p className="px-6 py-12">Loading your favorites...</p>

  return (
    <div className="px-6 py-12">
      <h1 className="font-heading text-2xl font-bold text-black mb-6">❤️ Your Favorites</h1>

      {favorites.length === 0 ? (
        <p className="text-gray-500">You haven't saved anything yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {favorites.map((product) => (
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
      )}
    </div>
  )
}

export default Favorites