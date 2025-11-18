import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

// Verify JWT token
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret'
    ) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

// Get token from request (cookie or Authorization header)
export const getTokenFromRequest = (request: NextRequest): string | null => {
  // Try to get from cookie first
  const cookieToken = request.cookies.get('token')?.value;
  if (cookieToken) return cookieToken;

  // Try to get from Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
};

// Get authenticated user from request
export const getAuthUser = async (request: NextRequest): Promise<{
  userId: string;
  email: string;
  role: string;
  verified: boolean;
} | null> => {
  const token = getTokenFromRequest(request);
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

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

    if (!user) return null;

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      verified: user.verified,
    };
  } catch (error) {
    console.error('Error fetching user:', error);
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
