import React from 'react';
import { collection, onSnapshot, db } from '../firebase';
import { Category } from '../types';
import CategoryCard from '../components/CategoryCard';

export default function Categories() {
  const [categories, setCategories] = React.useState<Category[]>([]);

  React.useEffect(() => {
    const unsub = onSnapshot(collection(db, 'categories'), (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
    });
    return () => unsub();
  }, []);

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white">Categories</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Browse resources by their specific focus area.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map(category => (
          <div key={category.id} className="flex flex-col gap-4">
            <CategoryCard category={category} />
            <p className="px-2 text-center text-xs text-gray-400">{category.description}</p>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="col-span-full flex h-64 items-center justify-center rounded-2xl border border-dashed border-gray-200 text-gray-400 dark:border-gray-800">
            No categories found.
          </div>
        )}
      </div>
    </div>
  );
}
