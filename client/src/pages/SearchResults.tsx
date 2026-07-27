import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'

type Product = {
  id: number
  title: string
  brand: string | null
  price: number
  image: string | null
}

function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`http://localhost:5000/api/v1/search?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((json) => {
        setResults(json.data)
        setLoading(false)
      })
  }, [query])

  return (
    <div className="px-6 py-12">
      <h1 className="font-heading text-2xl font-bold text-black mb-2">
        Search results for "{query}"
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        {loading ? 'Searching...' : `${results.length} item${results.length !== 1 ? 's' : ''} found`}
      </p>

      {!loading && results.length === 0 ? (
        <p className="text-gray-500">No products matched your search.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {results.map((product) => (
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

export default SearchResults