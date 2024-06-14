import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { toBeInTheDocument } from '@testing-library/jest-dom/matchers';
import CopyLink from './CopyLink';
import { toast } from 'react-hot-toast';

expect.extend({ toBeInTheDocument });

jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
  },
}));

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(),
  },
});

describe('CopyLink Component', () => {
  const url = 'https://example.com';
  const variant = 'body1';

  test('renders the component with given props', () => {
    render(<CopyLink url={url} variant={variant} />);
    expect(screen.getByText(url)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('copies the URL to the clipboard when the button is clicked', async () => {
    render(<CopyLink url={url} variant={variant} />);
    const button = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(button);
    });
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(url);
    });
  });

  test('displays the success message after copying the URL', async () => {
    render(<CopyLink url={url} variant={variant} />);
    const button = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(button);
    });
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Link copied to clipboard');
    });
  });

  test('changes the icon to CheckIcon after copying the URL', async () => {
    render(<CopyLink url={url} variant={variant} />);
    const button = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(button);
    });
    await waitFor(() => {
      expect(screen.getByTestId('CheckIcon')).toBeInTheDocument();
    });
  });

  test('resets the icon back to ContentCopyIcon after 2 seconds', async () => {
    jest.useFakeTimers();
    render(<CopyLink url={url} variant={variant} />);
    const button = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(button);
    });
    await waitFor(() => {
      expect(screen.getByTestId('CheckIcon')).toBeInTheDocument();
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(screen.getByTestId('ContentCopyIcon')).toBeInTheDocument();
    });

    jest.useRealTimers();
  });
});
