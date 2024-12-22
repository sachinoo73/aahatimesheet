import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-black shadow-lg font-montserrat">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand section */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-white text-xl font-bold">
              AAHA STUDIO
            </Link>
          </div>

          {/* Hamburger menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4 md:justify-evenly w-full">
            <Link to="/" className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 hover:border-b-2 hover:border-white active:bg-gray-600">
              Home
            </Link>
            <Link to="/services" className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 hover:border-b-2 hover:border-white active:bg-gray-600">
              Services
            </Link>
            <Link to="/about" className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 hover:border-b-2 hover:border-white active:bg-gray-600">
              About Us
            </Link>
            <Link to="/contact" className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 hover:border-b-2 hover:border-white active:bg-gray-600">
              Contact
            </Link>
            <Link to="/blog" className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 hover:border-b-2 hover:border-white active:bg-gray-600">
              Blog
            </Link>
            {user && (
              <Link to="/dashboard" className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 hover:border-b-2 hover:border-white active:bg-gray-600">
                Dashboard
              </Link>
            )}
            {user ? (
              <button
                onClick={logout}
                className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 hover:border-b-2 hover:border-white active:bg-gray-600"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 hover:border-b-2 hover:border-white active:bg-gray-600"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-base font-semibold transition-all duration-200 hover:border-l-4 hover:border-white active:bg-gray-600">
              Home
            </Link>
            <Link to="/services" className="block text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-base font-semibold transition-all duration-200 hover:border-l-4 hover:border-white active:bg-gray-600">
              Services
            </Link>
            <Link to="/about" className="block text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-base font-semibold transition-all duration-200 hover:border-l-4 hover:border-white active:bg-gray-600">
              About Us
            </Link>
            <Link to="/contact" className="block text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-base font-semibold transition-all duration-200 hover:border-l-4 hover:border-white active:bg-gray-600">
              Contact
            </Link>
            <Link to="/blog" className="block text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-base font-semibold transition-all duration-200 hover:border-l-4 hover:border-white active:bg-gray-600">
              Blog
            </Link>
            {user && (
              <Link to="/dashboard" className="block text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-base font-semibold transition-all duration-200 hover:border-l-4 hover:border-white active:bg-gray-600">
                Dashboard
              </Link>
            )}
            {user ? (
              <button
                onClick={logout}
                className="block w-full text-left text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-base font-semibold transition-all duration-200 hover:border-l-4 hover:border-white active:bg-gray-600"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="block text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-base font-semibold transition-all duration-200 hover:border-l-4 hover:border-white active:bg-gray-600"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
