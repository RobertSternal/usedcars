import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Car ID is required' },
        { status: 400 }
      );
    }

    const car = await prisma.car.findUnique({
      where: {
        id: id,
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            profileImage: true,
            role: true,
          },
        },
        images: true,
      },
    });

    if (!car) {
      return NextResponse.json(
        { error: 'Car not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(car);
  } catch (error) {
    console.error('Error fetching car details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch car details' },
      { status: 500 }
    );
  }
}
