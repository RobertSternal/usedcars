import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Car Details | UsedCars',
  description: 'View detailed information about this vehicle.',
};

// Sample car data with extended information
const carsData = [
  {
    id: "1",
    title: "BMW 3 Series 320d M Sport",
    brand: "BMW",
    model: "3 Series",
    variant: "320d M Sport",
    year: 2022,
    price: 249000,
    mileage: 15000,
    location: "Warszawa",
    seller: {
      name: "Premium Auto",
      type: "Dealer",
      rating: 4.8,
      phone: "+48 123 456 789",
    },
    engine: {
      type: "Diesel",
      capacity: "2.0L",
      power: "190 HP",
      transmission: "Automatic",
      drive: "Rear-wheel drive",
    },
    exteriorColor: "Alpine White",
    interiorColor: "Black Leather",
    vin: "WBA8E9C55GK123456",
    registration: "WA12345",
    description: "This stunning BMW 3 Series combines luxury, performance, and efficiency. The M Sport package adds a sporty touch to this executive sedan. The car is in excellent condition with full service history and one previous owner. Features include leather interior, navigation system, LED headlights, and much more.",
    features: [
      "Leather Interior",
      "Navigation System",
      "LED Headlights",
      "Parking Sensors",
      "Bluetooth",
      "Climate Control",
      "Heated Seats",
      "Alloy Wheels",
      "Cruise Control",
      "Start/Stop System",
      "Keyless Entry",
      "Digital Dashboard",
    ],
    images: [
      "/cars/bmw-3.jpg",
      "/cars/bmw-3-interior.jpg",
      "/cars/bmw-3-back.jpg",
      "/cars/bmw-3-side.jpg",
      "/cars/bmw-3-engine.jpg",
    ],
    listedDate: "2025-04-10",
  },
  {
    id: "2",
    title: "Audi A4 2.0 TDI Quattro",
    brand: "Audi",
    model: "A4",
    variant: "2.0 TDI Quattro",
    year: 2021,
    price: 219000,
    mileage: 25000,
    location: "Kraków",
    seller: {
      name: "AutoMax",
      type: "Dealer",
      rating: 4.6,
      phone: "+48 987 654 321",
    },
    engine: {
      type: "Diesel",
      capacity: "2.0L",
      power: "204 HP",
      transmission: "Automatic",
      drive: "All-wheel drive (Quattro)",
    },
    exteriorColor: "Glacier White",
    interiorColor: "Brown Leather",
    vin: "WAUZZZ8K9MA123456",
    registration: "KR54321",
    description: "This Audi A4 Quattro offers exceptional handling with its all-wheel drive system and refined interior comfort for a premium driving experience. The car comes with a comprehensive service history and has been meticulously maintained by its previous owner.",
    features: [
      "All-Wheel Drive",
      "Virtual Cockpit",
      "Bang & Olufsen Sound",
      "Heated Seats",
      "Parking Camera",
      "Lane Assist",
      "Adaptive Cruise Control",
      "Matrix LED Headlights",
      "Panoramic Sunroof",
      "Wireless Charging",
      "Ambient Lighting",
      "Sport Suspension",
    ],
    images: [
      "/cars/audi-a4.jpg",
      "/cars/audi-a4-interior.jpg",
      "/cars/audi-a4-back.jpg",
      "/cars/audi-a4-side.jpg",
      "/cars/audi-a4-engine.jpg",
    ],
    listedDate: "2025-04-08",
  },
];

export default function CarDetailPage({ params }: { params: { id: string } }) {
  // In a real application, you would fetch this data from an API
  const car = carsData.find((car) => car.id === params.id) || carsData[0];
  
  return (
    <div className="bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <nav className="flex text-sm">
            <Link href="/" className="text-gray-500 hover:text-blue-600">Home</Link>
            <span className="mx-2 text-gray-500">/</span>
            <Link href="/browse" className="text-gray-500 hover:text-blue-600">Browse</Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-900 font-medium">{car.title}</span>
          </nav>
        </div>
        
        {/* Car Title and Price */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{car.title}</h1>
            <p className="text-gray-600">
              {car.year} • {car.mileage.toLocaleString()} km • {car.engine.type} • {car.location}
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
                  src={car.images[0]}
                  alt={car.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            
            {/* Thumbnail Images */}
            <div className="grid grid-cols-5 gap-3 mb-8">
              {car.images.map((image, index) => (
                <div 
                  key={index} 
                  className="relative h-20 bg-white rounded-md overflow-hidden cursor-pointer border-2 border-transparent hover:border-blue-500 transition"
                >
                  <Image
                    src={image}
                    alt={`${car.title} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
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
                      <li className="flex justify-between">
                        <span className="text-gray-600">Brand:</span>
                        <span className="font-medium text-gray-800">{car.brand}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Model:</span>
                        <span className="font-medium text-gray-800">{car.model}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Variant:</span>
                        <span className="font-medium text-gray-800">{car.variant}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Year:</span>
                        <span className="font-medium text-gray-800">{car.year}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Mileage:</span>
                        <span className="font-medium text-gray-800">{car.mileage.toLocaleString()} km</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Exterior Color:</span>
                        <span className="font-medium text-gray-800">{car.exteriorColor}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Interior Color:</span>
                        <span className="font-medium text-gray-800">{car.interiorColor}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Engine & Performance</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-gray-600">Fuel Type:</span>
                        <span className="font-medium text-gray-800">{car.engine.type}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Engine Capacity:</span>
                        <span className="font-medium text-gray-800">{car.engine.capacity}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Power:</span>
                        <span className="font-medium text-gray-800">{car.engine.power}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Transmission:</span>
                        <span className="font-medium text-gray-800">{car.engine.transmission}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Drive Type:</span>
                        <span className="font-medium text-gray-800">{car.engine.drive}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">VIN:</span>
                        <span className="font-medium text-gray-800">{car.vin}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Registration:</span>
                        <span className="font-medium text-gray-800">{car.registration}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Features */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Features & Equipment</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3">
                  {car.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
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
                    {car.seller.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{car.seller.name}</h3>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">{car.seller.type}</span>
                      <div className="flex items-center">
                        <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm text-gray-600 ml-1">{car.seller.rating}/5</span>
                      </div>
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
              <p className="text-gray-600">
                Listed on {new Date(car.listedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
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
        
        {/* Similar Cars */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Similar Cars You Might Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {carsData.map((similarCar) => (
              <div key={similarCar.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="relative h-48 w-full">
                  <Image
                    src={similarCar.images[0]}
                    alt={similarCar.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded text-sm font-bold">
                    {new Intl.NumberFormat('pl-PL', {
                      style: 'currency',
                      currency: 'PLN',
                      maximumFractionDigits: 0,
                    }).format(similarCar.price)}
                  </div>
                </div>
                <div className="p-4">
                  <Link href={`/cars/${similarCar.id}`}>
                    <h3 className="text-lg font-bold text-gray-800 hover:text-blue-600 transition mb-1 truncate">
                      {similarCar.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 text-sm mb-2">{similarCar.year} • {similarCar.mileage.toLocaleString()} km</p>
                  <Link 
                    href={`/cars/${similarCar.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
