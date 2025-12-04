"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CarFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [brand, setBrand] = useState(searchParams.get('brand') || '');
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get('minPrice')) || 0, 
    Number(searchParams.get('maxPrice')) || 500000
  ]);
  const [yearRange, setYearRange] = useState([
    Number(searchParams.get('minYear')) || 1990, 
    Number(searchParams.get('maxYear')) || 2025
  ]);
  const [engineExpanded, setEngineExpanded] = useState(false);
  const [powerRange, setPowerRange] = useState([
    Number(searchParams.get('minPower')) || 50, 
    Number(searchParams.get('maxPower')) || 500
  ]);
  const [capacityRange, setCapacityRange] = useState([
    Number(searchParams.get('minEngineSize')) || 1.0, 
    Number(searchParams.get('maxEngineSize')) || 6.0
  ]);
  
  // Checkbox states
  const [selectedBodyTypes, setSelectedBodyTypes] = useState<string[]>(
    searchParams.get('bodyType')?.split(',').filter(Boolean) || []
  );
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>(
    searchParams.get('fuelType')?.split(',').filter(Boolean) || []
  );
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>(
    searchParams.get('transmission')?.split(',').filter(Boolean) || []
  );

  // Sync state with URL params when they change (e.g. back/forward navigation)
  useEffect(() => {
    setBrand(searchParams.get('brand') || '');
    setPriceRange([
      Number(searchParams.get('minPrice')) || 0, 
      Number(searchParams.get('maxPrice')) || 500000
    ]);
    setYearRange([
      Number(searchParams.get('minYear')) || 1990, 
      Number(searchParams.get('maxYear')) || 2025
    ]);
    setPowerRange([
      Number(searchParams.get('minPower')) || 50, 
      Number(searchParams.get('maxPower')) || 500
    ]);
    setCapacityRange([
      Number(searchParams.get('minEngineSize')) || 1.0, 
      Number(searchParams.get('maxEngineSize')) || 6.0
    ]);
    setSelectedBodyTypes(searchParams.get('bodyType')?.split(',').filter(Boolean) || []);
    setSelectedFuelTypes(searchParams.get('fuelType')?.split(',').filter(Boolean) || []);
    setSelectedTransmissions(searchParams.get('transmission')?.split(',').filter(Boolean) || []);
  }, [searchParams]);

  const handleCheckboxChange = (
    value: string, 
    currentState: string[], 
    setState: (val: string[]) => void
  ) => {
    if (currentState.includes(value)) {
      setState(currentState.filter(item => item !== value));
    } else {
      setState([...currentState, value]);
    }
  };

  const handleApplyFilters = () => {
    // Initialize with existing params to preserve sort order etc.
    const params = new URLSearchParams(searchParams.toString());

    if (brand) params.set('brand', brand); else params.delete('brand');
    
    if (priceRange[0] > 0) params.set('minPrice', priceRange[0].toString()); else params.delete('minPrice');
    if (priceRange[1] < 500000) params.set('maxPrice', priceRange[1].toString()); else params.delete('maxPrice');
    
    if (yearRange[0] > 1990) params.set('minYear', yearRange[0].toString()); else params.delete('minYear');
    if (yearRange[1] < 2025) params.set('maxYear', yearRange[1].toString()); else params.delete('maxYear');
    
    if (powerRange[0] > 50) params.set('minPower', powerRange[0].toString()); else params.delete('minPower');
    if (powerRange[1] < 500) params.set('maxPower', powerRange[1].toString()); else params.delete('maxPower');
    
    if (capacityRange[0] > 1.0) params.set('minEngineSize', capacityRange[0].toString()); else params.delete('minEngineSize');
    if (capacityRange[1] < 6.0) params.set('maxEngineSize', capacityRange[1].toString()); else params.delete('maxEngineSize');

    if (selectedBodyTypes.length > 0) params.set('bodyType', selectedBodyTypes.join(',')); else params.delete('bodyType');
    if (selectedFuelTypes.length > 0) params.set('fuelType', selectedFuelTypes.join(',')); else params.delete('fuelType');
    if (selectedTransmissions.length > 0) params.set('transmission', selectedTransmissions.join(',')); else params.delete('transmission');

    router.push(`/browse?${params.toString()}`);
  };

  const handleReset = () => {
    setBrand('');
    setPriceRange([0, 500000]);
    setYearRange([1990, 2025]);
    setPowerRange([50, 500]);
    setCapacityRange([1.0, 6.0]);
    setSelectedBodyTypes([]);
    setSelectedFuelTypes([]);
    setSelectedTransmissions([]);
    router.push('/browse');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Filter Options</h3>
      
      {/* Brand Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Brand
        </label>
        <select 
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Brands</option>
          <option value="audi">Audi</option>
          <option value="bmw">BMW</option>
          <option value="chevrolet">Chevrolet</option>
          <option value="dodge">Dodge</option>
          <option value="ferrari">Ferrari</option>
          <option value="ford">Ford</option>
          <option value="honda">Honda</option>
          <option value="hyundai">Hyundai</option>
          <option value="jaguar">Jaguar</option>
          <option value="mazda">Mazda</option>
          <option value="mercedes">Mercedes-Benz</option>
          <option value="nissan">Nissan</option>
          <option value="porsche">Porsche</option>
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
          {['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Wagon'].map((type) => (
            <label key={type} className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                checked={selectedBodyTypes.includes(type)}
                onChange={() => handleCheckboxChange(type, selectedBodyTypes, setSelectedBodyTypes)}
                className="rounded text-blue-600 focus:ring-blue-500" 
              />
              <span className="text-sm text-gray-700">{type}</span>
            </label>
          ))}
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
          {['Petrol', 'Diesel', 'Hybrid', 'Electric'].map((type) => (
            <label key={type} className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                checked={selectedFuelTypes.includes(type)}
                onChange={() => handleCheckboxChange(type, selectedFuelTypes, setSelectedFuelTypes)}
                className="rounded text-blue-600 focus:ring-blue-500" 
              />
              <span className="text-sm text-gray-700">{type}</span>
            </label>
          ))}
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
          {['Automatic', 'Manual'].map((type) => (
            <label key={type} className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                checked={selectedTransmissions.includes(type)}
                onChange={() => handleCheckboxChange(type, selectedTransmissions, setSelectedTransmissions)}
                className="rounded text-blue-600 focus:ring-blue-500" 
              />
              <span className="text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button 
          onClick={handleApplyFilters}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition"
        >
          Apply Filters
        </button>
        <button 
          onClick={handleReset}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md font-medium transition"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
