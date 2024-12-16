import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      if (user.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to login');
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
          <h2 className="text-4xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-200">Please sign in to continue</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 focus:border-white focus:ring-2 focus:ring-white text-white placeholder-gray-200 outline-none transition-all"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 focus:border-white focus:ring-2 focus:ring-white text-white placeholder-gray-200 outline-none transition-all"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-4 py-3 rounded-lg bg-white text-purple-600 font-semibold hover:bg-opacity-90 transition-all duration-200 ease-in-out transform hover:scale-105"
            >
              Sign in
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <Link 
            to="/register" 
            className="text-white hover:text-gray-200 transition-colors duration-200"
          >
            Don't have an account? Register here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
