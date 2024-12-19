import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-black shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          {/* Left section */}
          <div className="flex space-x-4">
            <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link to="/services" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              Services
            </Link>
            <Link to="/about" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              About Us
            </Link>
            <Link to="/contact" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              Contact
            </Link>
            <Link to="/blog" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              Blog
            </Link>
            {user && (
              <>
                <Link to="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/time-entry" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Time Entry
                </Link>
                {user.isAdmin && (
                  <Link to="/admin" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Center logo */}
          <div className="flex-shrink-0 flex items-center">
            <img
              className="h-8 w-auto"
              src="/logo.svg"
              alt="Aaha Production Studio"
            />
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <button
                onClick={logout}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
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
