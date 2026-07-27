import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

type Shop = {
  id: number
  shopName: string
  logo: string | null
  _count: { products: number }
}

function PopularShops() {
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/shops')
      .then((res) => res.json())
      .then((json) => {
        setShops(json.data)
        setLoading(false)
      })
  }, [])

  if (loading) return null
  if (shops.length === 0) return null

  return (
    <section className="px-6 py-12">
      <h2 className="font-heading text-2xl font-bold text-black mb-6">
        🏪 Popular Shops
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {shops.map((shop) => (
          <div
            key={shop.id}
            className="flex items-center gap-4 border border-gray-200 rounded-2xl p-4 hover:shadow-lg transition"
          >
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs overflow-hidden">
              {shop.logo ? (
                <img src={shop.logo} alt={shop.shopName} className="w-full h-full object-cover" />
              ) : (
                shop.shopName.charAt(0)
              )}
            </div>
            <div>
              <h3 className="font-medium text-black">{shop.shopName}</h3>
              <p className="text-sm text-gray-500">{shop._count.products} products</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default PopularShops