import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/lib/email';
import { createVerificationCode } from '@/lib/verification';

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
        { error: 'Email i hasło są wymagane' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Nieprawidłowy format adresu email' },
        { status: 400 }
      );
    }

    // Validate password strength (at least 6 characters)
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Hasło musi mieć co najmniej 6 znaków' },
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
        { error: 'Użytkownik z tym adresem email już istnieje' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create the user as UNVERIFIED
    const user = await client.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        profileImage,
        role,
        verified: false, // User is not verified yet
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        profileImage: true,
        role: true,
        verified: true,
        createdAt: true,
      },
    });

    // Generate verification code
    const verificationCode = await createVerificationCode(client, user.id);

    // Send verification email
    const emailSent = await sendVerificationEmail(email, verificationCode, name);

    if (!emailSent) {
      console.error('Failed to send verification email');
      // Don't fail the registration, but log the error
    }

    return NextResponse.json({
      success: true,
      message: 'Konto zostało utworzone. Sprawdź swoją skrzynkę email, aby zweryfikować konto.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        verified: user.verified,
      },
      requiresVerification: true,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { 
        error: 'Nie udało się utworzyć konta', 
        details: error instanceof Error ? error.message : 'Nieznany błąd' 
      },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.$disconnect();
    }
  }
}
