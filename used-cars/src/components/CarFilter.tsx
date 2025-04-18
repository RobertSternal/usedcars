"use client";

import { useState } from 'react';

export default function CarFilter() {
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [yearRange, setYearRange] = useState([1990, 2025]);
  const [engineExpanded, setEngineExpanded] = useState(false);
  const [powerRange, setPowerRange] = useState([50, 500]);
  const [capacityRange, setCapacityRange] = useState([1.0, 6.0]);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Filter Options</h3>
      
      {/* Brand Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Brand
        </label>
        <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
          <option value="">All Brands</option>
          <option value="audi">Audi</option>
          <option value="bmw">BMW</option>
          <option value="ford">Ford</option>
          <option value="honda">Honda</option>
          <option value="hyundai">Hyundai</option>
          <option value="mazda">Mazda</option>
          <option value="mercedes">Mercedes-Benz</option>
          <option value="nissan">Nissan</option>
          <option value="toyota">Toyota</option>
          <option value="volkswagen">Volkswagen</option>
        </select>
      </div>
      
      {/* Body Type Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Body Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
            <span className="text-sm text-gray-700">Sedan</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
            <span className="text-sm text-gray-700">SUV</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
            <span className="text-sm text-gray-700">Hatchback</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
            <span className="text-sm text-gray-700">Coupe</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
            <span className="text-sm text-gray-700">Convertible</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
            <span className="text-sm text-gray-700">Wagon</span>
          </label>
        </div>
      </div>
      
      {/* Price Range Filter */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Price Range
          </label>
          <span className="text-sm text-gray-500">
            {priceRange[0].toLocaleString()} zł - {priceRange[1].toLocaleString()} zł
          </span>
        </div>
        <div className="flex space-x-4">
          <input
            type="range"
            min="0"
            max="500000"
            step="10000"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
            className="w-full"
          />
          <input
            type="range"
            min="0"
            max="500000"
            step="10000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full"
          />
        </div>
      </div>
      
      {/* Year Range Filter */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Year Range
          </label>
          <span className="text-sm text-gray-500">
            {yearRange[0]} - {yearRange[1]}
          </span>
        </div>
        <div className="flex space-x-4">
          <input
            type="range"
            min="1990"
            max="2025"
            step="1"
            value={yearRange[0]}
            onChange={(e) => setYearRange([parseInt(e.target.value), yearRange[1]])}
            className="w-full"
          />
          <input
            type="range"
            min="1990"
            max="2025"
            step="1"
            value={yearRange[1]}
            onChange={(e) => setYearRange([yearRange[0], parseInt(e.target.value)])}
            className="w-full"
          />
        </div>
      </div>
      
      {/* Fuel Type Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fuel Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
            <span className="text-sm text-gray-700">Petrol</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
            <span className="text-sm text-gray-700">Diesel</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
            <span className="text-sm text-gray-700">Hybrid</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
            <span className="text-sm text-gray-700">Electric</span>
          </label>
        </div>
      </div>
      
      {/* Engine Section - Collapsible */}
      <div className="mb-6">
        <button 
          onClick={() => setEngineExpanded(!engineExpanded)}
          className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 mb-2 hover:text-blue-600 focus:outline-none"
        >
          <span>Engine</span>
          {engineExpanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
        
        {engineExpanded && (
          <div className="pt-2 pb-4 space-y-4 border-t border-gray-200">
            {/* Engine Power Filter */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Power (HP)
                </label>
                <span className="text-sm text-gray-500">
                  {powerRange[0]} HP - {powerRange[1]} HP
                </span>
              </div>
              <div className="flex space-x-4">
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="10"
                  value={powerRange[0]}
                  onChange={(e) => setPowerRange([parseInt(e.target.value), powerRange[1]])}
                  className="w-full"
                />
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="10"
                  value={powerRange[1]}
                  onChange={(e) => setPowerRange([powerRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>
            </div>
            
            {/* Engine Capacity Filter */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Capacity (L)
                </label>
                <span className="text-sm text-gray-500">
                  {capacityRange[0].toFixed(1)} L - {capacityRange[1].toFixed(1)} L
                </span>
              </div>
              <div className="flex space-x-4">
                <input
                  type="range"
                  min="1.0"
                  max="6.0"
                  step="0.1"
                  value={capacityRange[0]}
                  onChange={(e) => setCapacityRange([parseFloat(e.target.value), capacityRange[1]])}
                  className="w-full"
                />
                <input
                  type="range"
                  min="1.0"
                  max="6.0"
                  step="0.1"
                  value={capacityRange[1]}
                  onChange={(e) => setCapacityRange([capacityRange[0], parseFloat(e.target.value)])}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Transmission Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Transmission
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
            <span className="text-sm text-gray-700">Automatic</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
            <span className="text-sm text-gray-700">Manual</span>
          </label>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition">
          Apply Filters
        </button>
        <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md font-medium transition">
          Reset
        </button>
      </div>
    </div>
  );
}
