import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

type Category = { id: number; name: string }

function UploadProduct() {
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState({
    title: '', description: '', brand: '', condition: 'Good',
    gender: '', size: '', colour: '', price: '', categoryId: '',
  })
  const [error, setError] = useState('')
  const { token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/categories')
      .then((res) => res.json())
      .then((json) => setCategories(json.data))
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('http://localhost:5000/api/v1/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })
      const json = await res.json()

      if (!json.success) {
        setError(json.message)
        return
      }

      navigate('/')
    } catch {
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md mx-auto">
        <h1 className="font-heading text-2xl font-bold mb-6 text-center">Upload Product</h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <input
          name="title" placeholder="Product Title" value={form.title} onChange={handleChange}
          className="w-full mb-3 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          required
        />

        <textarea
          name="description" placeholder="Description" value={form.description} onChange={handleChange}
          className="w-full mb-3 px-4 py-2 border rounded-xl"
          rows={3}
        />

        <input
          name="brand" placeholder="Brand" value={form.brand} onChange={handleChange}
          className="w-full mb-3 px-4 py-2 border rounded-xl"
        />

        <select name="categoryId" value={form.categoryId} onChange={handleChange}
          className="w-full mb-3 px-4 py-2 border rounded-xl" required>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <select name="condition" value={form.condition} onChange={handleChange}
          className="w-full mb-3 px-4 py-2 border rounded-xl">
          <option>New with Tags</option>
          <option>Like New</option>
          <option>Excellent</option>
          <option>Good</option>
          <option>Fair</option>
        </select>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <input name="size" placeholder="Size" value={form.size} onChange={handleChange}
            className="px-4 py-2 border rounded-xl" />
          <input name="colour" placeholder="Colour" value={form.colour} onChange={handleChange}
            className="px-4 py-2 border rounded-xl" />
        </div>

        <input name="gender" placeholder="Gender (Men/Women/Unisex)" value={form.gender} onChange={handleChange}
          className="w-full mb-3 px-4 py-2 border rounded-xl" />

        <input name="price" type="number" placeholder="Price (K)" value={form.price} onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded-xl" required />

        <button type="submit" className="w-full bg-black text-white py-2 rounded-xl font-medium hover:bg-gray-800">
          Publish Product
        </button>
      </form>
    </div>
  )
}

export default UploadProduct