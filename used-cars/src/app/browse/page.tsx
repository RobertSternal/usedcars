import { Metadata } from 'next';
import CarCard from '@/components/CarCard';
import CarFilter from '@/components/CarFilter';
import prisma from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Browse Cars | UsedCars',
  description: 'Browse our extensive collection of quality used vehicles.',
};

async function getCars() {
  try {
    const cars = await prisma.car.findMany({
      include: {
        images: {
          where: { isPrimary: true },
          take: 1
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return cars.map(car => ({
      id: car.id,
      title: car.title,
      brand: car.brand,
      model: car.model,
      year: car.year,
      price: car.price,
      mileage: car.mileage,
      location: car.location,
      imageUrl: car.images[0]?.url || '/images/auction-photos/car-placeholder.jpg'
    }));
  } catch (error) {
    console.error('Error fetching cars:', error);
    return [];
  }
}

export default async function BrowsePage() {
  const cars = await getCars();
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
                <span className="text-gray-600">Showing {cars ? cars.length : 0} results</span>
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
              {cars && cars.length > 0 ? (
                cars.map((car) => (
                  <CarCard key={car.id} {...car} />
                ))
              ) : (
                <div className="col-span-3 text-center py-10">
                  <p className="text-gray-500 text-lg">No cars found. Please try adjusting your filters.</p>
                </div>
              )}
            </div>
            
            <div className="mt-10 flex justify-center">
              <nav className="flex items-center">
                <button className="p-2 border border-gray-300 rounded-l-md hover:bg-gray-100">
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="p-2 border-t border-b border-gray-300 bg-blue-700 text-white">1</button>
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
