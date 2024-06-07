import React from 'react';
import { render, screen } from '@testing-library/react';
import FaviconDisplay from './FaviconDisplay';

describe('FaviconDisplay Component', () => {
  test('renders the favicon image with the correct src', () => {
    const testUrl = 'example.com';
    render(<FaviconDisplay url={testUrl} />);

    const faviconUrl = `https://www.google.com/s2/favicons?domain=${testUrl}&sz=128`;
    const faviconImage = screen.getByAltText('favicon');

    expect(faviconImage).toBeInTheDocument();
    expect(faviconImage).toHaveAttribute('src', faviconUrl);
  });
});
