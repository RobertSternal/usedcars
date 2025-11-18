import { PrismaClient } from '@prisma/client';
import { generateVerificationCode } from './email';

const VERIFICATION_CODE_EXPIRY_MINUTES = 10;
const MAX_VERIFICATION_ATTEMPTS = 5;

// Create a new verification code for user
export const createVerificationCode = async (
  prisma: PrismaClient,
  userId: string
): Promise<string> => {
  // Delete any existing verification codes for this user
  await prisma.verificationCode.deleteMany({
    where: { userId, verified: false },
  });

  // Generate new code
  const code = generateVerificationCode();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + VERIFICATION_CODE_EXPIRY_MINUTES);

  // Save to database
  await prisma.verificationCode.create({
    data: {
      code,
      userId,
      expiresAt,
      attempts: 0,
      verified: false,
    },
  });

  return code;
};

// Verify a code for a user
export const verifyCode = async (
  prisma: PrismaClient,
  userId: string,
  code: string
): Promise<{ success: boolean; message: string; attemptsLeft?: number }> => {
  // Find the most recent unverified code for this user
  const verificationCode = await prisma.verificationCode.findFirst({
    where: {
      userId,
      verified: false,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // No code found
  if (!verificationCode) {
    return {
      success: false,
      message: 'Nie znaleziono kodu weryfikacyjnego. Poproś o wysłanie nowego kodu.',
    };
  }

  // Check if code has expired
  if (new Date() > verificationCode.expiresAt) {
    await prisma.verificationCode.delete({
      where: { id: verificationCode.id },
    });
    return {
      success: false,
      message: 'Kod weryfikacyjny wygasł. Poproś o wysłanie nowego kodu.',
    };
  }

  // Check if too many attempts
  if (verificationCode.attempts >= MAX_VERIFICATION_ATTEMPTS) {
    await prisma.verificationCode.delete({
      where: { id: verificationCode.id },
    });
    return {
      success: false,
      message: 'Przekroczono maksymalną liczbę prób. Poproś o wysłanie nowego kodu.',
    };
  }

  // Increment attempts
  await prisma.verificationCode.update({
    where: { id: verificationCode.id },
    data: { attempts: verificationCode.attempts + 1 },
  });

  // Check if code matches
  if (verificationCode.code !== code) {
    const attemptsLeft = MAX_VERIFICATION_ATTEMPTS - verificationCode.attempts - 1;
    return {
      success: false,
      message: `Nieprawidłowy kod weryfikacyjny. Pozostało prób: ${attemptsLeft}`,
      attemptsLeft,
    };
  }

  // Code is correct - mark as verified
  await prisma.verificationCode.update({
    where: { id: verificationCode.id },
    data: { verified: true },
  });

  // Update user as verified
  await prisma.user.update({
    where: { id: userId },
    data: {
      verified: true,
      emailVerified: new Date(),
    },
  });

  // Clean up old verification codes
  await prisma.verificationCode.deleteMany({
    where: { userId },
  });

  return {
    success: true,
    message: 'Konto zostało pomyślnie zweryfikowane!',
  };
};

// Check if user can request a new code (rate limiting)
export const canRequestNewCode = async (
  prisma: PrismaClient,
  userId: string
): Promise<{ canRequest: boolean; message?: string; waitTime?: number }> => {
  const lastCode = await prisma.verificationCode.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  if (!lastCode) {
    return { canRequest: true };
  }

  // Allow new code request after 1 minute
  const timeSinceLastCode = Date.now() - lastCode.createdAt.getTime();
  const oneMinuteInMs = 60 * 1000;

  if (timeSinceLastCode < oneMinuteInMs) {
    const waitTime = Math.ceil((oneMinuteInMs - timeSinceLastCode) / 1000);
    return {
      canRequest: false,
      message: `Poczekaj ${waitTime} sekund przed wysłaniem nowego kodu.`,
      waitTime,
    };
  }

  return { canRequest: true };
};

// Clean up expired verification codes (can be run as a cron job)
export const cleanupExpiredCodes = async (prisma: PrismaClient): Promise<number> => {
  const result = await prisma.verificationCode.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });

  return result.count;
};
