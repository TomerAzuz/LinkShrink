import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LinkDetails from './LinkDetails';

describe('LinkDetails Component', () => {
  const testUrl = 'https://example.com';
  const testTitle = 'Example Title';

  test('renders the title with a Tooltip', () => {
    render(
      <BrowserRouter>
        <LinkDetails url={testUrl} title={testTitle} />
      </BrowserRouter>
    );

    const tooltip = screen.getByText(testTitle);
    expect(tooltip).toBeInTheDocument();
  });

  test('renders the URL with the correct link', () => {
    render(
      <BrowserRouter>
        <LinkDetails url={testUrl} title={testTitle} />
      </BrowserRouter>
    );

    const linkElement = screen.getByText(testUrl);
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', testUrl);
  });

  test('truncates long text correctly', () => {
    const longTitle = 'This is a very long title that should be truncated';
    render(
      <BrowserRouter>
        <LinkDetails url={testUrl} title={longTitle} />
      </BrowserRouter>
    );

    const titleElement = screen.getByText(longTitle);
    const urlElement = screen.getByText(testUrl);
    
    expect(titleElement).toHaveStyle('textOverflow: ellipsis');
    expect(urlElement).toHaveStyle('textOverflow: ellipsis');
  });
});
