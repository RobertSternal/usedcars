'use client';

import { useState } from 'react';
import Image from 'next/image';

interface CarImage {
  id: string;
  url: string;
  isPrimary: boolean;
  carId: string;
}

interface ImageGalleryProps {
  images: CarImage[];
  title: string;
  defaultImage: string;
}

export default function ImageGallery({ images, title, defaultImage }: ImageGalleryProps) {
  // Determine initial image
  const initialImage = images.length > 0 
    ? (images.find(img => img.isPrimary)?.url || images[0].url) 
    : defaultImage;

  const [currentImage, setCurrentImage] = useState(initialImage);

  return (
    <>
      {/* Main Image */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="relative h-[400px] w-full">
          <Image
            src={currentImage}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
      
      {/* Thumbnail Images */}
      <div className="grid grid-cols-5 gap-3 mb-8">
        {images.length > 0 ? (
          images.map((image, index) => (
            <div 
              key={index} 
              className={`relative h-20 bg-white rounded-md overflow-hidden cursor-pointer border-2 transition ${
                currentImage === image.url ? 'border-blue-500' : 'border-transparent hover:border-blue-300'
              }`}
              onClick={() => setCurrentImage(image.url)}
            >
              <Image
                src={image.url}
                alt={`${title} - Image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))
        ) : (
          <div className="relative h-20 bg-white rounded-md overflow-hidden border-2 border-transparent">
            <Image
              src={defaultImage}
              alt="No image available"
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>
    </>
  );
}
