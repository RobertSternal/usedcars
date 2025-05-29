/**
 * Car Recommendation Engine
 * 
 * This module provides functions for tracking user preferences and recommending cars
 * based on their swiping behavior in a Tinder-like interface.
 */

import { Car } from '@prisma/client';

// Define interfaces for our recommendation system
interface UserPreference {
  userId: string | null; // Can be null for anonymous users
  dislikedFeatures: Record<string, number>; // Feature name -> count of dislikes
  dislikedBrands: Record<string, number>; // Brand name -> count of dislikes
  dislikedBodyTypes: Record<string, number>; // Body type -> count of dislikes
  dislikedTransmissions: Record<string, number>; // Transmission type -> count of dislikes
  dislikedFuelTypes: Record<string, number>; // Fuel type -> count of dislikes
  dislikedPriceRanges: Record<string, number>; // Price range -> count of dislikes
  dislikedYearRanges: Record<string, number>; // Year range -> count of dislikes
  dislikedCarIds: string[]; // Specific car IDs that were disliked
  likedCarIds: string[]; // Specific car IDs that were liked
}

interface CarWithScore {
  car: Car & { 
    images: { url: string; isPrimary: boolean }[];
    features: string[];
  };
  score: number;
}

// Constants for the recommendation algorithm
const DISLIKE_THRESHOLD = 2; // After this many dislikes for a feature, start reducing score
const DISLIKE_ELIMINATION_THRESHOLD = 4; // After this many dislikes, eliminate cars with this feature
const PRICE_RANGES = [
  { min: 0, max: 50000, label: 'budget' },
  { min: 50001, max: 100000, label: 'economy' },
  { min: 100001, max: 200000, label: 'mid-range' },
  { min: 200001, max: 300000, label: 'premium' },
  { min: 300001, max: Number.MAX_SAFE_INTEGER, label: 'luxury' }
];
const YEAR_RANGES = [
  { min: 0, max: 2010, label: 'older' },
  { min: 2011, max: 2015, label: 'mid-age' },
  { min: 2016, max: 2020, label: 'recent' },
  { min: 2021, max: Number.MAX_SAFE_INTEGER, label: 'new' }
];

// LocalStorage key for storing preferences
const PREFERENCE_STORAGE_KEY = 'carFinderPreferences';

// Check if we're running on the client side
const isClient = typeof window !== 'undefined';

/**
 * Initialize or retrieve user preferences from localStorage
 */
export function getUserPreferences(userId: string | null = null): UserPreference {
  if (!isClient) {
    // Return default preferences when running on server
    return createDefaultPreferences(userId);
  }

  const storedPreferences = localStorage.getItem(PREFERENCE_STORAGE_KEY);
  
  if (storedPreferences) {
    try {
      const preferences = JSON.parse(storedPreferences) as UserPreference;
      // Update userId if it was previously null but now we have one
      if (preferences.userId === null && userId !== null) {
        preferences.userId = userId;
        saveUserPreferences(preferences);
      }
      return preferences;
    } catch (error) {
      console.error('Error parsing stored preferences:', error);
      return createDefaultPreferences(userId);
    }
  }
  
  return createDefaultPreferences(userId);
}

/**
 * Create default preferences object
 */
function createDefaultPreferences(userId: string | null): UserPreference {
  return {
    userId,
    dislikedFeatures: {},
    dislikedBrands: {},
    dislikedBodyTypes: {},
    dislikedTransmissions: {},
    dislikedFuelTypes: {},
    dislikedPriceRanges: {},
    dislikedYearRanges: {},
    dislikedCarIds: [],
    likedCarIds: []
  };
}

/**
 * Save user preferences to localStorage
 */
export function saveUserPreferences(preferences: UserPreference): void {
  if (!isClient) return;
  
  try {
    localStorage.setItem(PREFERENCE_STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving preferences to localStorage:', error);
  }
}

/**
 * Record a user's like for a car
 */
export function recordLike(car: Car, features: string[]): void {
  if (!isClient) return;
  
  try {
    const preferences = getUserPreferences();
    
    // Add to liked cars
    if (!preferences.likedCarIds.includes(car.id)) {
      preferences.likedCarIds.push(car.id);
    }
    
    // Remove from disliked if it was there
    preferences.dislikedCarIds = preferences.dislikedCarIds.filter(id => id !== car.id);
    
    saveUserPreferences(preferences);
  } catch (error) {
    console.error('Error recording like:', error);
  }
}

/**
 * Record a user's dislike for a car and update feature preferences
 */
export function recordDislike(car: Car, features: string[]): void {
  if (!isClient) return;
  
  try {
    const preferences = getUserPreferences();
    
    // Add to disliked cars
    if (!preferences.dislikedCarIds.includes(car.id)) {
      preferences.dislikedCarIds.push(car.id);
    }
    
    // Update disliked features
    features.forEach(feature => {
      preferences.dislikedFeatures[feature] = (preferences.dislikedFeatures[feature] || 0) + 1;
    });
    
    // Update disliked brand
    preferences.dislikedBrands[car.brand] = (preferences.dislikedBrands[car.brand] || 0) + 1;
    
    // Update disliked body type
    if (car.bodyType) {
      preferences.dislikedBodyTypes[car.bodyType] = (preferences.dislikedBodyTypes[car.bodyType] || 0) + 1;
    }
    
    // Update disliked transmission
    if (car.transmission) {
      preferences.dislikedTransmissions[car.transmission] = (preferences.dislikedTransmissions[car.transmission] || 0) + 1;
    }
    
    // Update disliked fuel type
    if (car.fuelType) {
      preferences.dislikedFuelTypes[car.fuelType] = (preferences.dislikedFuelTypes[car.fuelType] || 0) + 1;
    }
    
    // Update disliked price range
    const priceRange = getPriceRange(car.price);
    preferences.dislikedPriceRanges[priceRange] = (preferences.dislikedPriceRanges[priceRange] || 0) + 1;
    
    // Update disliked year range
    const yearRange = getYearRange(car.year);
    preferences.dislikedYearRanges[yearRange] = (preferences.dislikedYearRanges[yearRange] || 0) + 1;
    
    saveUserPreferences(preferences);
  } catch (error) {
    console.error('Error recording dislike:', error);
  }
}

/**
 * Get the price range label for a given price
 */
function getPriceRange(price: number): string {
  const range = PRICE_RANGES.find(range => price >= range.min && price <= range.max);
  return range ? range.label : 'unknown';
}

/**
 * Get the year range label for a given year
 */
function getYearRange(year: number): string {
  const range = YEAR_RANGES.find(range => year >= range.min && year <= range.max);
  return range ? range.label : 'unknown';
}

/**
 * Calculate a recommendation score for a car based on user preferences
 * Higher score means more likely to be recommended
 */
function calculateCarScore(
  car: Car & { 
    images: { url: string; isPrimary: boolean }[];
    features: string[];
  }, 
  preferences: UserPreference
): number {
  // Start with a base score
  let score = 100;
  
  // If car was already disliked, give it a very low score
  if (preferences.dislikedCarIds.includes(car.id)) {
    return -100;
  }
  
  // If car was already liked, give it a high score (for potential re-showing)
  if (preferences.likedCarIds.includes(car.id)) {
    return 50; // Lower than new cars but still potentially showable
  }
  
  // Parse features if they are stored as a JSON string
  let carFeatures: string[] = [];
  if (typeof car.features === 'string') {
    try {
      carFeatures = JSON.parse(car.features);
    } catch {
      carFeatures = car.features.includes(',') ? 
        car.features.split(',').map(f => f.trim()) : 
        [car.features];
    }
  } else {
    carFeatures = car.features || [];
  }
  
  // Check for disliked features
  carFeatures.forEach(feature => {
    const dislikeCount = preferences.dislikedFeatures[feature] || 0;
    if (dislikeCount >= DISLIKE_ELIMINATION_THRESHOLD) {
      score -= 50; // Heavily penalize
    } else if (dislikeCount >= DISLIKE_THRESHOLD) {
      score -= 15 * (dislikeCount - DISLIKE_THRESHOLD + 1);
    }
  });
  
  // Check for disliked brand
  const brandDislikeCount = preferences.dislikedBrands[car.brand] || 0;
  if (brandDislikeCount >= DISLIKE_ELIMINATION_THRESHOLD) {
    score -= 50;
  } else if (brandDislikeCount >= DISLIKE_THRESHOLD) {
    score -= 20 * (brandDislikeCount - DISLIKE_THRESHOLD + 1);
  }
  
  // Check for disliked body type
  const bodyTypeDislikeCount = preferences.dislikedBodyTypes[car.bodyType] || 0;
  if (bodyTypeDislikeCount >= DISLIKE_ELIMINATION_THRESHOLD) {
    score -= 50;
  } else if (bodyTypeDislikeCount >= DISLIKE_THRESHOLD) {
    score -= 20 * (bodyTypeDislikeCount - DISLIKE_THRESHOLD + 1);
  }
  
  // Check for disliked transmission
  const transmissionDislikeCount = preferences.dislikedTransmissions[car.transmission] || 0;
  if (transmissionDislikeCount >= DISLIKE_ELIMINATION_THRESHOLD) {
    score -= 40;
  } else if (transmissionDislikeCount >= DISLIKE_THRESHOLD) {
    score -= 15 * (transmissionDislikeCount - DISLIKE_THRESHOLD + 1);
  }
  
  // Check for disliked fuel type
  const fuelTypeDislikeCount = preferences.dislikedFuelTypes[car.fuelType] || 0;
  if (fuelTypeDislikeCount >= DISLIKE_ELIMINATION_THRESHOLD) {
    score -= 40;
  } else if (fuelTypeDislikeCount >= DISLIKE_THRESHOLD) {
    score -= 15 * (fuelTypeDislikeCount - DISLIKE_THRESHOLD + 1);
  }
  
  // Check for disliked price range
  const priceRange = getPriceRange(car.price);
  const priceRangeDislikeCount = preferences.dislikedPriceRanges[priceRange] || 0;
  if (priceRangeDislikeCount >= DISLIKE_ELIMINATION_THRESHOLD) {
    score -= 40;
  } else if (priceRangeDislikeCount >= DISLIKE_THRESHOLD) {
    score -= 15 * (priceRangeDislikeCount - DISLIKE_THRESHOLD + 1);
  }
  
  // Check for disliked year range
  const yearRange = getYearRange(car.year);
  const yearRangeDislikeCount = preferences.dislikedYearRanges[yearRange] || 0;
  if (yearRangeDislikeCount >= DISLIKE_ELIMINATION_THRESHOLD) {
    score -= 40;
  } else if (yearRangeDislikeCount >= DISLIKE_THRESHOLD) {
    score -= 15 * (yearRangeDislikeCount - DISLIKE_THRESHOLD + 1);
  }
  
  return score;
}

/**
 * Get a list of recommended cars based on user preferences
 * Returns cars sorted by recommendation score (highest first)
 */
export function getRecommendedCars(
  cars: (Car & { 
    images: { url: string; isPrimary: boolean }[];
    features: string[];
  })[]
): (Car & { 
  images: { url: string; isPrimary: boolean }[];
  features: string[];
})[] {
  // If we're on the server, just return the cars as is
  if (!isClient) {
    return cars;
  }
  
  try {
    const preferences = getUserPreferences();
    
    // Calculate scores for each car
    const scoredCars: CarWithScore[] = cars.map(car => ({
      car,
      score: calculateCarScore(car, preferences)
    }));
    
    // Sort by score (highest first)
    scoredCars.sort((a, b) => b.score - a.score);
    
    // Filter out cars with very negative scores (strongly disliked)
    const filteredCars = scoredCars.filter(car => car.score > -50);
    
    // Return just the cars, not the scores
    return filteredCars.map(item => item.car);
  } catch (error) {
    console.error('Error getting recommended cars:', error);
    return cars; // Return original cars if there's an error
  }
}

/**
 * Reset user preferences
 */
export function resetPreferences(): void {
  if (!isClient) return;
  
  try {
    const userId = getUserPreferences().userId;
    const newPreferences = createDefaultPreferences(userId);
    saveUserPreferences(newPreferences);
  } catch (error) {
    console.error('Error resetting preferences:', error);
  }
}
