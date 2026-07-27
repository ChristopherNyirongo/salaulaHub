import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

type Product = {
  id: number
  title: string
  description: string | null
  brand: string | null
  condition: string
  gender: string | null
  size: string | null
  colour: string | null
  price: number
  status: string
  image: string | null
  shop: { shopName: string; phone: string | null; sellerId: number }
  category: { name: string }
}

function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user, token } = useAuth()

  useEffect(() => {
    fetch(`http://localhost:5000/api/v1/products/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (!json.success) {
          setError(json.message)
        } else {
          setProduct(json.data)
        }
        setLoading(false)
      })
      .catch(() => {
        setError('Could not load this product.')
        setLoading(false)
      })
  }, [id])

  if (loading) return <p className="px-6 py-12 text-center">Loading...</p>
  if (error || !product) return <p className="px-6 py-12 text-center text-red-500">{error || 'Product not found.'}</p>

  const whatsappNumber = product.shop.phone?.replace(/\D/g, '')
  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in "${product.title}" (K${product.price}) on SalaulaHub.`
  )

  async function updateStatus(newStatus: 'sold' | 'reserve') {
    const res = await fetch(`http://localhost:5000/api/v1/products/${id}/${newStatus}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    })
    const json = await res.json()

    if (json.success) {
      setProduct(json.data)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link to="/" className="text-sm text-gray-500 hover:text-black mb-6 inline-block">
        &larr; Back to browsing
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="bg-gray-100 rounded-2xl h-96 flex items-center justify-center text-gray-400 overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>No image available</span>
          )}
        </div>

        <div>
          <p className="text-sm text-gray-500">{product.brand} &middot; {product.category.name}</p>
          <h1 className="font-heading text-3xl font-bold text-black mt-1">{product.title}</h1>
          <p className="text-2xl text-emerald-600 font-semibold mt-3">K{product.price}</p>

          {product.status !== 'Available' && (
            <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-black text-white mt-3">
              {product.status}
            </span>
          )}

          <div className="flex gap-2 mt-4">
            <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">{product.condition}</span>
            {product.size && <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">Size {product.size}</span>}
            {product.colour && <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">{product.colour}</span>}
            {product.gender && <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">{product.gender}</span>}
          </div>

          <p className="text-gray-600 mt-6">{product.description}</p>

          <div className="mt-6 border-t pt-4">
            <p className="text-sm text-gray-500">Sold by</p>
            <p className="font-medium text-black">{product.shop.shopName}</p>
          </div>

          {user && product.shop.sellerId === user.id && (
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => updateStatus('reserve')}
                disabled={product.status === 'Reserved'}
                className="px-4 py-2 border border-amber-500 text-amber-600 rounded-xl text-sm font-medium hover:bg-amber-50 disabled:opacity-40"
              >
                Mark Reserved
              </button>
              <button
                onClick={() => updateStatus('sold')}
                disabled={product.status === 'Sold'}
                className="px-4 py-2 border border-red-500 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 disabled:opacity-40"
              >
                Mark Sold
              </button>
            </div>
          )}

          {whatsappNumber ? (
            <a href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block bg-emerald-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-600">
              Chat on WhatsApp
            </a>
          ) : (
            <p className="mt-6 text-sm text-gray-400">Seller contact not available.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail