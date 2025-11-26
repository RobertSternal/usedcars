import type { Metadata } from 'next/types';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getUserListings } from '@/app/actions/car';
import { getCurrentUserId } from '@/app/actions/favorite';
import { formatCurrency } from '@/lib/utils';
import CarCard from '@/components/CarCard';

export const metadata: Metadata = {
  title: 'My Listings | UsedCars',
  description: 'Manage your vehicle listings.',
};

export default async function MyListingsPage() {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    redirect('/signin?callbackUrl=/my-listings');
  }

  const listings = await getUserListings();

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Listings</h1>
            <p className="text-gray-600">Manage your active car listings.</p>
          </div>
          <Link 
            href="/sell" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Sell New Car
          </Link>
        </div>
        
        {listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {listings.map((car) => (
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
                // For my listings, we might not need the favorite button, or we can keep it.
                // Since it wasn't explicitly asked to be removed/kept, passing false or checking favorites would be valid.
                // However, CarCard expects isFavorite. Let's assume user can favorite their own cars too.
                // But we don't have favorite status fetched here. 
                // For now, let's pass false as default or fetch it if needed. 
                // Given the request "wyswietlaj za pomoca kart, analogicznie jak na podstronie ullubione!",
                // I will render the card.
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-4 rounded-full">
                <svg className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">You don&apos;t have any listings yet</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Ready to sell your car? Create a listing in minutes and reach thousands of potential buyers.
            </p>
            <Link 
              href="/sell" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-sm hover:shadow"
            >
              Sell Your Car
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

