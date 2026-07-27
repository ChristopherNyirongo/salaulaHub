import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Hero() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <section className="bg-white py-24 px-6 text-center">
      <h1 className="font-heading text-4xl md:text-5xl font-bold text-black mb-4">
        Find authentic thrift fashion near you.
      </h1>
      <p className="text-gray-500 mb-8">
        Real photos. Real sellers. No more waking up early for the market.
      </p>

      <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for jackets, jeans, dresses..."
          className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </form>

      <div className="flex gap-4 justify-center">
        <button onClick={handleSearch} className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800">
          Browse
        </button>
        <button className="border border-black text-black px-6 py-3 rounded-xl font-medium hover:bg-gray-100">
          Become a Seller
        </button>
      </div>
    </section>
  )
}

export default Hero