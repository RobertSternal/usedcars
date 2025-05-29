import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Number of cars to fetch per request
const CARS_PER_PAGE = 5;

export async function GET(request: NextRequest) {
  try {
    // Get skip parameter from URL (for pagination)
    const searchParams = request.nextUrl.searchParams;
    const skipParam = searchParams.get('skip');
    const skip = skipParam ? parseInt(skipParam) : 0;
    
    // Fetch next batch of cars
    const cars = await prisma.car.findMany({
      include: {
        images: true
      },
      where: {
        status: 'ACTIVE'
      },
      skip: skip,
      take: CARS_PER_PAGE,
      orderBy: {
        // We're using random ordering here, but in a real implementation
        // this would be based on user preferences stored in the database
        createdAt: 'desc'
      }
    });
    
    // Process cars to include features in the expected format
    const processedCars = cars.map(car => {
      // Parse features if they are stored as a JSON string
      let parsedFeatures: string[] = [];
      if (car.features) {
        try {
          parsedFeatures = JSON.parse(car.features as string);
        } catch {
          if (typeof car.features === 'string') {
            parsedFeatures = car.features.includes(',') ? 
              car.features.split(',').map((f: string) => f.trim()) : 
              [car.features];
          }
        }
      }
      
      // Find primary image or use the first one available
      const primaryImage = car.images.find(img => img.isPrimary);
      const imageUrl = primaryImage?.url || 
                      car.images[0]?.url || 
                      '/usedcars/images/auction-photos/car-placeholder.jpg';
      
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
        features: parsedFeatures
      };
    });
    
    return NextResponse.json(processedCars);
  } catch (error) {
    console.error('Error fetching recommended cars:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommended cars' },
      { status: 500 }
    );
  }
}