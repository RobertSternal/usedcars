import type { Metadata } from 'next/types';
import CarCard from '@/components/CarCard';
import CarFilter from '@/components/CarFilter';
import CarSort from '@/components/CarSort';
import prisma from '@/lib/prisma';
import { getCurrentUserId } from '@/app/actions/favorite';
import { Prisma } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Browse Cars | UsedCars',
  description: 'Browse our extensive collection of quality used vehicles.',
};

async function getCars(searchParams: { [key: string]: string | string[] | undefined }) {
  const userId = await getCurrentUserId();

  try {
    // Build where clause
    const where: Prisma.CarWhereInput = {
      status: 'ACTIVE',
    };

    // Filter by keyword (make, model, title, etc.)
    if (searchParams.q && typeof searchParams.q === 'string') {
      const terms = searchParams.q.split(/\s+/).filter(term => term.length > 0);
      
      if (terms.length > 0) {
        where.AND = terms.map(term => {
          const orConditions: Prisma.CarWhereInput[] = [
            { brand: { contains: term } },
            { model: { contains: term } },
            { title: { contains: term } },
            { description: { contains: term } },
            { color: { contains: term } }
          ];
          
          // Check if term is a number (for year)
          const numTerm = parseInt(term);
          if (!isNaN(numTerm)) {
            orConditions.push({ year: { equals: numTerm } });
          }
          
          return { OR: orConditions };
        });
      }
    }

    // Filter by Brand
    if (searchParams.brand && typeof searchParams.brand === 'string') {
      where.brand = { contains: searchParams.brand as string };
    }

    // Filter by Price
    if (searchParams.minPrice || searchParams.maxPrice) {
      where.price = {};
      if (searchParams.minPrice) where.price.gte = Number(searchParams.minPrice);
      if (searchParams.maxPrice) where.price.lte = Number(searchParams.maxPrice);
    }

    // Filter by Year
    if (searchParams.minYear || searchParams.maxYear) {
      where.year = {};
      if (searchParams.minYear) where.year.gte = Number(searchParams.minYear);
      if (searchParams.maxYear) where.year.lte = Number(searchParams.maxYear);
    }

    // Filter by Power
    if (searchParams.minPower || searchParams.maxPower) {
      where.power = {};
      if (searchParams.minPower) where.power.gte = Number(searchParams.minPower);
      if (searchParams.maxPower) where.power.lte = Number(searchParams.maxPower);
    }

    // Filter by Engine Size
    if (searchParams.minEngineSize || searchParams.maxEngineSize) {
      where.engineSize = {};
      if (searchParams.minEngineSize) where.engineSize.gte = Number(searchParams.minEngineSize);
      if (searchParams.maxEngineSize) where.engineSize.lte = Number(searchParams.maxEngineSize);
    }

    // Filter by Body Type
    if (searchParams.bodyType && typeof searchParams.bodyType === 'string') {
      const bodyTypes = searchParams.bodyType.split(',');
      where.bodyType = { in: bodyTypes };
    }

    // Filter by Fuel Type
    if (searchParams.fuelType && typeof searchParams.fuelType === 'string') {
      const fuelTypes = searchParams.fuelType.split(',');
      where.fuelType = { in: fuelTypes };
    }

    // Filter by Transmission
    if (searchParams.transmission && typeof searchParams.transmission === 'string') {
      const transmissions = searchParams.transmission.split(',');
      where.transmission = { in: transmissions };
    }

    // Determine sorting
    let orderBy: Prisma.CarOrderByWithRelationInput = { createdAt: 'desc' };
    const sort = typeof searchParams.sort === 'string' ? searchParams.sort : 'newest';

    switch (sort) {
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'price_low':
        orderBy = { price: 'asc' };
        break;
      case 'price_high':
        orderBy = { price: 'desc' };
        break;
      case 'mileage_low':
        orderBy = { mileage: 'asc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const cars = await prisma.car.findMany({
      where,
      include: {
        images: {
          where: { isPrimary: true },
          take: 1
        }
      },
      orderBy
    });
    
    // Get favorites for this user
    let favoriteCarIds = new Set<string>();
    if (userId) {
      const favorites = await prisma.favorite.findMany({
        where: { userId },
        select: { carId: true }
      });
      favoriteCarIds = new Set(favorites.map(f => f.carId));
    }
    
    return cars.map(car => ({
      id: car.id,
      title: car.title,
      brand: car.brand,
      model: car.model,
      year: car.year,
      price: car.price,
      mileage: car.mileage,
      location: car.location,
      imageUrl: car.images[0]?.url || '/usedcars/images/auction-photos/car-placeholder.jpg',
      isFavorite: favoriteCarIds.has(car.id)
    }));
  } catch (error) {
    console.error('Error fetching cars:', error);
    return [];
  }
}

export default async function BrowsePage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const cars = await getCars(searchParams);
  
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
                <CarSort />
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
