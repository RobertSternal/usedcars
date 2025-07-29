import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');
    
    // Build the query with optional filters
    const query = {
      where: {} as { sellerId?: string },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            profileImage: true,
          },
        },
        images: true,
      },
      orderBy: {
        createdAt: 'desc' as const,
      },
    };
    
    // Add sellerId filter if provided
    if (sellerId) {
      query.where.sellerId = sellerId;
    }
    
    const cars = await prisma.car.findMany(query);

    return NextResponse.json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cars' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the token from the Authorization header, custom header, or cookies
    const authHeader = request.headers.get('Authorization');
    let token = authHeader ? authHeader.replace('Bearer ', '') : null;

    // Fallback to custom header if no Authorization header
    if (!token) {
      token = request.headers.get('x-auth-token');
    }
    
    // Fallback to cookies if no token in headers
    if (!token) {
      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        const cookies = cookieHeader.split(';').map(cookie => cookie.trim());
        const tokenCookie = cookies.find(cookie => cookie.startsWith('token='));
        if (tokenCookie) {
          token = tokenCookie.split('=')[1];
          console.log('Token found in cookies');
        }
      }
    }

    if (!token) {
      console.log('No authentication token found in headers or cookies');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    console.log('Token found, proceeding with verification');

    // Verify the token
    let userId;
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'fallback_secret'
      ) as { userId: string, email: string, role: string };
      
      userId = decoded.userId;
      // If token verification fails, it will throw an error and go to the catch block
      console.log('User authenticated:', decoded);
    } catch (authError) {
      console.error('Token verification failed:', authError);
      return NextResponse.json(
        { error: 'Authentication failed', details: authError instanceof Error ? authError.message : 'Unknown error' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    const {
      title,
      brand,
      model,
      year,
      price,
      mileage,
      fuelType,
      transmission,
      bodyType,
      color,
      description,
      location,
      condition,
      engineSize,
      power,
      doors,
      seats,
      features,
      sellerNotes,
      images,
    } = body;
    
    // Use the userId from the verified token instead of relying on the request body
    // This ensures that users can only create listings as themselves
    const sellerId = userId;

    // Create car
    const car = await prisma.car.create({
      data: {
        title,
        brand,
        model,
        year,
        price,
        mileage,
        fuelType,
        transmission,
        bodyType,
        color,
        description,
        location,
        condition,
        engineSize,
        power,
        doors,
        seats,
        features: features ? JSON.stringify(features) : null,
        sellerNotes,
        sellerId,
        status: 'ACTIVE',
      },
    });

    // Add images if provided
    if (images && images.length > 0) {
      await Promise.all(
        images.map((imageUrl: string, index: number) =>
          prisma.carImage.create({
            data: {
              url: imageUrl,
              isPrimary: index === 0, // First image is primary
              carId: car.id,
            },
          })
        )
      );
    }

    return NextResponse.json(car, { status: 201 });
  } catch (error) {
    console.error('Error creating car:', error);
    return NextResponse.json(
      { error: 'Failed to create car' },
      { status: 500 }
    );
  }
}
