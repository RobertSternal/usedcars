import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const car = await prisma.car.findUnique({
      where: { id },
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
    });

    if (!car) {
      return NextResponse.json(
        { error: 'Car not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(car);
  } catch (error) {
    console.error('Error fetching car:', error);
    return NextResponse.json(
      { error: 'Failed to fetch car' },
      { status: 500 }
    );
  }
}