import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Initialize Prisma client
let prisma: PrismaClient;

// Function to get Prisma client with connection retry
const getPrismaClient = async () => {
  if (!prisma) {
    prisma = new PrismaClient();
    // Test the connection
    try {
      await prisma.$connect();
      console.log('Database connection established successfully');
    } catch (error) {
      console.error('Failed to connect to database:', error);
      throw error;
    }
  }
  return prisma;
};

export async function POST(request: Request) {
  let client;
  
  try {
    // Parse request body
    const body = await request.json();
    console.log('Sign-in request body:', JSON.stringify(body));
    
    // Extract credentials - support both email and username formats
    const { email, username, password } = body;
    const userIdentifier = email || username;
    
    // Validate input
    if (!userIdentifier || !password) {
      console.log('Missing credentials');
      return NextResponse.json(
        { error: 'Email/username and password are required' },
        { status: 400 }
      );
    }
    
    // Get Prisma client
    client = await getPrismaClient();
    
    // Find user by email or username
    const user = await client.user.findFirst({
      where: {
        OR: [
          { email: userIdentifier },
          { name: userIdentifier }
        ]
      }
    });
    
    console.log('User found:', user ? 'Yes' : 'No');
    
    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Verify password
    let isPasswordValid = false;
    
    // First check if the password is stored as plain text
    if (password === user.password) {
      console.log('Password validated with direct comparison');
      isPasswordValid = true;
    } else {
      // If direct comparison fails, try bcrypt compare (for future compatibility)
      try {
        isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password validated with bcrypt');
      } catch {
        console.log('Both password validation methods failed');
      }
    }
    
    if (!isPasswordValid) {
      console.log('Password validation failed');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
    );
    
    console.log('Authentication successful');
    
    // Return user data and token
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Sign-in error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.$disconnect();
    }
  }
}
