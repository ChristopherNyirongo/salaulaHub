import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function EditShop() {
  const [shopId, setShopId] = useState<number | null>(null)
  const [shopName, setShopName] = useState('')
  const [description, setDescription] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [locationStatus, setLocationStatus] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/shops/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          const shop = json.data
          setShopId(shop.id)
          setShopName(shop.shopName)
          setDescription(shop.description || '')
          setPhone(shop.phone || '')
          setAddress(shop.address || '')
          setLatitude(shop.latitude)
          setLongitude(shop.longitude)
        } else {
          setError(json.message)
        }
        setLoading(false)
      })
  }, [token])

  function useMyLocation() {
    if (!navigator.geolocation) {
      setLocationStatus('Location not supported by your browser.')
      return
    }

    setLocationStatus('Getting your location...')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude)
        setLongitude(position.coords.longitude)
        setLocationStatus('Location captured ✓')
      },
      () => {
        setLocationStatus('Could not get your location. You can skip this.')
      }
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch(`http://localhost:5000/api/v1/shops/${shopId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ shopName, description, phone, address, latitude, longitude }),
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

  if (loading) return <p className="px-6 py-12 text-center">Loading your shop...</p>
  if (error && !shopId) return <p className="px-6 py-12 text-center text-red-500">{error}</p>

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
        <h1 className="font-heading text-2xl font-bold mb-2 text-center">Edit Your Shop</h1>

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
          className="w-full mb-3 px-4 py-2 border rounded-xl"
          rows={3}
        />
        <input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full mb-3 px-4 py-2 border rounded-xl"
        />
        <input
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full mb-3 px-4 py-2 border rounded-xl"
        />

        <button
          type="button"
          onClick={useMyLocation}
          className="w-full mb-2 border border-gray-300 text-gray-700 py-2 rounded-xl text-sm hover:bg-gray-50"
        >
          📍 Use my current location
        </button>
        {locationStatus && <p className="text-xs text-gray-500 mb-2">{locationStatus}</p>}
        {latitude && longitude && (
          <p className="text-xs text-emerald-600 mb-3">Current location saved ✓</p>
        )}

        <button type="submit" className="w-full bg-black text-white py-2 rounded-xl font-medium hover:bg-gray-800">
          Save Changes
        </button>
      </form>
    </div>
  )
}

export default EditShop