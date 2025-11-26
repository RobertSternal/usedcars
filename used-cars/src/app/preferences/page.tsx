'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

const brands = ['BMW', 'Audi', 'Mercedes-Benz', 'Volkswagen', 'Toyota', 'Honda', 'Ford', 'Opel', 'Skoda', 'Hyundai', 'Kia', 'Nissan', 'Mazda', 'Volvo', 'Peugeot', 'Renault'];
const bodyTypes = ['SEDAN', 'HATCHBACK', 'SUV', 'COUPE', 'CONVERTIBLE', 'WAGON', 'VAN', 'TRUCK'];
const fuelTypes = ['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID', 'LPG'];
const transmissionTypes = ['ANY', 'MANUAL', 'AUTOMATIC', 'SEMI_AUTOMATIC'];
const locations = ['Warszawa', 'Kraków', 'Gdańsk', 'Wrocław', 'Poznań', 'Łódź', 'Katowice', 'Lublin', 'Białystok', 'Szczecin'];

export default function PreferencesPage() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    preferredBrands: [],
    dislikedBrands: [],
    preferredBodyTypes: [],
    preferredFuelTypes: [],
    preferredTransmission: 'ANY',
    preferredLocations: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          // Middleware will handle redirect
          setLoading(false);
          return;
        }

        // Load preferences from localStorage
        const savedPreferences = localStorage.getItem('userPreferences');
        if (savedPreferences) {
          setPreferences(JSON.parse(savedPreferences));
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [router]);

  const savePreferences = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Please sign in to save preferences');
        setSaving(false);
        return;
      }

      const response = await fetch('/usedcars/api/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(preferences)
      });

      if (response.ok) {
        setMessage('Preferences saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error saving preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      setMessage('Error saving preferences');
    } finally {
      setSaving(false);
    }
  };

  const toggleArrayItem = (array: string[], item: string, setter: (newArray: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Car Preferences</h1>
          
          {message && (
            <div className={`mb-6 p-4 rounded-md ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message}
            </div>
          )}

          {/* Budget Preferences */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Budget</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Price (PLN)</label>
                <input
                  type="number"
                  value={preferences.minPrice || ''}
                  onChange={(e) => setPreferences({...preferences, minPrice: e.target.value ? Number(e.target.value) : undefined})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 50000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Price (PLN)</label>
                <input
                  type="number"
                  value={preferences.maxPrice || ''}
                  onChange={(e) => setPreferences({...preferences, maxPrice: e.target.value ? Number(e.target.value) : undefined})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 300000"
                />
              </div>
            </div>
          </div>

          {/* Brand Preferences */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Brand Preferences</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Preferred Brands</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {brands.map(brand => (
                  <button
                    key={brand}
                    onClick={() => toggleArrayItem(preferences.preferredBrands, brand, (newArray) => 
                      setPreferences({...preferences, preferredBrands: newArray})
                    )}
                    className={`p-2 rounded-md border text-sm font-medium transition ${
                      preferences.preferredBrands.includes(brand)
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Brands to Avoid</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {brands.map(brand => (
                  <button
                    key={brand}
                    onClick={() => toggleArrayItem(preferences.dislikedBrands, brand, (newArray) => 
                      setPreferences({...preferences, dislikedBrands: newArray})
                    )}
                    className={`p-2 rounded-md border text-sm font-medium transition ${
                      preferences.dislikedBrands.includes(brand)
                        ? 'bg-red-100 border-red-500 text-red-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Car Type Preferences */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Car Type Preferences</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Preferred Body Types</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {bodyTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => toggleArrayItem(preferences.preferredBodyTypes, type, (newArray) => 
                      setPreferences({...preferences, preferredBodyTypes: newArray})
                    )}
                    className={`p-2 rounded-md border text-sm font-medium transition ${
                      preferences.preferredBodyTypes.includes(type)
                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Preferred Fuel Types</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {fuelTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => toggleArrayItem(preferences.preferredFuelTypes, type, (newArray) => 
                      setPreferences({...preferences, preferredFuelTypes: newArray})
                    )}
                    className={`p-2 rounded-md border text-sm font-medium transition ${
                      preferences.preferredFuelTypes.includes(type)
                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Transmission</h3>
              <select
                value={preferences.preferredTransmission || 'ANY'}
                onChange={(e) => setPreferences({...preferences, preferredTransmission: e.target.value})}
                className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {transmissionTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Technical Preferences */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Technical Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Year</label>
                <input
                  type="number"
                  value={preferences.minYear || ''}
                  onChange={(e) => setPreferences({...preferences, minYear: e.target.value ? Number(e.target.value) : undefined})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 2018"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Year</label>
                <input
                  type="number"
                  value={preferences.maxYear || ''}
                  onChange={(e) => setPreferences({...preferences, maxYear: e.target.value ? Number(e.target.value) : undefined})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 2024"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Mileage (km)</label>
                <input
                  type="number"
                  value={preferences.maxMileage || ''}
                  onChange={(e) => setPreferences({...preferences, maxMileage: e.target.value ? Number(e.target.value) : undefined})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 100000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Power (HP)</label>
                <input
                  type="number"
                  value={preferences.minPower || ''}
                  onChange={(e) => setPreferences({...preferences, minPower: e.target.value ? Number(e.target.value) : undefined})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 150"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Power (HP)</label>
                <input
                  type="number"
                  value={preferences.maxPower || ''}
                  onChange={(e) => setPreferences({...preferences, maxPower: e.target.value ? Number(e.target.value) : undefined})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 400"
                />
              </div>
            </div>
          </div>

          {/* Location Preferences */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Location Preferences</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Preferred Locations</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {locations.map(location => (
                  <button
                    key={location}
                    onClick={() => toggleArrayItem(preferences.preferredLocations, location, (newArray) => 
                      setPreferences({...preferences, preferredLocations: newArray})
                    )}
                    className={`p-2 rounded-md border text-sm font-medium transition ${
                      preferences.preferredLocations.includes(location)
                        ? 'bg-purple-100 border-purple-500 text-purple-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Distance (km)</label>
              <input
                type="number"
                value={preferences.maxDistanceKm || ''}
                onChange={(e) => setPreferences({...preferences, maxDistanceKm: e.target.value ? Number(e.target.value) : undefined})}
                className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 100"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={savePreferences}
              disabled={saving}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
