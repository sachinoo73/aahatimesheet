import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Login from './Login';

// Mock react-router-dom's useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderLogin = () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders login form with all elements', () => {
    renderLogin();

    // Check for main elements
    expect(screen.getByAltText('Timesheet App Logo')).toBeInTheDocument();
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText("Don't have an account? Register here")).toBeInTheDocument();
  });

  it('handles successful login for regular user', async () => {
    renderLogin();

    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Wait for navigation
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('handles failed login attempt', async () => {
    renderLogin();

    // Fill in the form with incorrect credentials
    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongpassword' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('validates required fields', async () => {
    renderLogin();

    // Try to submit the form without filling in any fields
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Check for HTML5 validation
    expect(screen.getByPlaceholderText('Email address')).toBeInvalid();
    expect(screen.getByPlaceholderText('Password')).toBeInvalid();
  });

  it('validates email format', async () => {
    renderLogin();

    // Fill in invalid email format
    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'invalid-email' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });

    // Try to submit
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Check for HTML5 validation
    expect(screen.getByPlaceholderText('Email address')).toBeInvalid();
  });

  it('navigates to register page when clicking register link', () => {
    renderLogin();

    const registerLink = screen.getByText("Don't have an account? Register here");
    expect(registerLink.getAttribute('href')).toBe('/register');
  });

  it('handles successful login for admin user', async () => {
    renderLogin();

    // Mock admin credentials
    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'admin@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'adminpass' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Wait for navigation to admin dashboard
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });
  });

  it('clears error message when user starts typing', async () => {
    renderLogin();

    // First trigger an error
    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    // Start typing new credentials
    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'test@example.com' },
    });

    // Error message should be cleared
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});
