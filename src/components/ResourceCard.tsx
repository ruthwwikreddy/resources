import React from 'react';
import { Link } from 'react-router-dom';
import { Resource } from '../types';
import { Heart, Bookmark, Copy, ArrowUpRight, Clock } from 'lucide-react';
import TagBadge from './TagBadge';
import { cn } from '../lib/utils';

interface ResourceCardProps {
  resource: Resource;
  featured?: boolean;
  horizontal?: boolean;
}

export default function ResourceCard({ resource, featured, horizontal }: ResourceCardProps) {
  return (
    <Link
      to={`/resources/${resource.id}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:shadow-xl dark:border-gray-800 dark:bg-black",
        featured && "md:col-span-1 md:row-span-1",
        horizontal && "md:flex-row"
      )}
    >
      <div className={cn(
        "relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-900",
        horizontal && "md:aspect-square md:w-48"
      )}>
        {resource.imageUrl ? (
          <img
            src={resource.imageUrl}
            alt={resource.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300 dark:text-gray-700">
            <Sparkles className="h-12 w-12" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <TagBadge variant={resource.difficulty}>{resource.difficulty}</TagBadge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{resource.category}</span>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="h-3 w-3" />
            <span>{new Date(resource.createdAt?.seconds * 1000).toLocaleDateString()}</span>
          </div>
        </div>
        
        <h3 className="mt-2 text-xl font-bold text-black dark:text-white group-hover:underline">
          {resource.title}
        </h3>
        
        <p className="mt-2 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
          {resource.description}
        </p>

        <div className="mt-auto pt-6 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{resource.upvotes || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bookmark className="h-4 w-4" />
              <span>{resource.bookmarks || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Copy className="h-4 w-4" />
              <span>{resource.copyCount || 0}</span>
            </div>
          </div>
          
          <div className="rounded-full bg-gray-50 p-2 text-black transition-colors group-hover:bg-black group-hover:text-white dark:bg-gray-900 dark:text-white dark:group-hover:bg-white dark:group-hover:text-black">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}

import { Sparkles } from 'lucide-react';
