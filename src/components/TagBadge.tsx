import React from 'react';
import { cn } from '../lib/utils';

interface TagBadgeProps {
  children: React.ReactNode;
  variant?: 'Beginner' | 'Intermediate' | 'Advanced' | 'default';
  className?: string;
}

export default function TagBadge({ children, variant = 'default', className }: TagBadgeProps) {
  const variants = {
    Beginner: 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30',
    Intermediate: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30',
    Advanced: 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30',
    default: 'bg-gray-50 text-gray-700 border-gray-100 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-800',
  };

  return (
    <span className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
      variants[variant as keyof typeof variants] || variants.default,
      className
    )}>
      {children}
    </span>
  );
}
