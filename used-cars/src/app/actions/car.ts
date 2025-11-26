'use server';

import prisma from '@/lib/prisma';
import { getCurrentUserId } from '@/app/actions/favorite';

export async function getUserListings() {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    return [];
  }
  
  try {
    const cars = await prisma.car.findMany({
      where: { sellerId: userId },
      include: {
        images: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return cars;
  } catch (error) {
    console.error('Error fetching user listings:', error);
    return [];
  }
}
