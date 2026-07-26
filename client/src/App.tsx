import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import NewArrivals from './components/NewArrivals'
import Trending from './components/Trending'
import PopularShops from './components/PopularShops'
import Footer from './components/Footer'
import Login from './pages/Login'
import Register from './pages/Register'

function Home() {
  return (
    <>
      <Hero />
      <NewArrivals />
      <Trending />
      <PopularShops />
    </>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App