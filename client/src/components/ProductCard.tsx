import { Link } from 'react-router-dom'

type ProductCardProps = {
  id: number
  title: string
  price: number
  brand: string
  image: string
}

function ProductCard({ id, title, price, brand, image }: ProductCardProps) {
  return (
    <Link to={`/products/${id}`} className="block rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition">
      <img src={image} alt={title} className="w-full h-56 object-cover" />
      <div className="p-4">
        <p className="text-xs text-gray-500">{brand}</p>
        <h3 className="font-medium text-black">{title}</h3>
        <p className="text-emerald-600 font-semibold mt-1">K{price}</p>
      </div>
    </Link>
  )
}

export default ProductCard