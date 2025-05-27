'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Function to check login status
  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setIsLoggedIn(true);
        setUserName(userData.name || userData.email.split('@')[0]);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUserName('');
      }
    } else {
      setIsLoggedIn(false);
      setUserName('');
    }
  };

  // Listen for storage events (when localStorage changes in other tabs)
  useEffect(() => {
    // Check login status on component mount
    checkLoginStatus();

    // Add event listener for storage changes
    window.addEventListener('storage', checkLoginStatus);
    
    // Custom event for same-tab storage changes
    window.addEventListener('loginStateChange', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('loginStateChange', checkLoginStatus);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserName('');
    router.push('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <div className="flex items-center">
            <span className="text-2xl font-extrabold tracking-wide uppercase bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent">USEDCARS</span>
          </div>
        </Link>
        
        <div className="hidden md:flex space-x-8">
          <Link href="/" className="text-gray-700 hover:text-blue-700 font-medium transition">
            Home
          </Link>
          <Link href="/browse" className="text-gray-700 hover:text-blue-700 font-medium transition">
            Browse Cars
          </Link>
          <Link href="/discover" className="text-gray-700 hover:text-blue-700 font-medium transition">
            Car Finder
          </Link>
          <Link href="/sell" className="text-gray-700 hover:text-blue-700 font-medium transition">
            Sell Your Car
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-blue-700 font-medium transition">
            About Us
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="relative group">
              <button className="flex items-center space-x-2 bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-full font-medium transition">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="hidden sm:inline">{userName}</span>
              </button>
              
              {/* Dropdown menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-10 opacity-0 scale-95 transform origin-top-right transition-all duration-200 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible">
                <div className="py-1">
                  <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                    Profile
                  </Link>
                  <Link href="/sell" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                    My Listings
                  </Link>
                  <Link href="/favorites" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                    Favorites
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link href="/signin" className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md font-medium transition">
              Sign In
            </Link>
          )}
          <button className="md:hidden" onClick={toggleMobileMenu}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
