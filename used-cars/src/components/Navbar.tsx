import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative w-10 h-10">
            <Image
              src="/logo.png"
              alt="UsedCars Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-xl font-bold text-gray-800">UsedCars</span>
        </Link>
        
        <div className="hidden md:flex space-x-8">
          <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition">
            Home
          </Link>
          <Link href="/browse" className="text-gray-700 hover:text-blue-600 font-medium transition">
            Browse Cars
          </Link>
          <Link href="/discover" className="text-gray-700 hover:text-blue-600 font-medium transition">
            Car Finder
          </Link>
          <Link href="/sell" className="text-gray-700 hover:text-blue-600 font-medium transition">
            Sell Your Car
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium transition">
            About Us
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition">
            Sign In
          </button>
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
