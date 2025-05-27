"use client";

import { useState } from 'react';
import Image from 'next/image';
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
  imageUrl: string;
  description: string;
  features: string[];
}

interface CarSwiperProps {
  cars: Car[];
}

export default function CarSwiper({ cars }: CarSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [liked, setLiked] = useState<string[]>([]);
  
  const currentCar = cars[currentIndex];
  
  const handleLike = () => {
    setDirection('right');
    setLiked([...liked, currentCar.id]);
    
    setTimeout(() => {
      setDirection(null);
      if (currentIndex < cars.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }, 500);
  };
  
  const handleDislike = () => {
    setDirection('left');
    
    setTimeout(() => {
      setDirection(null);
      if (currentIndex < cars.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }, 500);
  };
  
  if (cars.length === 0 || currentIndex >= cars.length) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-white rounded-lg shadow-lg p-8">
        <svg className="w-24 h-24 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">No more cars to show</h3>
        <p className="text-gray-600 text-center mb-6">You&apos;ve seen all available cars matching your preferences.</p>
        <div className="flex space-x-4">
          <button 
            onClick={() => {
              setCurrentIndex(0);
              setLiked([]);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Start Over
          </button>
          <Link 
            href="/browse" 
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium transition"
          >
            Browse All Cars
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative h-[600px] w-full max-w-md mx-auto">
      <div 
        className={`absolute inset-0 bg-white rounded-xl shadow-xl overflow-hidden transition-transform duration-500 ${
          direction === 'left' 
            ? 'translate-x-[-150%] rotate-[-30deg]' 
            : direction === 'right' 
            ? 'translate-x-[150%] rotate-[30deg]' 
            : ''
        }`}
      >
        <div className="relative h-[300px] w-full">
          <Image
            src={currentCar.imageUrl}
            alt={`${currentCar.year} ${currentCar.brand} ${currentCar.model}`}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-lg font-bold">
            {new Intl.NumberFormat('pl-PL', {
              style: 'currency',
              currency: 'PLN',
              maximumFractionDigits: 0,
            }).format(currentCar.price)}
          </div>
        </div>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {currentCar.title}
          </h2>
          
          <div className="flex justify-between text-lg text-gray-600 mb-4">
            <span>{currentCar.year} • {currentCar.brand} {currentCar.model}</span>
            <span>{currentCar.mileage.toLocaleString()} km</span>
          </div>
          
          <p className="text-gray-600 mb-4">{currentCar.description}</p>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Key Features</h3>
            <div className="grid grid-cols-2 gap-2">
              {currentCar.features.map((feature, index) => (
                <div key={index} className="flex items-center text-gray-600">
                  <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center text-gray-600 mb-6">
            <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{currentCar.location}</span>
          </div>
          
          <Link 
            href={`/cars/${currentCar.id}`}
            className="block w-full bg-gray-100 hover:bg-gray-200 text-center text-gray-800 py-3 rounded-lg font-medium transition"
          >
            View Full Details
          </Link>
        </div>
      </div>
      
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-8">
        <button 
          onClick={handleDislike}
          className="bg-white p-5 rounded-full shadow-lg hover:bg-gray-100 transition"
        >
          <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <button 
          onClick={handleLike}
          className="bg-white p-5 rounded-full shadow-lg hover:bg-gray-100 transition"
        >
          <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      
      <div className="absolute top-4 left-0 right-0 flex justify-center">
        <div className="bg-white px-4 py-2 rounded-full shadow-md">
          <span className="font-medium text-gray-800">
            {currentIndex + 1} of {cars.length}
          </span>
        </div>
      </div>
    </div>
  );
}
