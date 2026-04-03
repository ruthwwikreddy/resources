import React from 'react';
import { Category } from '../types';
import * as Icons from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  // Dynamically get icon from lucide-react
  const IconComponent = (Icons as any)[category.icon] || Icons.Box;

  return (
    <button className="group flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-black hover:shadow-lg dark:border-gray-800 dark:bg-black dark:hover:border-white">
      <div className="mb-4 rounded-xl bg-gray-50 p-3 text-gray-500 transition-colors group-hover:bg-black group-hover:text-white dark:bg-gray-900 dark:text-gray-400 dark:group-hover:bg-white dark:group-hover:text-black">
        <IconComponent className="h-6 w-6" />
      </div>
      <span className="text-sm font-bold text-black dark:text-white">{category.name}</span>
    </button>
  );
}
