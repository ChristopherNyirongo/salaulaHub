import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

type ProductCardProps = {
  id: number
  title: string
  price: number
  brand: string
  image: string
}

function ProductCard({ id, title, price, brand, image }: ProductCardProps) {
  const { token, user } = useAuth()
  const [isFavorited, setIsFavorited] = useState(false)
  const [loading, setLoading] = useState(false)

  async function toggleFavorite(e: React.MouseEvent) {
    e.preventDefault() // stop the Link navigation when clicking the heart
    if (!user) return

    setLoading(true)
    const method = isFavorited ? 'DELETE' : 'POST'

    const res = await fetch(`http://localhost:5000/api/v1/favorites/${id}`, {
      method,
      headers: { Authorization: `Bearer ${token}` },
    })

    if (res.ok) {
      setIsFavorited(!isFavorited)
    }
    setLoading(false)
  }

  return (
    <div className="relative rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition">
      <Link to={`/products/${id}`} className="block">
        <img src={image} alt={title} className="w-full h-56 object-cover" />
        <div className="p-4">
          <p className="text-xs text-gray-500">{brand}</p>
          <h3 className="font-medium text-black">{title}</h3>
          <p className="text-emerald-600 font-semibold mt-1">K{price}</p>
        </div>
      </Link>

      {user && (
        <button
          onClick={toggleFavorite}
          disabled={loading}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md"
        >
          {isFavorited ? '❤️' : '🤍'}
        </button>
      )}
    </div>
  )
}

export default ProductCard