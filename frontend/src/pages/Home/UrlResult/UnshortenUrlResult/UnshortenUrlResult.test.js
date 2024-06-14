import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UnshortenUrlResult from './UnshortenUrlResult';

const mockResult = {
  data: {
    url: 'https://original.url/abc123',
  },
};

const mockResetUrlInput = jest.fn();

describe('UnshortenUrlResult Component', () => {
  test('renders correctly with given result data', () => {
    render(
      <UnshortenUrlResult
        result={mockResult}
        resetUrlInput={mockResetUrlInput}
      />
    );

    expect(screen.getByText('Original URL Result')).toBeInTheDocument();
    expect(screen.getByText('The original URL is:')).toBeInTheDocument();
    expect(screen.getByText('https://original.url/abc123')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Unshorten another URL/i })
    ).toBeInTheDocument();
  });

  test('calls resetUrlInput function when button is clicked', () => {
    render(
      <UnshortenUrlResult
        result={mockResult}
        resetUrlInput={mockResetUrlInput}
      />
    );

    fireEvent.click(
      screen.getByRole('button', { name: /Unshorten another URL/i })
    );
    expect(mockResetUrlInput).toHaveBeenCalled();
  });
});
