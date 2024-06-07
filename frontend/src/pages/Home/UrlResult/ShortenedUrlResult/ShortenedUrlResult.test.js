import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ShortenedUrlResult from './ShortenedUrlResult';

const mockResult = {
  data: {
    shortUrl: 'https://short.url/abc123',
    qrCodeData: 'mockQRCodeData'
  }
};

const mockResetUrlInput = jest.fn();

describe('ShortenedUrlResult Component', () => {
  test('renders correctly with given result data', () => {
    render(<ShortenedUrlResult result={mockResult} resetUrlInput={mockResetUrlInput} />);

    expect(screen.getByText((content, element) => {
      return element.tagName.toLowerCase() === 'p' && content.includes('Your URL has been successfully shortened.');
    })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Shorten another URL/i })).toBeInTheDocument();
  });

  test('calls resetUrlInput function when button is clicked', () => {
    render(<ShortenedUrlResult result={mockResult} resetUrlInput={mockResetUrlInput} />);
    
    fireEvent.click(screen.getByRole('button', { name: /Shorten another URL/i }));
    expect(mockResetUrlInput).toHaveBeenCalled();
  });
});
