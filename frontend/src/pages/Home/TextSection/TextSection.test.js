import React from 'react';
import { render } from '@testing-library/react';
import TextSection from './TextSection';

describe('TextSection Component', () => {
  test('renders heading with correct text', () => {
    const { getByText } = render(<TextSection />);
    const headingElement = getByText('LinkShrink');
    expect(headingElement).toBeTruthy();
  });

  test('renders body text with correct content', () => {
    const { getByText } = render(<TextSection />);
    const bodyTextElement = getByText('Enter a URL below to shrink a URL or generate a QR code.');
    expect(bodyTextElement).toBeTruthy();
  });

  test('matches snapshot', () => {
    const { container } = render(<TextSection />);
    expect(container).toMatchSnapshot();
  });
});
