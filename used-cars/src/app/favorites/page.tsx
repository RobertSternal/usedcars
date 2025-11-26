import type { Metadata } from 'next/types';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import CarCard from '@/components/CarCard';
import { getFavorites, getCurrentUserId } from '@/app/actions/favorite';

export const metadata: Metadata = {
  title: 'My Favorites | UsedCars',
  description: 'View your saved favorite cars.',
};

export default async function FavoritesPage() {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    redirect('/signin?callbackUrl=/favorites');
  }

  const favorites = await getFavorites();

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Favorites</h1>
          <p className="text-gray-600">Manage your saved vehicles.</p>
        </div>
        
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {favorites.map((car) => (
              <CarCard
                key={car.id}
                id={car.id}
                title={car.title}
                brand={car.brand}
                model={car.model}
                year={car.year}
                price={car.price}
                mileage={car.mileage}
                location={car.location}
                imageUrl={
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (car.images as any[]).find((img: any) => img.isPrimary)?.url || 
                  (car.images as any[])[0]?.url || 
                  '/usedcars/images/auction-photos/car-placeholder.jpg'
                }
                isFavorite={true}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="flex justify-center mb-4">
              <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h2>
            <p className="text-gray-600 mb-6">
              You haven&apos;t saved any cars to your favorites yet. Browse our collection and click the heart icon to save cars you like.
            </p>
            <Link 
              href="/browse" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Browse Cars
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
