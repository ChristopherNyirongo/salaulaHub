import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Register() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', username: '', email: '', phoneNumber: '', password: '', role: 'BUYER',
  })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('http://localhost:5000/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()

      if (!json.success) {
        setError(json.message)
        return
      }

      login(json.data.user, json.data.token)
      navigate('/')
    } catch {
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
        <h1 className="font-heading text-2xl font-bold mb-6 text-center">Create Account</h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {[
          { name: 'firstName', placeholder: 'First Name' },
          { name: 'lastName', placeholder: 'Last Name' },
          { name: 'username', placeholder: 'Username' },
          { name: 'email', placeholder: 'Email', type: 'email' },
          { name: 'phoneNumber', placeholder: 'Phone Number' },
          { name: 'password', placeholder: 'Password', type: 'password' },
        ].map((field) => (
          <input
            key={field.name}
            name={field.name}
            type={field.type || 'text'}
            placeholder={field.placeholder}
            value={(form as any)[field.name]}
            onChange={handleChange}
            className="w-full mb-3 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        ))}

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded-xl"
        >
          <option value="BUYER">I want to buy</option>
          <option value="SELLER">I want to sell</option>
        </select>

        <button type="submit" className="w-full bg-black text-white py-2 rounded-xl font-medium hover:bg-gray-800">
          Create Account
        </button>

        <p className="text-sm text-center mt-4 text-gray-500">
          Already have an account? <Link to="/login" className="text-emerald-600 font-medium">Log In</Link>
        </p>
      </form>
    </div>
  )
}

export default Register