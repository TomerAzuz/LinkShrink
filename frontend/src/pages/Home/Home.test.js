import React from 'react';
import { render } from '@testing-library/react';
import { toBeInTheDocument } from '@testing-library/jest-dom/matchers';

import Home from './Home';

expect.extend({ toBeInTheDocument });

describe('Home Component', () => {
  test('renders TextSection component', () => {
    const { getByText } = render(<Home />);
    const textElement = getByText('Enter a URL below to shrink a URL or generate a QR code.');
    expect(textElement).toBeInTheDocument();
  });

  test('renders UrlInput component', () => {
    const { getByLabelText } = render(<Home />);
    const urlInputLabel = getByLabelText('Insert URL');
    expect(urlInputLabel).toBeInTheDocument();
  });
});
