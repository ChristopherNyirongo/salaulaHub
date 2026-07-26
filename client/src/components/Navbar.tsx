import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="w-full bg-black text-white px-6 py-4 flex items-center justify-between">
      <Link to="/" className="font-heading text-xl font-bold text-emerald-500">
        SalaulaHub
      </Link>

      <div className="hidden md:flex items-center gap-6 text-sm">
        <a href="#">Categories</a>
        <a href="#">New Arrivals</a>
        <a href="#">Map</a>
        <a href="#">Bale Events</a>
      </div>

      <div className="flex items-center gap-4 text-sm">
        {user ? (
          <>
           {user.role === 'SELLER' && (
          <>
            <Link to="/create-shop" className="hover:text-emerald-400">My Shop</Link>
            <Link to="/upload-product" className="hover:text-emerald-400">Upload Product</Link>
          </>
          )}
            <span>Hi, {user.firstName}</span>
            <button onClick={logout} className="hover:text-emerald-400">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-emerald-400">Login</Link>
            <Link to="/register" className="hover:text-emerald-400">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar