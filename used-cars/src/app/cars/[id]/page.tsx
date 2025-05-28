import type { Metadata } from 'next/types';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Car Details | UsedCars',
  description: 'View detailed information about this vehicle.',
};

// Define the car data type
interface CarImage {
  id: string;
  url: string;
  isPrimary: boolean;
  carId: string;
}

interface Seller {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  profileImage: string | null;
  // For display purposes
  type?: string;
  rating?: number;
}

// Interfejs dla danych z bazy danych
interface DbCar {
  id: string;
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
  engineSize: string | number | null;
  power: string | number | null;
  doors: number | null;
  seats: number | null;
  features: string | null;
  sellerNotes: string | null;
  status: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  sellerId: string;
  seller: Seller;
  images: CarImage[];
}

// Interfejs dla danych wyświetlanych w UI
interface Car extends DbCar {
  // Additional properties for display
  exteriorColor: string;
  interiorColor: string;
  engine: {
    type: string;
    capacity: string;
    power: string;
    transmission: string;
    drive: string;
  };
  listedDate: string;
  vin?: string;
  registration?: string;
}

// Importuj Prisma bezpośrednio w komponencie strony
import prisma from '@/lib/prisma';

// Function to fetch car data directly using Prisma
async function getCarData(id: string): Promise<Car | null> {
  try {
    // Użyj bezpośrednio Prisma zamiast API route
    const dbCar = await prisma.car.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            profileImage: true,
          },
        },
        images: true,
      },
    });

    if (!dbCar) {
      return null;
    }
    
    // Konwertuj dane z bazy danych na format UI
    const car: Car = {
      ...dbCar,
      exteriorColor: dbCar.color,
      interiorColor: 'Not specified',
      engine: {
        type: dbCar.fuelType || '',
        capacity: String(dbCar.engineSize || ''),
        power: String(dbCar.power || ''),
        transmission: dbCar.transmission || '',
        drive: dbCar.bodyType?.includes('4x4') ? 'All-wheel drive' : 'Front-wheel drive'
      },
      listedDate: new Date(dbCar.createdAt).toISOString().split('T')[0]
    };
    
    return car;
  } catch (error) {
    console.error('Error fetching car data:', error);
    return null;
  }
}

// Disable ESLint for this specific case to avoid TypeScript issues with Next.js 15
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function CarDetailPage(props: any) {
  // Extract id from params
  const paramId = props.params?.id || '1';
  
  // Fetch car data from the API
  const car = await getCarData(paramId);
  
  // If car data couldn't be fetched, show a 404 page
  if (!car) {
    notFound();
  }
  
  // Parse features if they exist
  const parsedFeatures = car.features ? JSON.parse(car.features) as string[] : [];
  
  // Set seller defaults if missing
  if (!car.seller.type) {
    car.seller.type = 'Private Seller';
  }
  
  if (!car.seller.rating) {
    car.seller.rating = 5.0;
  }
  
  // Ensure car has a variant property or use model as fallback
  const variant = car.model;
  
  // Default image if no images are available
  const defaultImage = '/cars/default-car.jpg';
  
  // Get the primary image or the first image or default
  const primaryImage = car.images.length > 0 
    ? (car.images.find(img => img.isPrimary)?.url || car.images[0].url) 
    : defaultImage;
  
  return (
    <div className="bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <nav className="flex text-sm">
            <Link href="/usedcars/" className="text-gray-500 hover:text-blue-600">Home</Link>
            <span className="mx-2 text-gray-500">/</span>
            <Link href="/usedcars/browse" className="text-gray-500 hover:text-blue-600">Browse</Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-900 font-medium">{car.title}</span>
          </nav>
        </div>
        
        {/* Car Title and Price */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{car.title}</h1>
            <p className="text-gray-600">
              {car.year} • {car.mileage.toLocaleString()} km • {car.engine?.type || car.fuelType} • {car.location}
            </p>
          </div>
          <div className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg text-2xl font-bold">
            {new Intl.NumberFormat('pl-PL', {
              style: 'currency',
              currency: 'PLN',
              maximumFractionDigits: 0,
            }).format(car.price)}
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="relative h-[400px] w-full">
                <Image
                  src={primaryImage}
                  alt={car.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            
            {/* Thumbnail Images */}
            <div className="grid grid-cols-5 gap-3 mb-8">
              {car.images.length > 0 ? (
                car.images.map((image, index) => (
                  <div 
                    key={index} 
                    className="relative h-20 bg-white rounded-md overflow-hidden cursor-pointer border-2 border-transparent hover:border-blue-500 transition"
                  >
                    <Image
                      src={image.url}
                      alt={`${car.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))
              ) : (
                <div className="relative h-20 bg-white rounded-md overflow-hidden">
                  <Image
                    src={defaultImage}
                    alt="No image available"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
            
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  <button className="px-6 py-4 text-blue-600 border-b-2 border-blue-600 font-medium">
                    Overview
                  </button>
                  <button className="px-6 py-4 text-gray-500 hover:text-gray-700 font-medium">
                    Features
                  </button>
                  <button className="px-6 py-4 text-gray-500 hover:text-gray-700 font-medium">
                    Technical Specs
                  </button>
                </nav>
              </div>
              
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Description</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {car.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Vehicle Details</h3>
                    <ul className="space-y-2">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <div>
                          <span className="text-gray-500">Brand</span>
                          <p className="font-medium">{car.brand}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Model</span>
                          <p className="font-medium">{car.model}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Variant</span>
                          <p className="font-medium">{variant}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Year</span>
                          <p className="font-medium">{car.year}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Mileage</span>
                          <p className="font-medium">{car.mileage.toLocaleString()} km</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Exterior Color</span>
                          <p className="font-medium">{car.exteriorColor || car.color}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Interior Color</span>
                          <p className="font-medium">{car.interiorColor || 'Not specified'}</p>
                        </div>
                      </div>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Engine & Performance</h3>
                    <ul className="space-y-2">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <div>
                          <span className="text-gray-500">Engine Type</span>
                          <p className="font-medium">{car.engine?.type || car.fuelType}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Engine Capacity</span>
                          <p className="font-medium">{car.engine?.capacity || car.engineSize}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Engine Power</span>
                          <p className="font-medium">{car.engine?.power || car.power}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Transmission</span>
                          <p className="font-medium">{car.engine?.transmission || car.transmission}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Drive</span>
                          <p className="font-medium">{car.engine?.drive || (car.bodyType.includes('4x4') ? 'All-wheel drive' : 'Front-wheel drive')}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">VIN</span>
                          <p className="font-medium">{car.vin || 'Not available'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Registration</span>
                          <p className="font-medium">{car.registration || 'Not available'}</p>
                        </div>
                      </div>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Features */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Features & Equipment</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  {parsedFeatures.length > 0 ? (
                    parsedFeatures.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{feature}</span>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-gray-500">No features listed</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Contact and Similar Cars */}
          <div>
            {/* Seller Information */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Seller Information</h2>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-bold text-xl mr-4">
                    {car.seller.name ? car.seller.name.charAt(0) : 'S'}
                  </div>
                  <div>
                    <p className="text-gray-700 mb-1">{car.seller.type || 'Private Seller'}</p>
                    <div className="flex items-center mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-4 h-4 ${i < Math.floor(car.seller.rating || 5) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-gray-700 ml-1">{(car.seller.rating || 5).toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center text-gray-600 mb-2">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{car.seller.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{car.location}</span>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-3">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition flex justify-center items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call Seller
                  </button>
                  <button className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-lg font-medium transition flex justify-center items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Message Seller
                  </button>
                  <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg font-medium transition flex justify-center items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Schedule Test Drive
                  </button>
                </div>
              </div>
            </div>
            
            {/* Safety Tips */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-yellow-800 mb-2 flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Safety Tips
              </h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Always meet in a public place for viewing</li>
                <li>• Test drive only after verifying seller&apos;s identity</li>
                <li>• Verify vehicle documents before purchase</li>
                <li>• Never send money in advance</li>
              </ul>
            </div>
            
            {/* Listed Date */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 p-4 text-center">
              <p className="text-gray-700 mb-4">
                Listed on {new Date(car.listedDate || car.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            
            {/* Actions */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 p-4">
              <div className="flex justify-between">
                <button className="flex items-center text-gray-600 hover:text-blue-600">
                  <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
                <button className="flex items-center text-gray-600 hover:text-red-600">
                  <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Save
                </button>
                <button className="flex items-center text-gray-600 hover:text-yellow-600">
                  <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Report
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Similar Cars section removed - will be implemented later */}
      </div>
    </div>
  );
}
