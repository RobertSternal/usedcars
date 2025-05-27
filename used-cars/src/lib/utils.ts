import prisma from './prisma';
import { hash } from 'bcryptjs';

/**
 * Format a number as currency (PLN)
 * @param amount - The amount to format
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format a date string to a localized date format
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Capitalize the first letter of each word in a string
 * @param str - The string to capitalize
 * @returns Capitalized string
 */
export function capitalizeWords(str: string): string {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Truncate a string to a specified length and add ellipsis if needed
 * @param str - The string to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated string
 */
export function truncateText(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

/**
 * Create a new user in the database
 * @param userData - User data to create
 * @returns Created user object
 */
export async function createUser(userData: {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: string;
}) {
  // Hash the password before storing
  const hashedPassword = await hash(userData.password, 10);
  
  return prisma.user.create({
    data: {
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      phone: userData.phone,
      role: userData.role,
    },
  });
}

/**
 * Create a new car listing in the database
 * @param carData - Car data to create
 * @returns Created car object with images
 */
export async function createCar(carData: {
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  color: string;
  description: string;
  location: string;
  condition: string;
  sellerId: string;
  engineSize?: number;
  power?: number;
  doors?: number;
  seats?: number;
  features?: string;
  images?: string[];
}) {
  // Create the car record
  const car = await prisma.car.create({
    data: {
      title: carData.title,
      brand: carData.brand,
      model: carData.model,
      year: carData.year,
      price: carData.price,
      mileage: carData.mileage,
      fuelType: carData.fuelType,
      transmission: carData.transmission,
      bodyType: carData.bodyType,
      color: carData.color,
      description: carData.description,
      location: carData.location,
      condition: carData.condition,
      sellerId: carData.sellerId,
      engineSize: carData.engineSize,
      power: carData.power,
      doors: carData.doors,
      seats: carData.seats,
      features: carData.features,
    },
  });

  // If images are provided, create image records
  if (carData.images && carData.images.length > 0) {
    await Promise.all(
      carData.images.map((url, index) =>
        prisma.carImage.create({
          data: {
            url,
            isPrimary: index === 0, // First image is primary
            carId: car.id,
          },
        })
      )
    );
  }

  // Return the car with its images
  return prisma.car.findUnique({
    where: { id: car.id },
    include: { images: true },
  });
}
