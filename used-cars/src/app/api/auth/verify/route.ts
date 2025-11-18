import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyCode } from '@/lib/verification';
import { sendWelcomeEmail } from '@/lib/email';

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
    const { userId, code } = body;

    // Validate input
    if (!userId || !code) {
      return NextResponse.json(
        { error: 'ID użytkownika i kod są wymagane' },
        { status: 400 }
      );
    }

    // Validate code format (6 digits)
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: 'Kod musi składać się z 6 cyfr' },
        { status: 400 }
      );
    }

    // Get Prisma client
    client = await getPrismaClient();

    // Verify the code
    const result = await verifyCode(client, userId, code);

    if (!result.success) {
      return NextResponse.json(
        { 
          error: result.message,
          attemptsLeft: result.attemptsLeft 
        },
        { status: 400 }
      );
    }

    // Get updated user info
    const user = await client.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        verified: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Nie znaleziono użytkownika' },
        { status: 404 }
      );
    }

    // Send welcome email (optional, don't fail if it doesn't send)
    await sendWelcomeEmail(user.email, user.name || undefined).catch(err => {
      console.error('Failed to send welcome email:', err);
    });

    return NextResponse.json({
      success: true,
      message: result.message,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        verified: user.verified,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    console.error('Error verifying code:', error);
    return NextResponse.json(
      { 
        error: 'Nie udało się zweryfikować kodu', 
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
