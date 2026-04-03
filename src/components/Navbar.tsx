import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from './ThemeProvider';
import { Sun, Moon, Menu, X, Search, Layout as LayoutIcon, User, LogIn, LogOut } from 'lucide-react';
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged } from '../firebase';
import { doc, getDoc, setDoc, db } from '../firebase';
import { UserProfile } from '../types';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const location = useLocation();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as UserProfile);
        } else {
          const newUser: UserProfile = {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || 'User',
            email: firebaseUser.email || '',
            photoURL: firebaseUser.photoURL || '',
            role: 'user',
            bookmarkedResources: [],
            upvotedResources: [],
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
          setUser(newUser);
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Resources', path: '/resources' },
    { name: 'Categories', path: '/categories' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-black/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tighter text-black dark:text-white">
              <LayoutIcon className="h-6 w-6" />
              <span>AI Hub</span>
            </Link>
            <div className="hidden md:block">
              <div className="flex items-center gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`text-sm font-medium transition-colors hover:text-black dark:hover:text-white ${
                      location.pathname === link.path ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 dark:border-gray-800 md:flex">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                className="bg-transparent text-sm outline-none placeholder:text-gray-400 dark:text-white"
              />
            </div>

            <button
              onClick={toggleTheme}
              className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-900"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="hidden text-sm font-medium text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white md:block"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-80 dark:bg-white dark:text-black"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-80 dark:bg-white dark:text-black"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </button>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-900 md:hidden"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="border-b border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-black md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-gray-500 dark:text-gray-400"
              >
                {link.name}
              </Link>
            ))}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-gray-500 dark:text-gray-400"
              >
                Admin
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
