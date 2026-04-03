import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Layout as LayoutIcon } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-12 dark:border-gray-800 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tighter text-black dark:text-white">
              <LayoutIcon className="h-6 w-6" />
              <span>AI Hub</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-gray-500 dark:text-gray-400">
              The ultimate platform for AI prompts, workflows, and tools. Build faster with curated resources.
            </p>
            <div className="mt-6 flex gap-4">
              <a href="#" className="text-gray-400 hover:text-black dark:hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-black dark:hover:text-white">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-black dark:hover:text-white">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-black dark:text-white">Resources</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link to="/resources" className="hover:text-black dark:hover:text-white">All Resources</Link></li>
              <li><Link to="/categories" className="hover:text-black dark:hover:text-white">Categories</Link></li>
              <li><Link to="/latest" className="hover:text-black dark:hover:text-white">Latest</Link></li>
              <li><Link to="/popular" className="hover:text-black dark:hover:text-white">Popular</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-black dark:text-white">Company</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="#" className="hover:text-black dark:hover:text-white">About</a></li>
              <li><a href="#" className="hover:text-black dark:hover:text-white">Privacy</a></li>
              <li><a href="#" className="hover:text-black dark:hover:text-white">Terms</a></li>
              <li><a href="#" className="hover:text-black dark:hover:text-white">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-100 pt-8 dark:border-gray-900">
          <p className="text-center text-xs text-gray-400">
            © {new Date().getFullYear()} AI Resource Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
