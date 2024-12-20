import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-black shadow-lg font-montserrat">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center">
          {/* Navigation section */}
          <div className="w-full flex justify-evenly items-center">
            <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-semibold">
              Home
            </Link>
            <Link to="/services" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-semibold">
              Services
            </Link>
            <Link to="/about" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-semibold">
              About Us
            </Link>
            <Link to="/contact" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-semibold">
              Contact
            </Link>
            <Link to="/blog" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-semibold">
              Blog
            </Link>
            {user && (
              <>
                <Link to="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-semibold">
                  Dashboard
                </Link>
                <Link to="/time-entry" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-semibold">
                  Time Entry
                </Link>
                {user.isAdmin && (
                  <Link to="/admin" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-semibold">
                    Admin
                  </Link>
                )}
              </>
            )}
            {user ? (
              <button
                onClick={logout}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-semibold"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-semibold"
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
