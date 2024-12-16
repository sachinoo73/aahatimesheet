import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    hourlyRate: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        hourlyRate: parseFloat(formData.hourlyRate)
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to register');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 p-4">
      <div className="max-w-md w-full bg-white bg-opacity-20 backdrop-blur-lg rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <img 
            src="/logo.svg" 
            alt="Timesheet App Logo" 
            className="mx-auto w-20 h-20 mb-4 filter drop-shadow-lg"
          />
          <h2 className="text-4xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-gray-200">Please fill in your information</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 focus:border-white focus:ring-2 focus:ring-white text-white placeholder-gray-200 outline-none transition-all"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 focus:border-white focus:ring-2 focus:ring-white text-white placeholder-gray-200 outline-none transition-all"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="hourlyRate" className="sr-only">
                Hourly Rate
              </label>
              <input
                id="hourlyRate"
                name="hourlyRate"
                type="number"
                autoComplete="off"
                required
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 focus:border-white focus:ring-2 focus:ring-white text-white placeholder-gray-200 outline-none transition-all"
                placeholder="Hourly Rate"
                value={formData.hourlyRate}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 focus:border-white focus:ring-2 focus:ring-white text-white placeholder-gray-200 outline-none transition-all"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 focus:border-white focus:ring-2 focus:ring-white text-white placeholder-gray-200 outline-none transition-all"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-4 py-3 rounded-lg bg-white text-purple-600 font-semibold hover:bg-opacity-90 transition-all duration-200 ease-in-out transform hover:scale-105"
            >
              Register
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link 
            to="/login" 
            className="text-white hover:text-gray-200 transition-colors duration-200"
          >
            Already have an account? Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
