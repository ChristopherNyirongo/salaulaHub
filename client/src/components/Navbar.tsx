function Navbar() {
  return (
    <nav className="w-full bg-black text-white px-6 py-4 flex items-center justify-between">
      <span className="font-heading text-xl font-bold text-emerald-500">
        SalaulaHub
      </span>

      <div className="hidden md:flex items-center gap-6 text-sm">
        <a href="#" className="hover:text-emerald-400">Categories</a>
        <a href="#" className="hover:text-emerald-400">New Arrivals</a>
        <a href="#" className="hover:text-emerald-400">Map</a>
        <a href="#" className="hover:text-emerald-400">Bale Events</a>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <a href="#">Wishlist</a>
        <a href="#">Messages</a>
        <a href="#">Notifications</a>
        <a href="#">Profile</a>
      </div>
    </nav>
  )
}

export default Navbar