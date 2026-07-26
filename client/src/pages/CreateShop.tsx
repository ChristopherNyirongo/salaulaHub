import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function CreateShop() {
  const [shopName, setShopName] = useState('')
  const [description, setDescription] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const { token } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('http://localhost:5000/api/v1/shops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ shopName, description, phone }),
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
        <h1 className="font-heading text-2xl font-bold mb-2 text-center">Create Your Shop</h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Set up your shop so buyers can find you.
        </p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <input
          placeholder="Shop Name"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          className="w-full mb-3 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          required
        />
        <textarea
          placeholder="Describe your shop"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-3 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          rows={3}
        />
        <input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <button type="submit" className="w-full bg-black text-white py-2 rounded-xl font-medium hover:bg-gray-800">
          Create Shop
        </button>
      </form>
    </div>
  )
}

export default CreateShop