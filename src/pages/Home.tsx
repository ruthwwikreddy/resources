import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, BookOpen, TrendingUp } from 'lucide-react';
import { collection, query, orderBy, limit, onSnapshot, db } from '../firebase';
import { Resource, Category } from '../types';
import ResourceCard from '../components/ResourceCard';
import CategoryCard from '../components/CategoryCard';

export default function Home() {
  const [featuredResources, setFeaturedResources] = React.useState<Resource[]>([]);
  const [latestResources, setLatestResources] = React.useState<Resource[]>([]);
  const [popularResources, setPopularResources] = React.useState<Resource[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);

  React.useEffect(() => {
    // Featured
    const qFeatured = query(collection(db, 'resources'), orderBy('upvotes', 'desc'), limit(3));
    const unsubFeatured = onSnapshot(qFeatured, (snapshot) => {
      setFeaturedResources(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Resource)));
    });

    // Latest
    const qLatest = query(collection(db, 'resources'), orderBy('createdAt', 'desc'), limit(4));
    const unsubLatest = onSnapshot(qLatest, (snapshot) => {
      setLatestResources(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Resource)));
    });

    // Categories
    const unsubCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
    });

    return () => {
      unsubFeatured();
      unsubLatest();
      unsubCategories();
    };
  }, []);

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-6 flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-xs font-medium dark:border-gray-800 dark:bg-gray-900">
          <Sparkles className="h-4 w-4 text-yellow-500" />
          <span>New resources added daily</span>
        </div>
        <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-black dark:text-white sm:text-7xl">
          Build Faster with <span className="text-gray-400">AI Resources</span>
        </h1>
        <p className="mt-8 max-w-2xl text-lg text-gray-500 dark:text-gray-400 sm:text-xl">
          Curated prompts, tools, and guides for builders. Everything you need to supercharge your workflow with artificial intelligence.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/resources"
            className="flex items-center gap-2 rounded-full bg-black px-8 py-4 text-lg font-medium text-white transition-opacity hover:opacity-80 dark:bg-white dark:text-black"
          >
            Explore Resources
            <ArrowRight className="h-5 w-5" />
          </Link>
          <button className="rounded-full border border-gray-200 px-8 py-4 text-lg font-medium text-black transition-colors hover:bg-gray-50 dark:border-gray-800 dark:text-white dark:hover:bg-gray-900">
            View Categories
          </button>
        </div>
      </section>

      {/* Featured Section */}
      <section>
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white">Featured Resources</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Handpicked resources to get you started.</p>
          </div>
          <Link to="/resources" className="text-sm font-medium text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {featuredResources.map(resource => (
            <ResourceCard key={resource.id} resource={resource} featured />
          ))}
          {featuredResources.length === 0 && (
            <div className="col-span-full flex h-64 items-center justify-center rounded-2xl border border-dashed border-gray-200 text-gray-400 dark:border-gray-800">
              No featured resources yet.
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white">Browse by Category</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Find exactly what you're looking for.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {categories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
          {categories.length === 0 && (
            <div className="col-span-full flex h-32 items-center justify-center rounded-2xl border border-dashed border-gray-200 text-gray-400 dark:border-gray-800">
              No categories yet.
            </div>
          )}
        </div>
      </section>

      {/* Latest Resources */}
      <section>
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white">Latest Resources</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">The newest additions to our collection.</p>
          </div>
          <Link to="/resources" className="text-sm font-medium text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {latestResources.map(resource => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
          {latestResources.length === 0 && (
            <div className="col-span-full flex h-64 items-center justify-center rounded-2xl border border-dashed border-gray-200 text-gray-400 dark:border-gray-800">
              No resources yet.
            </div>
          )}
        </div>
      </section>

      {/* Most Popular */}
      <section className="rounded-3xl bg-gray-50 p-8 dark:bg-gray-900 sm:p-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">Trending</span>
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-black dark:text-white">Most Popular</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* We can reuse ResourceCard or create a horizontal version */}
          {latestResources.slice(0, 2).map(resource => (
            <ResourceCard key={resource.id} resource={resource} horizontal />
          ))}
        </div>
      </section>
    </div>
  );
}
