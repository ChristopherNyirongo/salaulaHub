import Navbar from './components/Navbar'
import Hero from './components/Hero'
import NewArrivals from './components/NewArrivals'
import Trending from './components/Trending'
import PopularShops from './components/PopularShops'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <NewArrivals />
      <Trending />
      <PopularShops />
      <Footer />
    </div>
  )
}

export default App