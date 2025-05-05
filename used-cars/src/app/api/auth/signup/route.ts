import { NextRequest, NextResponse } from 'next/server';
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

export async function POST(request: NextRequest) {
  let client;
  
  try {
    const body = await request.json();
    
    const {
      email,
      password,
      name,
      phone,
      profileImage,
      role = 'USER',
    } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get Prisma client
    client = await getPrismaClient();

    // Check if user already exists
    const existingUser = await client.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create the user
    const user = await client.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        profileImage,
        role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        profileImage: true,
        role: true,
        createdAt: true,
      },
    });

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

    return NextResponse.json({
      user,
      token
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.$disconnect();
    }
  }
}
