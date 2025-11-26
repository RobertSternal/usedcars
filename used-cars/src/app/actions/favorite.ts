'use server';

import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';
import { revalidatePath } from 'next/cache';

// Helper to get current user ID from cookies
export async function getCurrentUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  if (!token) return null;
  
  const payload = await verifyToken(token);
  return payload?.userId || null;
}

export async function toggleFavorite(carId: string) {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }
  
  try {
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_carId: {
          userId,
          carId,
        },
      },
    });

    if (existingFavorite) {
      // Remove favorite
      await prisma.favorite.delete({
        where: {
          id: existingFavorite.id,
        },
      });
      revalidatePath(`/cars/${carId}`);
      revalidatePath('/profile');
      revalidatePath('/favorites');
      return { success: true, isFavorite: false };
    } else {
      // Add favorite
      await prisma.favorite.create({
        data: {
          userId,
          carId,
        },
      });
      revalidatePath(`/cars/${carId}`);
      revalidatePath('/profile');
      revalidatePath('/favorites');
      return { success: true, isFavorite: true };
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return { success: false, error: 'Failed to toggle favorite' };
  }
}

export async function checkIsFavorite(carId: string) {
  const userId = await getCurrentUserId();
  
  if (!userId) return false;
  
  try {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_carId: {
          userId,
          carId,
        },
      },
    });
    
    return !!favorite;
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
}

export async function getFavorites() {
  const userId = await getCurrentUserId();
  
  if (!userId) return [];
  
  try {
    const favorites = await prisma.favorite.findMany({
      where: {
        userId,
      },
      include: {
        car: {
          include: {
            images: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    // Transform data to match Car interface expected by the UI
    return favorites.map(fav => fav.car);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
}
