'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';

interface User {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  profileImage: string | null;
  role: string;
}

interface CarImage {
  id: string;
  url: string;
  isPrimary: boolean;
  carId: string;
}

interface Car {
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
  location: string;
  description: string;
  status: string;
  createdAt: string;
  images: CarImage[];
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCars, setLoadingCars] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (!token || !storedUser) {
      router.push('/signin');
      return;
    }

    try {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      // Fetch user's car listings
      fetchUserCars(userData.id);
    } catch (error) {
      console.error('Failed to parse user data:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/signin');
    } finally {
      setLoading(false);
    }
  }, [router]);
  
  const fetchUserCars = async (userId: string) => {
    try {
      setLoadingCars(true);
      const response = await fetch(`/api/cars?sellerId=${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch car listings');
      }
      
      const data = await response.json();
      setCars(data);
    } catch (error) {
      console.error('Error fetching car listings:', error);
    } finally {
      setLoadingCars(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-blue-600 h-2 w-full"></div>
        
        <div className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              {user?.profileImage ? (
                <Image 
                  src={user.profileImage} 
                  alt={user?.name || 'User'} 
                  width={96}
                  height={96}
                  className="rounded-full object-cover"
                />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{user?.name || 'User'}</h1>
              <p className="text-gray-600">{user?.email}</p>
              {user?.phone && <p className="text-gray-600">{user.phone}</p>}
              <p className="text-sm text-gray-500 mt-1 capitalize">{user?.role || 'User'}</p>
            </div>
            
            <button 
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
          
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">My Car Listings</h2>
            
            {loadingCars ? (
              <div className="bg-gray-50 rounded-lg p-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : cars.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
                <p className="text-gray-600 mb-4">You don&apos;t have any car listings yet.</p>
                <Link href="/sell" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Sell Your Car
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cars.map((car) => (
                  <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                    <div className="relative h-48 bg-gray-200">
                      {car.images && car.images.length > 0 ? (
                        <Image 
                          src={car.images[0].url} 
                          alt={car.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 text-xs font-semibold rounded">
                        {car.status}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{car.title}</h3>
                      <div className="flex justify-between mb-2">
                        <span className="text-blue-600 font-bold">{formatCurrency(car.price)}</span>
                        <span className="text-gray-600 text-sm">{car.mileage.toLocaleString()} km</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">{car.year}</span>
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded capitalize">{car.fuelType}</span>
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded capitalize">{car.transmission}</span>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-gray-600 text-sm">{new Date(car.createdAt).toLocaleDateString()}</span>
                        <Link href={`/cars/${car.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {cars.length > 0 && (
              <div className="mt-6 text-center">
                <Link href="/sell" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Sell Another Car
                </Link>
              </div>
            )}
          </div>
          
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Favorite Cars</h2>
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <p className="text-gray-600 mb-4">You haven&apos;t saved any favorite cars yet.</p>
              <Link href="/browse" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Browse Cars
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
