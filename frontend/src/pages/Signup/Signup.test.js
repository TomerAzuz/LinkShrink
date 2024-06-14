import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Signup from './Signup';
import { useAuth } from '../../AuthContext';

jest.mock('../../constants/urlConstants', () => ({
  ENVIRONMENT: 'dev',
}));

jest.mock('../../AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('react-hot-toast');

describe('Signup Component', () => {
  const mockRegister = jest.fn();
  const mockLoading = false;

  beforeEach(() => {
    useAuth.mockReturnValue({
      register: mockRegister,
      loading: mockLoading,
    });
  });

  test('renders Signup component', async () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    expect(screen.getByText(/Create an account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(
        screen.getByLabelText('Password', { selector: 'input' }),
        { target: { value: 'password123' } }
      );
      fireEvent.change(
        screen.getByLabelText('Confirm password', { selector: 'input' }),
        { target: { value: 'password123' } }
      );
    });
  });

  test('validates form inputs', async () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    await act(async () => {
      fireEvent.click(screen.getByText(/Sign up/i));
    });

    await waitFor(() => {
      expect(screen.getByText(/Full name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Password confirmation is required/i)
      ).toBeInTheDocument();
    });
  });

  test('handles signup', async () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Full name/i), {
        target: { value: 'John Doe' },
      });
      fireEvent.change(screen.getByLabelText(/Email address/i), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(
        screen.getByLabelText('Password', { selector: 'input' }),
        { target: { value: 'password123' } }
      );
      fireEvent.change(
        screen.getByLabelText('Confirm password', { selector: 'input' }),
        { target: { value: 'password123' } }
      );
      fireEvent.click(screen.getByText(/Sign up/i));
    });

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        fullName: 'John Doe',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
    });
  });

  test('handles signup error', async () => {
    const errorMessage = 'Email already in use';
    mockRegister.mockRejectedValueOnce({
      response: {
        data: {
          message: errorMessage,
        },
      },
    });

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Full name/i), {
        target: { value: 'John Doe' },
      });
      fireEvent.change(screen.getByLabelText(/Email address/i), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(
        screen.getByLabelText('Password', { selector: 'input' }),
        { target: { value: 'password123' } }
      );
      fireEvent.change(
        screen.getByLabelText('Confirm password', { selector: 'input' }),
        { target: { value: 'password123' } }
      );
      fireEvent.click(screen.getByText(/Sign up/i));
    });

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        fullName: 'John Doe',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });
});
