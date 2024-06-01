import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { toBeInTheDocument, toHaveValue } from '@testing-library/jest-dom/matchers';
import UrlInput from '../UrlInput/UrlInput';
import RequestService from '../../../services/RequestService';

expect.extend({ toBeInTheDocument, toHaveValue });
jest.mock('../../../services/RequestService');

describe('UrlInput Component', () => {
  beforeEach(() => {
    RequestService.post.mockClear();
  });

  test('renders input field and submit buttons', () => {
    const { getByLabelText, getByText } = render(<UrlInput />);
    const inputField = getByLabelText('Insert URL');
    expect(inputField).toBeInTheDocument();

    const shrinkButton = getByText('Shrink URL');
    expect(shrinkButton).toBeInTheDocument();

    const qrButton = getByText('Generate QR Code');
    expect(qrButton).toBeInTheDocument();
  });

  test('handles input change correctly', () => {
    const { getByLabelText } = render(<UrlInput />);
    const inputField = getByLabelText('Insert URL');
    fireEvent.change(inputField, { target: { value: 'https://example.com' } });
    expect(inputField).toHaveValue('https://example.com');
  });

  test('submits shrink URL request correctly', async () => {
    // Mock the RequestService.post function to resolve with the expected value
    RequestService.post.mockResolvedValueOnce({ data: { shortUrl: 'https://shortened-url.com' } });
  
    const { getByText, getByLabelText } = render(<UrlInput />);
    const inputField = getByLabelText('Insert URL');
    const shrinkButton = getByText('Shrink URL');
  
    fireEvent.change(inputField, { target: { value: 'https://example.com' } });
    fireEvent.click(shrinkButton);
  
    // Check if RequestService.post is called with the correct arguments
    expect(RequestService.post).toHaveBeenCalledWith('/shorten', { url: 'https://example.com' });
  
    await waitFor(() => {
      // Check if the shortened URL is displayed after the request is resolved
      expect(getByText('https://shortened-url.com')).toBeInTheDocument();
    });
  });
  
  test('submits generate QR code request correctly', async () => {
    // Mock the RequestService.post function to resolve with the expected value
    RequestService.post.mockResolvedValueOnce({ data: { qrCodeData: 'base64string' } });

    const { getByText, getByLabelText, getByAltText } = render(<UrlInput />);
    const inputField = getByLabelText('Insert URL');
    const qrButton = getByText('Generate QR Code');

    fireEvent.change(inputField, { target: { value: 'https://example.com' } });
    fireEvent.click(qrButton);

    // Check if RequestService.post is called with the correct arguments
    expect(RequestService.post).toHaveBeenCalledWith('/qr', { url: 'https://example.com' });

    await waitFor(() => {
      // Check if the QR code image is displayed after the request is resolved
      const qrCodeImage = getByAltText('QR Code');
      expect(qrCodeImage).toBeInTheDocument();
      // Check if the src attribute contains the expected base64 string
      expect(qrCodeImage.src).toContain('base64string');
    });
  });
});