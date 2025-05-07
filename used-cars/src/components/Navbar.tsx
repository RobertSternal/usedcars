import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <div className="flex items-center">
            <span className="text-2xl font-extrabold tracking-wide uppercase bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent">USEDCARS</span>
          </div>
        </Link>
        
        <div className="hidden md:flex space-x-8">
          <Link href="/" className="text-gray-700 hover:text-blue-700 font-medium transition">
            Home
          </Link>
          <Link href="/browse" className="text-gray-700 hover:text-blue-700 font-medium transition">
            Browse Cars
          </Link>
          <Link href="/discover" className="text-gray-700 hover:text-blue-700 font-medium transition">
            Car Finder
          </Link>
          <Link href="/sell" className="text-gray-700 hover:text-blue-700 font-medium transition">
            Sell Your Car
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-blue-700 font-medium transition">
            About Us
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href="/signin" className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md font-medium transition">
            Sign In
          </Link>
          <button className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
