import ProductCard from './ProductCard'
import { mockProducts } from '../data/mockProducts'

function NewArrivals() {
  return (
    <section className="px-6 py-12">
      <h2 className="font-heading text-2xl font-bold text-black mb-6">
        🔥 New Arrivals
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {mockProducts.map((product) => (
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