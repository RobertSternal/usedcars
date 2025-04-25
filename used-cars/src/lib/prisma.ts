import { PrismaClient } from '../generated/prisma'
import { v4 as uuidv4 } from 'uuid'

// Prevent multiple instances of Prisma Client in development
declare global {
  var prisma: PrismaClient | undefined
}

// Create Prisma Client instance
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

// Use existing client or create new one
export const prisma = globalThis.prisma ?? prismaClientSingleton()

// In development, keep the client alive between hot reloads
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

// Helper functions for working with the database

/**
 * Generate a unique ID for database records
 */
export function generateId(): string {
  return uuidv4()
}

/**
 * Helper function to create a new user
 */
export async function createUser(data: {
  email: string
  password: string
  name?: string
  phone?: string
  profileImage?: string
  role?: string
}) {
  return prisma.user.create({
    data: {
      id: generateId(),
      ...data,
      role: data.role || 'USER'
    }
  })
}

/**
 * Helper function to create a new car listing
 */
export async function createCar(data: {
  title: string
  brand: string
  model: string
  year: number
  price: number
  mileage: number
  fuelType: string
  transmission: string
  bodyType: string
  color: string
  description: string
  location: string
  condition: string
  sellerId: string
  engineSize?: number
  power?: number
  doors?: number
  seats?: number
  features?: string
  sellerNotes?: string
  status?: string
  images?: string[]
}) {
  const { images, ...carData } = data
  
  // Create the car
  const car = await prisma.car.create({
    data: {
      id: generateId(),
      ...carData,
      status: carData.status || 'ACTIVE'
    }
  })
  
  // Add images if provided
  if (images && images.length > 0) {
    await Promise.all(
      images.map((url, index) => {
        return prisma.carImage.create({
          data: {
            id: generateId(),
            url,
            isPrimary: index === 0,
            carId: car.id
          }
        })
      })
    )
  }
  
  return car
}
