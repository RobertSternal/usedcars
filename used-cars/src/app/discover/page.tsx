import type { Metadata } from 'next/types';
import CarSwiper from '@/components/CarSwiper';
import prisma from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Car Finder | UsedCars',
  description: 'Discover your perfect car match with our interactive Car Finder tool.',
};

async function getCarsInRandomOrder() {
  try {
    // Fetch cars from the database with their images
    const cars = await prisma.car.findMany({
      include: {
        images: true
      },
      where: {
        status: 'ACTIVE'
      }
    });
    
    // Shuffle the cars array for random order
    const shuffledCars = [...cars].sort(() => Math.random() - 0.5);
    
    return shuffledCars.map(car => {
      // Find primary image or use the first one available
      const primaryImage = car.images.find(img => img.isPrimary);
      const imageUrl = primaryImage?.url || 
                       car.images[0]?.url || 
                       '/usedcars/images/auction-photos/car-placeholder.jpg';
      
      // Parse features if they are stored as a JSON string
      let features: string[] = [];
      if (car.features) {
        try {
          features = JSON.parse(car.features);
        } catch {
          // If parsing fails, split by commas or use as is
          features = car.features.includes(',') ? 
            car.features.split(',').map(f => f.trim()) : 
            [car.features];
        }
      }
      
      return {
        id: car.id,
        title: car.title,
        brand: car.brand,
        model: car.model,
        year: car.year,
        price: car.price,
        mileage: car.mileage,
        location: car.location,
        imageUrl: imageUrl,
        description: car.description,
        features: features
      };
    });
  } catch (error) {
    console.error('Error fetching cars:', error);
    return [];
  }
}

export default async function DiscoverPage() {
  const cars = await getCarsInRandomOrder();
  
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Car Finder</h1>
          <p className="text-xl text-gray-600">
            Swipe right on cars you like, left on those you don&apos;t. We&apos;ll help you find your perfect match!
          </p>
        </div>
        
        <div className="flex justify-center">
          <CarSwiper cars={cars} />
        </div>
        
        <div className="mt-16 max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">How It Works</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 rounded-full p-3">
                  <svg className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-800">Discover Cars</h3>
                  <p className="mt-1 text-gray-600">Browse through our curated selection of quality used vehicles that match your preferences.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 rounded-full p-3">
                  <svg className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-800">Like or Pass</h3>
                  <p className="mt-1 text-gray-600">Swipe right on cars you&apos;re interested in, or left to skip and see the next option.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 rounded-full p-3">
                  <svg className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-800">Schedule a Test Drive</h3>
                  <p className="mt-1 text-gray-600">Once you find a car you love, easily schedule a test drive with just a few clicks.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
