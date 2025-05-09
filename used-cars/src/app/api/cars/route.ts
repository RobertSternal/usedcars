import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');
    
    // Build the query with optional filters
    const query: any = {
      where: {},
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
      sellerId,
      images,
    } = body;

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
