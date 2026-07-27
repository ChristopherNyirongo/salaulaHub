import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const CLOUDINARY_CLOUD_NAME = "plbuiral"
const CLOUDINARY_UPLOAD_PRESET = "salaulahub_products"

type Category = { id: number; name: string }

function UploadProduct() {
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState({
    title: '', description: '', brand: '', condition: 'Good',
    gender: '', size: '', colour: '', price: '', categoryId: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
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
      let imageUrl = ''

      if (imageFile) {
        setUploading(true)
        const cloudinaryForm = new FormData()
        cloudinaryForm.append('file', imageFile)
        cloudinaryForm.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

        const cloudRes = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: 'POST', body: cloudinaryForm }
        )
        const cloudJson = await cloudRes.json()


        if (!cloudJson.secure_url) {
          setError('Image upload failed. Check the console for details.')
          setUploading(false)
          return
        }

        imageUrl = cloudJson.secure_url
        setUploading(false)
      }

      const res = await fetch('http://localhost:5000/api/v1/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, image: imageUrl }),
      })
      const json = await res.json()


      if (!json.success) {
        setError(json.message)
        return
      }

      navigate('/')
    } catch (err) {
      console.error('Upload error:', err)
      setError('Something went wrong. Please try again.')
      setUploading(false)
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

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Photo
          </label>

          <label
            htmlFor="productImage"
            className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-emerald-500 hover:bg-gray-50 transition overflow-hidden"
          >
            {imageFile ? (
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center px-4">
                <p className="text-gray-500 text-sm font-medium">Click to upload a photo</p>
                <p className="text-gray-400 text-xs mt-1">PNG or JPG, up to 5MB</p>
              </div>
            )}
          </label>

          <input
            id="productImage"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="hidden"
          />
        </div>

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

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-black text-white py-2 rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {uploading ? 'Uploading image...' : 'Publish Product'}
        </button>
      </form>
    </div>
  )
}

export default UploadProduct