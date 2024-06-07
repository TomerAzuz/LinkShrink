import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { toBeInTheDocument } from '@testing-library/jest-dom/matchers';

import Navbar from './Navbar';
import { useAuth } from '../../AuthContext';

expect.extend({ toBeInTheDocument });

jest.mock('../../AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('Navbar', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly for unauthenticated user', () => {
    useAuth.mockReturnValue({ token: null, logout: jest.fn() });
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Log in')).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });

  it('renders correctly for authenticated user', () => {
    useAuth.mockReturnValue({ token: 'fakeToken', logout: jest.fn() });
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('My Links')).toBeInTheDocument();
    expect(screen.getByText('Log out')).toBeInTheDocument();
  });
});
