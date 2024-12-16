import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Register from './Register';

// Mock react-router-dom's useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderRegister = () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <Register />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Register Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders registration form with all elements', () => {
    renderRegister();

    // Check for main elements
    expect(screen.getByAltText('Timesheet App Logo')).toBeInTheDocument();
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Hourly Rate')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByText('Already have an account? Sign in here')).toBeInTheDocument();
  });

  it('handles successful registration', async () => {
    renderRegister();

    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText('Full Name'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'newuser@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Hourly Rate'), {
      target: { value: '25' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'password123' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Wait for navigation
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shows error when passwords do not match', async () => {
    renderRegister();

    // Fill in the form with mismatched passwords
    fireEvent.change(screen.getByPlaceholderText('Full Name'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Hourly Rate'), {
      target: { value: '25' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'password456' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Check for error message
    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
  });

  it('handles registration with existing email', async () => {
    renderRegister();

    // Fill in the form with existing email
    fireEvent.change(screen.getByPlaceholderText('Full Name'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'existing@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Hourly Rate'), {
      target: { value: '25' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'password123' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Check for error message
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('User already exists')).toBeInTheDocument();
    });
  });

  it('validates required fields', async () => {
    renderRegister();

    // Try to submit empty form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Check for HTML5 validation
    expect(screen.getByPlaceholderText('Full Name')).toBeInvalid();
    expect(screen.getByPlaceholderText('Email address')).toBeInvalid();
    expect(screen.getByPlaceholderText('Hourly Rate')).toBeInvalid();
    expect(screen.getByPlaceholderText('Password')).toBeInvalid();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInvalid();
  });

  it('validates email format', async () => {
    renderRegister();

    // Fill in invalid email format
    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'invalid-email' },
    });

    // Try to submit
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Check for HTML5 validation
    expect(screen.getByPlaceholderText('Email address')).toBeInvalid();
  });

  it('validates hourly rate as a number', async () => {
    renderRegister();

    // Try to enter non-numeric value
    fireEvent.change(screen.getByPlaceholderText('Hourly Rate'), {
      target: { value: 'abc' },
    });

    // Check if the value is empty (browser should prevent non-numeric input)
    expect(screen.getByPlaceholderText('Hourly Rate')).toHaveValue(null);
  });

  it('navigates to login page when clicking sign in link', () => {
    renderRegister();

    const loginLink = screen.getByText('Already have an account? Sign in here');
    expect(loginLink.getAttribute('href')).toBe('/login');
  });

  it('clears error message when user starts typing', async () => {
    renderRegister();

    // First trigger a password mismatch error
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'password456' },
    });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Verify error is shown
    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();

    // Start typing in any field
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'newpassword' },
    });

    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});
