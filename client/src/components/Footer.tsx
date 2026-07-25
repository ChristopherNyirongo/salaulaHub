function Footer() {
  return (
    <footer className="bg-black text-gray-300 px-6 py-10 mt-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="font-heading text-lg font-bold text-white">SalaulaHub</span>
        <div className="flex gap-6 text-sm">
          <a href="#" className="hover:text-white">About</a>
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Terms</a>
          <a href="#" className="hover:text-white">Contact</a>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-6 text-center">
        © 2026 SalaulaHub. All rights reserved.
      </p>
    </footer>
  )
}

export default Footer