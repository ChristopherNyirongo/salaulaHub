import { mockShops } from '../data/mockShops'

function PopularShops() {
  return (
    <section className="px-6 py-12">
      <h2 className="font-heading text-2xl font-bold text-black mb-6">
        🏪 Popular Shops
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockShops.map((shop) => (
          <div
            key={shop.id}
            className="flex items-center gap-4 border border-gray-200 rounded-2xl p-4 hover:shadow-lg transition"
          >
            <img src={shop.logo} alt={shop.name} className="w-14 h-14 rounded-full object-cover" />
            <div>
              <h3 className="font-medium text-black">{shop.name}</h3>
              <p className="text-sm text-gray-500">{shop.followers} followers</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default PopularShops