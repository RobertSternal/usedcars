import Image from 'next/image';
import Link from 'next/link';

interface CarCardProps {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  location: string;
  imageUrl: string;
}

export default function CarCard({
  id,
  title,
  brand,
  model,
  year,
  price,
  mileage,
  location,
  imageUrl,
}: CarCardProps) {
  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl hover:scale-[1.025] transition-all duration-300 ease-in-out transform-gpu group">
      <Link href={`/cars/${id}`} className="block">
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl}
            alt={`${year} ${brand} ${model}`}
            fill
            className="object-cover"
          />
          <div className="absolute top-3 right-3 bg-blue-600 text-white px-2.5 py-1 rounded text-sm font-bold flex items-center gap-1 shadow-sm">
            {new Intl.NumberFormat('pl-PL', {
              style: 'currency',
              currency: 'PLN',
              maximumFractionDigits: 0,
            }).format(price)}
          </div>
        </div>
      </Link>
      
      <div className="p-3 bg-white">
        <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition truncate">
          {title}
        </h3>
        
        <p className="text-gray-600 text-sm">{year} • {brand} {model}</p>
        
        <div className="flex justify-between mt-2">
          <div className="flex items-center text-sm text-gray-500">
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>{mileage.toLocaleString()} km</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center text-sm text-gray-500">
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{location}</span>
            </div>
            
            <button className="bg-gray-100 hover:bg-gray-200 p-1 rounded-full">
              <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
