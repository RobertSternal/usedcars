import { jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  verified?: boolean;
  [key: string]: any;
}

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET || 'fallback_secret';
  return new TextEncoder().encode(secret);
};

// Verify JWT token
export const verifyToken = async (token: string): Promise<TokenPayload | null> => {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    return payload as TokenPayload;
  } catch (error) {
    console.error('❌ Token verification failed:', error);
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
