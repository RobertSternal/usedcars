'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toggleFavorite } from '@/app/actions/favorite';

interface FavoriteButtonProps {
  carId: string;
  initialIsFavorite: boolean;
  variant?: 'full' | 'icon';
  className?: string;
}

export default function FavoriteButton({ 
  carId, 
  initialIsFavorite, 
  variant = 'full',
  className = ''
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation if inside a Link
    e.stopPropagation(); // Stop event bubbling
    
    startTransition(async () => {
      const result = await toggleFavorite(carId);
      
      if (!result.success) {
        if (result.error === 'Unauthorized') {
          router.push('/signin');
        } else {
          alert('Failed to update favorite status');
        }
        return;
      }
      
      setIsFavorite(result.isFavorite || false);
    });
  };

  if (variant === 'icon') {
    return (
      <button 
        onClick={handleToggle}
        disabled={isPending}
        className={`p-2 rounded-full transition-colors ${
          isFavorite 
            ? 'bg-red-50 text-red-600 hover:bg-red-100' 
            : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
        } ${className}`}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <svg 
          className="h-5 w-5" 
          fill={isFavorite ? "currentColor" : "none"} 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </svg>
      </button>
    );
  }

  return (
    <button 
      onClick={handleToggle}
      disabled={isPending}
      className={`flex items-center transition ${
        isFavorite ? 'text-red-600 hover:text-red-700' : 'text-gray-600 hover:text-red-600'
      } ${className}`}
    >
      <svg 
        className="h-5 w-5 mr-1" 
        fill={isFavorite ? "currentColor" : "none"} 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
        />
      </svg>
      {isFavorite ? 'Saved' : 'Save'}
    </button>
  );
}
