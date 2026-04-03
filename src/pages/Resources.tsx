import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, query, where, orderBy, onSnapshot, db } from '../firebase';
import { Resource, Category } from '../types';
import ResourceCard from '../components/ResourceCard';
import { Search, Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Resources() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [resources, setResources] = React.useState<Resource[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const categoryFilter = searchParams.get('category') || 'All';
  const difficultyFilter = searchParams.get('difficulty') || 'All';

  React.useEffect(() => {
    const unsubCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
    });

    let q = query(collection(db, 'resources'), orderBy('createdAt', 'desc'));
    
    if (categoryFilter !== 'All') {
      q = query(collection(db, 'resources'), where('category', '==', categoryFilter), orderBy('createdAt', 'desc'));
    }

    const unsubResources = onSnapshot(q, (snapshot) => {
      let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Resource));
      
      // Client-side filtering for difficulty and search (Firestore has limitations with multiple inequalities/filters)
      if (difficultyFilter !== 'All') {
        data = data.filter(r => r.difficulty === difficultyFilter);
      }
      
      if (searchQuery) {
        data = data.filter(r => 
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }

      setResources(data);
      setLoading(false);
    });

    return () => {
      unsubCategories();
      unsubResources();
    };
  }, [categoryFilter, difficultyFilter, searchQuery]);

  const handleCategoryChange = (cat: string) => {
    setSearchParams({ category: cat, difficulty: difficultyFilter });
  };

  const handleDifficultyChange = (diff: string) => {
    setSearchParams({ category: categoryFilter, difficulty: diff });
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white">Resources</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Explore our curated collection of AI tools and prompts.</p>
        </div>
        
        <div className="relative w-full max-w-md">
          <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-gray-200 bg-white py-3 pr-4 pl-10 text-sm outline-none transition-all focus:border-black dark:border-gray-800 dark:bg-black dark:focus:border-white"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-b border-gray-100 pb-6 dark:border-gray-900">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-400">
          <Filter className="h-4 w-4" />
          <span>Filters:</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {['All', ...categories.map(c => c.name)].map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-medium transition-all",
                categoryFilter === cat
                  ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                  : "border-gray-200 text-gray-500 hover:border-gray-300 dark:border-gray-800 dark:text-gray-400 dark:hover:border-gray-700"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-gray-200 dark:bg-gray-800" />

        <div className="flex gap-2">
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
            <button
              key={diff}
              onClick={() => handleDifficultyChange(diff)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-medium transition-all",
                difficultyFilter === diff
                  ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                  : "border-gray-200 text-gray-500 hover:border-gray-300 dark:border-gray-800 dark:text-gray-400 dark:hover:border-gray-700"
              )}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-black border-t-transparent dark:border-white" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {resources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
          
          {resources.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 rounded-full bg-gray-100 p-6 dark:bg-gray-900">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-black dark:text-white">No resources found</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Try adjusting your search or filters to find what you're looking for.</p>
              <button
                onClick={() => {
                  setSearchParams({});
                  setSearchQuery('');
                }}
                className="mt-6 font-semibold text-black underline dark:text-white"
              >
                Clear all filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
