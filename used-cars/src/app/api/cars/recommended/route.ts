import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

// Number of cars to fetch per request
const CARS_PER_PAGE = 5;

export async function GET(request: NextRequest) {
  try {
    // Get skip parameter from URL (for pagination)
    const searchParams = request.nextUrl.searchParams;
    const skipParam = searchParams.get('skip');
    const skip = skipParam ? parseInt(skipParam) : 0;
    
    // Get user preferences if authenticated
    let userPreferences = null;
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { userId: string };
        if (decoded) {
          userPreferences = await prisma.userPreferences.findUnique({
            where: { userId: decoded.userId }
          });
        }
      } catch {
        console.log('Token verification failed, proceeding without preferences');
      }
    }

    // Build where clause - start with basic filter
    const whereClause: Prisma.CarWhereInput = {
      status: 'ACTIVE'
    };

    // Apply preferences-based filtering
    const orderBy: Prisma.CarOrderByWithRelationInput[] = [{ createdAt: 'desc' }];
    
    if (userPreferences) {
      const excludeConditions: Prisma.CarWhereInput[] = [];

      // Only exclude disliked brands (hard filter)
      if (userPreferences.dislikedBrands) {
        const dislikedBrands: string[] = JSON.parse(userPreferences.dislikedBrands);
        if (dislikedBrands.length > 0) {
          excludeConditions.push({ brand: { notIn: dislikedBrands } });
        }
      }

      // Apply exclusions as hard filters
      if (excludeConditions.length > 0) {
        whereClause.AND = excludeConditions;
      }
    }
    
    // Fetch cars
    const cars = await prisma.car.findMany({
      include: {
        images: true
      },
      where: whereClause,
      skip: skip,
      take: CARS_PER_PAGE,
      orderBy: orderBy
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
        fuelType: car.fuelType,
        transmission: car.transmission,
        bodyType: car.bodyType,
        power: car.power,
        imageUrl: imageUrl,
        description: car.description || '',
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