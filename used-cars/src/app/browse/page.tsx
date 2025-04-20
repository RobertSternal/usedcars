import { Metadata } from 'next';
import CarCard from '@/components/CarCard';
import CarFilter from '@/components/CarFilter';

export const metadata: Metadata = {
  title: 'Browse Cars | UsedCars',
  description: 'Browse our extensive collection of quality used vehicles.',
};

// Sample car data
const cars = [
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
  {
    id: "7",
    title: "Honda Civic 1.5 VTEC Turbo",
    brand: "Honda",
    model: "Civic",
    year: 2021,
    price: 139000,
    mileage: 30000,
    location: "Katowice",
    imageUrl: "/images/auction-photos/a7.jpg",
  },
  {
    id: "8",
    title: "Ford Mustang GT 5.0",
    brand: "Ford",
    model: "Mustang",
    year: 2020,
    price: 299000,
    mileage: 15000,
    location: "Warszawa",
    imageUrl: "/cars/ford-mustang.jpg",
  },
  {
    id: "9",
    title: "Nissan Qashqai 1.3 DIG-T",
    brand: "Nissan",
    model: "Qashqai",
    year: 2022,
    price: 159000,
    mileage: 12000,
    location: "Kraków",
    imageUrl: "/cars/nissan-qashqai.jpg",
  },
  {
    id: "10",
    title: "Hyundai Tucson 1.6 T-GDI Hybrid",
    brand: "Hyundai",
    model: "Tucson",
    year: 2023,
    price: 189000,
    mileage: 8000,
    location: "Poznań",
    imageUrl: "/cars/hyundai-tucson.jpg",
  },
  {
    id: "11",
    title: "Kia Sportage 1.6 T-GDI",
    brand: "Kia",
    model: "Sportage",
    year: 2022,
    price: 174000,
    mileage: 16000,
    location: "Wrocław",
    imageUrl: "/cars/kia-sportage.jpg",
  },
  {
    id: "12",
    title: "Volvo XC60 B5 AWD",
    brand: "Volvo",
    model: "XC60",
    year: 2021,
    price: 259000,
    mileage: 22000,
    location: "Gdańsk",
    imageUrl: "/cars/volvo-xc60.jpg",
  },
];

export default function BrowsePage() {
  return (
    <div className="bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Browse Cars</h1>
          <p className="text-gray-600">Find your perfect match from our extensive collection of quality used vehicles.</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar with filters */}
          <div className="lg:w-1/4">
            <div className="sticky top-24">
              <CarFilter />
            </div>
          </div>
          
          {/* Main content */}
          <div className="lg:w-3/4">
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex justify-between items-center">
              <div>
                <span className="text-gray-600">Showing {cars.length} results</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <label htmlFor="sort" className="text-sm text-gray-600">Sort by:</label>
                <select 
                  id="sort"
                  className="border border-gray-300 rounded-md p-2 text-sm text-gray-900 font-medium focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="mileage_low">Mileage: Low to High</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {cars.map((car) => (
                <CarCard key={car.id} {...car} />
              ))}
            </div>
            
            <div className="mt-10 flex justify-center">
              <nav className="flex items-center">
                <button className="p-2 border border-gray-300 rounded-l-md hover:bg-gray-100">
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="p-2 border-t border-b border-gray-300 bg-blue-600 text-white">1</button>
                <button className="p-2 border-t border-b border-gray-300 hover:bg-gray-100">2</button>
                <button className="p-2 border-t border-b border-gray-300 hover:bg-gray-100">3</button>
                <button className="p-2 border border-gray-300 rounded-r-md hover:bg-gray-100">
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
