import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createVerificationCode, canRequestNewCode } from '@/lib/verification';
import { sendVerificationEmail } from '@/lib/email';

// Initialize Prisma client
let prisma: PrismaClient;

// Function to get Prisma client with connection retry
const getPrismaClient = async () => {
  if (!prisma) {
    prisma = new PrismaClient();
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
    const { userId, email } = body;

    // Validate input
    if (!userId || !email) {
      return NextResponse.json(
        { error: 'ID użytkownika i email są wymagane' },
        { status: 400 }
      );
    }

    // Get Prisma client
    client = await getPrismaClient();

    // Find user and verify they exist
    const user = await client.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        verified: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Nie znaleziono użytkownika' },
        { status: 404 }
      );
    }

    // Check if email matches
    if (user.email !== email) {
      return NextResponse.json(
        { error: 'Nieprawidłowy adres email' },
        { status: 400 }
      );
    }

    // Check if user is already verified
    if (user.verified) {
      return NextResponse.json(
        { error: 'Konto jest już zweryfikowane' },
        { status: 400 }
      );
    }

    // Check rate limiting
    const rateLimitCheck = await canRequestNewCode(client, userId);
    if (!rateLimitCheck.canRequest) {
      return NextResponse.json(
        { 
          error: rateLimitCheck.message,
          waitTime: rateLimitCheck.waitTime 
        },
        { status: 429 } // Too Many Requests
      );
    }

    // Generate new verification code
    const verificationCode = await createVerificationCode(client, userId);

    // Send verification email
    const emailSent = await sendVerificationEmail(email, verificationCode, user.name || undefined);

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Nie udało się wysłać emaila z kodem weryfikacyjnym' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Nowy kod weryfikacyjny został wysłany na Twój adres email',
    });
  } catch (error) {
    console.error('Error resending verification code:', error);
    return NextResponse.json(
      { 
        error: 'Nie udało się wysłać kodu weryfikacyjnego', 
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
