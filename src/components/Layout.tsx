import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white text-black transition-colors duration-300 dark:bg-black dark:text-white">
      <Navbar />
      <main className="mx-auto min-h-[calc(100vh-64px-300px)] max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      
      {/* Sticky Ad Banner Placeholder */}
      <div className="fixed bottom-0 left-0 z-40 flex w-full justify-center bg-gray-100/80 p-2 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="flex h-12 w-full max-w-4xl items-center justify-center rounded border border-dashed border-gray-300 bg-white text-xs font-medium text-gray-400 dark:border-gray-700 dark:bg-black">
          ADVERTISEMENT: YOUR BRAND HERE
        </div>
      </div>
    </div>
  );
}
