import Image from "next/image";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import CarCard from "@/components/CarCard";

// Sample car data
const featuredCars = [
  {
    id: "1",
    title: "BMW 3 Series 320d M Sport",
    brand: "BMW",
    model: "3 Series",
    year: 2022,
    price: 249000,
    mileage: 15000,
    location: "Warszawa",
    imageUrl: "/images/auction-photos/bmw2022.jpg",
  },
  {
    id: "2",
    title: "Audi A4 2.0 TDI Quattro",
    brand: "Audi",
    model: "A4",
    year: 2021,
    price: 219000,
    mileage: 25000,
    location: "Kraków",
    imageUrl: "/images/auction-photos/audia4.jpg",
  },
  {
    id: "3",
    title: "Mercedes-Benz C-Class C200",
    brand: "Mercedes-Benz",
    model: "C-Class",
    year: 2023,
    price: 289000,
    mileage: 5000,
    location: "Poznań",
    imageUrl: "/images/auction-photos/cclass.jpg",
  },
  {
    id: "4",
    title: "Volkswagen Golf 8 GTI",
    brand: "Volkswagen",
    model: "Golf",
    year: 2022,
    price: 179000,
    mileage: 18000,
    location: "Wrocław",
    imageUrl: "/images/auction-photos/gti2022.jpg",
  },
  {
    id: "5",
    title: "Toyota RAV4 Hybrid",
    brand: "Toyota",
    model: "RAV4",
    year: 2023,
    price: 199000,
    mileage: 10000,
    location: "Gdańsk",
    imageUrl: "/images/auction-photos/rav4.jpg",
  },
  {
    id: "6",
    title: "Mazda CX-5 Skyactiv-G",
    brand: "Mazda",
    model: "CX-5",
    year: 2022,
    price: 169000,
    mileage: 20000,
    location: "Łódź",
    imageUrl: "/images/auction-photos/cx5.jpg",
  },
];

const popularBrands = [
  { name: "BMW", logo: "/images/cars/bmw.svg" },
  { name: "Audi", logo: "/images/cars/audi.svg" },
  { name: "Mercedes-Benz", logo: "/images/cars/mercedes.svg" },
  { name: "Volkswagen", logo: "/images/cars/volkswagen.svg" },
  { name: "Toyota", logo: "/images/cars/toyota.svg" },
  { name: "Honda", logo: "/images/cars/honda.svg" },
];

export default function Home() {
  return (
    <div>
      <HeroSection />
      
      {/* Popular Brands */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Popular Brands</h2>
          
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8">
            {popularBrands.map((brand) => (
              <Link 
                key={brand.name}
                href={`/browse?brand=${brand.name.toLowerCase()}`}
                className="flex flex-col items-center group"
              >
                <div className="bg-white p-6 rounded-full shadow-md mb-3 group-hover:shadow-lg transition-shadow duration-300">
                  <div className="relative w-16 h-16">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <span className="text-gray-700 font-medium">{brand.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Popular Cars */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-white">Popular Cars</h2>
            <Link 
              href="/browse"
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              View All
              <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCars.map((car) => (
              <CarCard key={car.id} {...car} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Why Choose Us */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose UsedCars</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="bg-white/20 p-6 rounded-full mb-6">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Verified Vehicles</h3>
              <p className="text-white/80">All our vehicles undergo a rigorous 150-point inspection to ensure quality and reliability.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-white/20 p-6 rounded-full mb-6">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Competitive Pricing</h3>
              <p className="text-white/80">We offer the best market prices with no hidden fees or unexpected charges.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-white/20 p-6 rounded-full mb-6">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Dedicated Support</h3>
              <p className="text-white/80">Our customer service team is available 24/7 to assist you with any questions or concerns.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">What Our Customers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-6">&quot;I found my dream car on UsedCars at an incredible price. The process was smooth, and the customer service was exceptional!&quot;</p>
              <div className="flex items-center">
                <Image src="/images/aston-martin.jpg" alt="Profile" width={48} height={48} className="w-12 h-12 rounded-full object-cover mr-4" />
                <div>
                  <h4 className="font-bold text-gray-800">Anna Kowalska</h4>
                  <p className="text-gray-500 text-sm">Warszawa</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-6">&quot;Selling my car through UsedCars was incredibly easy. I got a fair price and the transaction was completed within days. Highly recommend!&quot;</p>
              <div className="flex items-center">
                <Image src="/images/revuelto.jpg" alt="Profile" width={48} height={48} className="w-12 h-12 rounded-full object-cover mr-4" />
                <div>
                  <h4 className="font-bold text-gray-800">Piotr Nowak</h4>
                  <p className="text-gray-500 text-sm">Kraków</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-6">&quot;The Car Finder feature helped me discover exactly what I was looking for. The whole experience was seamless from start to finish.&quot;</p>
              <div className="flex items-center">
                <Image src="/images/user1.jpg" alt="Profile" width={48} height={48} className="w-12 h-12 rounded-full object-cover mr-4" />
                <div>
                  <h4 className="font-bold text-gray-800">Marta Wiśniewska</h4>
                  <p className="text-gray-500 text-sm">Gdańsk</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Perfect Car?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">Join thousands of satisfied customers who found their dream cars on UsedCars.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/browse"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-md font-medium text-lg transition"
            >
              Browse Cars
            </Link>
            <Link 
              href="/sell"
              className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 rounded-md font-medium text-lg transition"
            >
              Sell Your Car
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
