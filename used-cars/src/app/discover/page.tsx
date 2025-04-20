import { Metadata } from 'next';
import CarSwiper from '@/components/CarSwiper';

export const metadata: Metadata = {
  title: 'Car Finder | UsedCars',
  description: 'Discover your perfect car match with our interactive Car Finder tool.',
};

// Sample car data with extended information for the swiper
const cars = [
  {
    id: "1",
    title: "BMW 3 Series 320d M Sport",
    brand: "BMW",
    model: "3 Series",
    year: 2022,
    price: 249000,
    mileage: 15000,
    location: "Warszawa",
    imageUrl: "/images/auction-photos/bmw2022.jpg",
    description: "This stunning BMW 3 Series combines luxury, performance, and efficiency. The M Sport package adds a sporty touch to this executive sedan.",
    features: ["Leather Interior", "Navigation System", "LED Headlights", "Parking Sensors", "Bluetooth", "Climate Control"],
  },
  {
    id: "2",
    title: "Audi A4 2.0 TDI Quattro",
    brand: "Audi",
    model: "A4",
    year: 2021,
    price: 219000,
    mileage: 25000,
    location: "Kraków",
    imageUrl: "/images/auction-photos/audia4.jpg",
    description: "This Audi A4 Quattro offers exceptional handling with its all-wheel drive system and refined interior comfort for a premium driving experience.",
    features: ["All-Wheel Drive", "Virtual Cockpit", "Bang & Olufsen Sound", "Heated Seats", "Parking Camera", "Lane Assist"],
  },
  {
    id: "3",
    title: "Mercedes-Benz C-Class C200",
    brand: "Mercedes-Benz",
    model: "C-Class",
    year: 2023,
    price: 289000,
    mileage: 5000,
    location: "Poznań",
    imageUrl: "/images/auction-photos/cclass.jpg",
    description: "Nearly new Mercedes-Benz C-Class with premium features and elegant design. Experience luxury and cutting-edge technology.",
    features: ["MBUX Infotainment", "Ambient Lighting", "Wireless Charging", "Keyless Entry", "Leather Seats", "Panoramic Roof"],
  },
  {
    id: "4",
    title: "Volkswagen Golf 8 GTI",
    brand: "Volkswagen",
    model: "Golf",
    year: 2022,
    price: 179000,
    mileage: 18000,
    location: "Wrocław",
    imageUrl: "/images/auction-photos/gti2022.jpg",
    description: "The iconic Golf GTI in its latest generation. Combines everyday practicality with exhilarating performance and modern technology.",
    features: ["Digital Cockpit", "Sport Suspension", "LED Matrix Headlights", "Tartan Seats", "Apple CarPlay", "Android Auto"],
  },
  {
    id: "5",
    title: "Toyota RAV4 Hybrid",
    brand: "Toyota",
    model: "RAV4",
    year: 2023,
    price: 199000,
    mileage: 10000,
    location: "Gdańsk",
    imageUrl: "/images/auction-photos/rav4.jpg",
    description: "Efficient and eco-friendly Toyota RAV4 Hybrid SUV. Perfect balance of performance, space, and fuel economy for family adventures.",
    features: ["Hybrid Powertrain", "Toyota Safety Sense", "AWD System", "JBL Sound System", "Heated Seats", "Power Tailgate"],
  },
  {
    id: "6",
    title: "Mazda CX-5 Skyactiv-G",
    brand: "Mazda",
    model: "CX-5",
    year: 2022,
    price: 169000,
    mileage: 20000,
    location: "Łódź",
    imageUrl: "/images/auction-photos/cx5.jpg",
    description: "Elegant and dynamic Mazda CX-5 with premium feel. Known for its responsive handling and beautiful design inside and out.",
    features: ["Bose Sound System", "Head-Up Display", "Leather Interior", "Blind Spot Monitoring", "Sunroof", "Heated Steering Wheel"],
  },
];

export default function DiscoverPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Car Finder</h1>
          <p className="text-xl text-gray-600">
            Swipe right on cars you like, left on those you don&apos;t. We&apos;ll help you find your perfect match!
          </p>
        </div>
        
        <div className="flex justify-center">
          <CarSwiper cars={cars} />
        </div>
        
        <div className="mt-16 max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">How It Works</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 rounded-full p-3">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-800">Discover Cars</h3>
                  <p className="mt-1 text-gray-600">Browse through our curated selection of quality used vehicles that match your preferences.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 rounded-full p-3">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-800">Like or Pass</h3>
                  <p className="mt-1 text-gray-600">Swipe right on cars you&apos;re interested in, or left to skip and see the next option.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 rounded-full p-3">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-800">Schedule a Test Drive</h3>
                  <p className="mt-1 text-gray-600">Once you find a car you love, easily schedule a test drive with just a few clicks.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
