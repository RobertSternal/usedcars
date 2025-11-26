import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken, getTokenFromRequest } from './jwt';

// Re-export from jwt.ts
export { verifyToken, getTokenFromRequest };

// Get authenticated user from request
export const getAuthUser = async (request: NextRequest): Promise<{
  userId: string;
  email: string;
  role: string;
  verified: boolean;
} | null> => {
  const token = getTokenFromRequest(request);
  if (!token) {
    console.log('❌ No token found in request');
    return null;
  }

  const payload = await verifyToken(token);
  if (!payload) {
    console.log('❌ Token verification failed');
    return null;
  }

  // Verify user still exists and is verified
  const prisma = new PrismaClient();
  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        role: true,
        verified: true,
      },
    });

    if (!user) {
      console.log('❌ User not found in database');
      return null;
    }

    console.log('✅ User found in database:', user.email, 'verified:', user.verified);

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      verified: user.verified,
    };
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};

// Check if user is authenticated and verified
export const requireAuth = async (
  request: NextRequest
): Promise<{ authenticated: boolean; verified: boolean; user?: any }> => {
  const user = await getAuthUser(request);

  if (!user) {
    return { authenticated: false, verified: false };
  }

  return {
    authenticated: true,
    verified: user.verified,
    user,
  };
};
