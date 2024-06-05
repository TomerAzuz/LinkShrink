import React from 'react';
import { render, screen } from '@testing-library/react';
import { toBeInTheDocument, toHaveAttribute } from '@testing-library/jest-dom/matchers';
import { MemoryRouter } from 'react-router-dom';
import Logo from './Logo';

expect.extend({ toBeInTheDocument, toHaveAttribute });

describe('Logo', () => {
  it('renders correctly with redirect', () => {
    render(
      <MemoryRouter>
        <Logo size={{ xs: "2rem", md: "3rem" }} isRedirect={true} />
      </MemoryRouter>
    );
    expect(screen.getByText('LinkShrink').closest('a')).toHaveAttribute('href', '/');
  });

  it('renders correctly without redirect', () => {
    render(
      <Logo size={{ xs: "2rem", md: "3rem" }} isRedirect={false} />
    );
    expect(screen.getByText('LinkShrink')).toBeInTheDocument();
  });
});