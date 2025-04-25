import { NextRequest, NextResponse } from 'next/server';
import { prisma, createUser, createCar } from '@/lib/prisma';

/**
 * Example API route that demonstrates how to use the Prisma client
 * with your SQL Server database
 */
export async function GET(request: NextRequest) {
  try {
    // Get counts of records in each table
    const counts = await Promise.all([
      prisma.user.count(),
      prisma.car.count(),
      prisma.carImage.count(),
      prisma.favorite.count(),
      prisma.review.count(),
      prisma.message.count(),
    ]);

    return NextResponse.json({
      status: 'Database connected successfully',
      tables: {
        users: counts[0],
        cars: counts[1],
        carImages: counts[2],
        favorites: counts[3],
        reviews: counts[4],
        messages: counts[5],
      },
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to database', details: error },
      { status: 500 }
    );
  }
}

/**
 * Example of creating sample data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'create_sample_data') {
      // Create a sample user
      const user = await createUser({
        email: 'test@example.com',
        password: 'securepassword', // In production, hash this password
        name: 'Test User',
        phone: '+48123456789',
        role: 'USER',
      });

      // Create a sample car
      const car = await createCar({
        title: 'BMW 3 Series 2020 - Excellent Condition',
        brand: 'BMW',
        model: '3 Series',
        year: 2020,
        price: 35000,
        mileage: 45000,
        fuelType: 'PETROL',
        transmission: 'AUTOMATIC',
        bodyType: 'SEDAN',
        color: 'Black',
        description: 'Excellent condition BMW 3 Series with full service history.',
        location: 'Warsaw, Poland',
        condition: 'EXCELLENT',
        sellerId: user.id,
        engineSize: 2.0,
        power: 190,
        doors: 4,
        seats: 5,
        features: JSON.stringify([
          'Leather Seats',
          'Navigation System',
          'Bluetooth',
          'Parking Sensors',
          'Heated Seats',
        ]),
        images: [
          'https://example.com/images/bmw1.jpg',
          'https://example.com/images/bmw2.jpg',
        ],
      });

      return NextResponse.json({
        message: 'Sample data created successfully',
        user,
        car,
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error creating sample data:', error);
    return NextResponse.json(
      { error: 'Failed to create sample data', details: error },
      { status: 500 }
    );
  }
}
