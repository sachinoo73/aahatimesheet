import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import TimeEntry from './TimeEntry';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Mock react-router-dom's useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock AuthContext user
const mockUser = {
  token: 'fake-token',
  name: 'Test User',
};

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
  }),
}));

const renderTimeEntry = () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <TimeEntry />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('TimeEntry Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    axios.post.mockClear();
  });

  it('renders time entry form with all elements', () => {
    renderTimeEntry();

    // Check for main elements
    expect(screen.getByText('New Time Entry')).toBeInTheDocument();
    expect(screen.getByLabelText('Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Location')).toBeInTheDocument();
    expect(screen.getByLabelText('Start Time')).toBeInTheDocument();
    expect(screen.getByLabelText('End Time')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit entry/i })).toBeInTheDocument();
    expect(screen.getByText('Back to Dashboard')).toBeInTheDocument();
  });

  it('handles successful time entry submission', async () => {
    renderTimeEntry();
    
    axios.post.mockResolvedValueOnce({ data: {} });

    // Fill in the form
    fireEvent.change(screen.getByLabelText('Date'), {
      target: { value: '2024-03-15' },
    });
    fireEvent.change(screen.getByLabelText('Location'), {
      target: { value: 'Office' },
    });
    fireEvent.change(screen.getByLabelText('Start Time'), {
      target: { value: '09:00' },
    });
    fireEvent.change(screen.getByLabelText('End Time'), {
      target: { value: '17:00' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /submit entry/i }));

    // Check for success message
    await waitFor(() => {
      expect(screen.getByText('Time entry added successfully!')).toBeInTheDocument();
    });

    // Verify API call
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:5001/api/timesheet',
      {
        date: '2024-03-15',
        location: 'Office',
        startTime: '09:00',
        endTime: '17:00',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer fake-token',
        },
      }
    );

    // Verify navigation after success
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    }, { timeout: 2500 });
  });

  it('handles API error during submission', async () => {
    renderTimeEntry();

    const errorMessage = 'Failed to add time entry';
    axios.post.mockRejectedValueOnce({ 
      response: { 
        data: { message: errorMessage } 
      } 
    });

    // Fill in and submit the form
    fireEvent.change(screen.getByLabelText('Date'), {
      target: { value: '2024-03-15' },
    });
    fireEvent.change(screen.getByLabelText('Location'), {
      target: { value: 'Office' },
    });
    fireEvent.change(screen.getByLabelText('Start Time'), {
      target: { value: '09:00' },
    });
    fireEvent.change(screen.getByLabelText('End Time'), {
      target: { value: '17:00' },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit entry/i }));

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('validates required fields', async () => {
    renderTimeEntry();

    // Try to submit empty form
    fireEvent.click(screen.getByRole('button', { name: /submit entry/i }));

    // Check for HTML5 validation
    expect(screen.getByLabelText('Location')).toBeInvalid();
    expect(screen.getByLabelText('Start Time')).toBeInvalid();
    expect(screen.getByLabelText('End Time')).toBeInvalid();
  });

  it('navigates back to dashboard when clicking back button', () => {
    renderTimeEntry();

    fireEvent.click(screen.getByText('Back to Dashboard'));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('initializes date field with current date', () => {
    renderTimeEntry();
    
    const today = new Date().toISOString().split('T')[0];
    expect(screen.getByLabelText('Date')).toHaveValue(today);
  });

  it('allows time input in correct format', () => {
    renderTimeEntry();

    fireEvent.change(screen.getByLabelText('Start Time'), {
      target: { value: '09:00' },
    });
    fireEvent.change(screen.getByLabelText('End Time'), {
      target: { value: '17:00' },
    });

    expect(screen.getByLabelText('Start Time')).toHaveValue('09:00');
    expect(screen.getByLabelText('End Time')).toHaveValue('17:00');
  });

  it('clears error message when user starts typing', async () => {
    renderTimeEntry();

    // Trigger an error first
    axios.post.mockRejectedValueOnce({ 
      response: { 
        data: { message: 'Error message' } 
      } 
    });

    // Fill in and submit to trigger error
    fireEvent.change(screen.getByLabelText('Location'), {
      target: { value: 'Office' },
    });
    fireEvent.click(screen.getByRole('button', { name: /submit entry/i }));

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    // Start typing in any field
    fireEvent.change(screen.getByLabelText('Location'), {
      target: { value: 'New Office' },
    });

    // Error should be cleared
    expect(screen.queryByText('Error message')).not.toBeInTheDocument();
  });
});
