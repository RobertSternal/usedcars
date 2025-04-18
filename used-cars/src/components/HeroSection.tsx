import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <div className="relative h-[600px] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/revuelto.jpg"
          alt="Lamborghini Revuelto supercar"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
      </div>
      
      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-xl text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Find Your Perfect Car
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            The largest marketplace for buying and selling quality used vehicles in Poland.
          </p>
          
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg mb-8">
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
              <input
                type="text"
                placeholder="Search by make, model, or keyword"
                className="flex-grow px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition">
                Search Cars
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Link
              href="/browse"
              className="bg-white text-gray-800 hover:bg-gray-100 px-6 py-3 rounded-md font-medium transition"
            >
              Browse All Cars
            </Link>
            <Link
              href="/sell"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition"
            >
              Sell Your Car
            </Link>
            <Link
              href="/discover"
              className="bg-transparent hover:bg-white/20 border border-white text-white px-6 py-3 rounded-md font-medium transition"
            >
              Car Finder
            </Link>
          </div>
        </div>
      </div>
      
      {/* Stats Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center text-white">
              <div className="text-3xl font-bold">10,000+</div>
              <div className="text-sm">Cars Available</div>
            </div>
            <div className="text-center text-white">
              <div className="text-3xl font-bold">5,000+</div>
              <div className="text-sm">Happy Customers</div>
            </div>
            <div className="text-center text-white">
              <div className="text-3xl font-bold">200+</div>
              <div className="text-sm">Cities Covered</div>
            </div>
            <div className="text-center text-white">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-sm">Customer Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
