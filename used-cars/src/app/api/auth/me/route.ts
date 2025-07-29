import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
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

    console.log('Token found in headers, verifying...');

    // Verify the token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret'
    ) as { userId: string, email: string, role: string };
    
    console.log('Decoded token:', decoded);

    // Get the user from the database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profileImage: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return the user data
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error getting current user:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}
