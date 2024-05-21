import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { toBeInTheDocument } from '@testing-library/jest-dom/matchers';

import UrlResult from './UrlResult';

expect.extend({ toBeInTheDocument });
jest.mock('../QRCode/QRCode', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="mock-qrcode" />
  };
});

describe('UrlResult component', () => {
  test('renders short URL as link when QR code data is not present', () => {
    const urlMapping = {
      data: {
        shortUrl: 'https://example.com/abc123',
        qrCodeData: null
      }
    };
    const resetUrlInput = jest.fn();
    const { getByText } = render(<UrlResult urlMapping={urlMapping} resetUrlInput={resetUrlInput} />)
    const linkElement = getByText('https://example.com/abc123');
    expect(linkElement).toBeInTheDocument();
  });

  test('renders QR code when QR code data is present', () => {
    const urlMapping = {
      data: {
        qrCodeData: 'mock-qrcode-image-data'
      }
    };
    const resetUrlInput = jest.fn();
    const { getByTestId } = render(<UrlResult urlMapping={urlMapping} resetUrlInput={resetUrlInput} />);
    const qrcodeElement = getByTestId('mock-qrcode');
    expect(qrcodeElement).toBeInTheDocument();
  });

  test('calls resetUrlInput when "Shorten another URL" button is clicked', () => {
    const urlMapping = {
      data: {
        shortUrl: 'https://example.com/abc123',
        qrCodeData: null
      }
    };
    const resetUrlInput = jest.fn();
    const { getByText } = render(<UrlResult urlMapping={urlMapping} resetUrlInput={resetUrlInput} />)
    const buttonElement = getByText('Shorten another URL');
    fireEvent.click(buttonElement);
    expect(resetUrlInput).toHaveBeenCalledTimes(1);
  });

});