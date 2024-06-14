import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QrCodeCard from './QrCodeCard';

describe('QrCodeCard Component', () => {
  const imageUrl = 'http://example.com/qr-code.png';

  test('renders the component with default size (medium)', () => {
    render(<QrCodeCard imageUrl={imageUrl} />);

    const card = screen.getByRole('img', { name: /qr code/i });
    expect(card).toHaveAttribute('src', imageUrl);
    expect(card).toHaveStyle({ width: '100%', height: '100%' });
  });

  test('renders the component with small size', () => {
    render(<QrCodeCard imageUrl={imageUrl} size="small" />);

    const card = screen.getByRole('img', { name: /qr code/i });
    expect(card).toHaveAttribute('src', imageUrl);

    expect(card.parentElement).toHaveStyle({ width: '150px', height: '150px' });
  });

  test('clicks the download button to download the QR code', () => {
    render(<QrCodeCard imageUrl={imageUrl} />);

    const downloadButton = screen.getByRole('button', {
      name: /download qr code/i,
    });

    const link = document.createElement('a');
    const createElementSpy = jest
      .spyOn(document, 'createElement')
      .mockReturnValue(link);
    const appendChildSpy = jest.spyOn(document.body, 'appendChild');
    const clickSpy = jest.fn();
    const removeChildSpy = jest.spyOn(document.body, 'removeChild');

    link.click = clickSpy;

    fireEvent.click(downloadButton);

    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(appendChildSpy).toHaveBeenCalledWith(link);
    expect(clickSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalledWith(link);

    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });

  test('renders the component with an invalid size (fallback to medium)', () => {
    render(<QrCodeCard imageUrl={imageUrl} size="invalid-size" />);

    const card = screen.getByRole('img', { name: /qr code/i });
    expect(card).toHaveAttribute('src', imageUrl);

    expect(card.parentElement).toHaveStyle({ width: '200px', height: '200px' });
  });
});
