'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CarSwiper from '@/components/CarSwiper';
import Link from 'next/link';

interface Car {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  location: string;
  fuelType: string;
  transmission: string;
  bodyType: string;
  power?: number;
  imageUrl: string;
  description: string;
  features: string[];
}

interface UserPreferences {
  minPrice?: number;
  maxPrice?: number;
  preferredBrands: string[];
  dislikedBrands: string[];
  preferredBodyTypes: string[];
  preferredFuelTypes: string[];
  preferredTransmission?: string;
  minYear?: number;
  maxYear?: number;
  maxMileage?: number;
  minPower?: number;
  maxPower?: number;
  preferredLocations: string[];
  maxDistanceKm?: number;
}

export default function DiscoverPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
      await loadCarsWithoutPreferences();
      return;
    }

    setIsLoggedIn(true);
    await Promise.all([
      loadUserPreferences(token),
      loadCars(token)
    ]);
  };

  const loadUserPreferences = async (token: string) => {
    try {
      const response = await fetch('/usedcars/api/preferences', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const prefs = await response.json();
        setPreferences(prefs);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const loadCars = async (token: string) => {
    try {
      const response = await fetch('/usedcars/api/cars/recommended', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const carsData = await response.json();
        setCars(carsData);
      }
    } catch (error) {
      console.error('Error loading cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCarsWithoutPreferences = async () => {
    try {
      const response = await fetch('/usedcars/api/cars/recommended');
      if (response.ok) {
        const carsData = await response.json();
        setCars(carsData);
        setFilteredCars(carsData);
      }
    } catch (error) {
      console.error('Error loading cars:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cars.length > 0 && preferences) {
      const filtered = filterCarsByPreferences(cars, preferences);
      setFilteredCars(filtered);
    } else {
      setFilteredCars(cars);
    }
  }, [cars, preferences]);

  const filterCarsByPreferences = (cars: Car[], prefs: UserPreferences): Car[] => {
    return cars.filter(car => {
      // Budget filter
      if (prefs.minPrice && car.price < prefs.minPrice) return false;
      if (prefs.maxPrice && car.price > prefs.maxPrice) return false;

      // Brand filter
      if (prefs.dislikedBrands.length > 0 && prefs.dislikedBrands.includes(car.brand)) return false;
      if (prefs.preferredBrands.length > 0 && !prefs.preferredBrands.includes(car.brand)) return false;

      // Body type filter
      if (prefs.preferredBodyTypes.length > 0 && !prefs.preferredBodyTypes.includes(car.bodyType)) return false;

      // Fuel type filter
      if (prefs.preferredFuelTypes.length > 0 && !prefs.preferredFuelTypes.includes(car.fuelType)) return false;

      // Transmission filter
      if (prefs.preferredTransmission && prefs.preferredTransmission !== 'ANY' && car.transmission !== prefs.preferredTransmission) return false;

      // Year filter
      if (prefs.minYear && car.year < prefs.minYear) return false;
      if (prefs.maxYear && car.year > prefs.maxYear) return false;

      // Mileage filter
      if (prefs.maxMileage && car.mileage > prefs.maxMileage) return false;

      // Power filter
      if (prefs.minPower && car.power && car.power < prefs.minPower) return false;
      if (prefs.maxPower && car.power && car.power > prefs.maxPower) return false;

      // Location filter
      if (prefs.preferredLocations.length > 0 && !prefs.preferredLocations.includes(car.location)) return false;

      return true;
    });
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading personalized recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Car Finder</h1>
          <p className="text-xl text-gray-600">
            {isLoggedIn 
              ? "Personalized recommendations based on your preferences. Swipe right on cars you like!"
              : "Swipe right on cars you like, left on those you don't. Sign in for personalized recommendations!"
            }
          </p>
          
          {isLoggedIn && (
            <div className="mt-4 flex justify-center space-x-4">
              <Link
                href="/preferences"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm"
              >
                Update Preferences
              </Link>
              <div className="text-sm text-gray-600 bg-white px-4 py-2 rounded-md border">
                Showing {filteredCars.length} cars matching your preferences
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-center">
          <CarSwiper cars={filteredCars} />
        </div>
        
        <div className="mt-16 max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">How It Works</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 rounded-full p-3">
                  <svg className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  <svg className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  <svg className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
