"use client";

import { useRouter, useSearchParams } from 'next/navigation';

export default function CarSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'newest';

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', newSort);
    router.push(`/browse?${params.toString()}`);
  };

  return (
    <select 
      id="sort"
      value={currentSort}
      onChange={handleSortChange}
      className="border border-gray-300 rounded-md p-2 text-sm text-gray-900 font-medium focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="newest">Newest First</option>
      <option value="oldest">Oldest First</option>
      <option value="price_low">Price: Low to High</option>
      <option value="price_high">Price: High to Low</option>
      <option value="mileage_low">Mileage: Low to High</option>
    </select>
  );
}
