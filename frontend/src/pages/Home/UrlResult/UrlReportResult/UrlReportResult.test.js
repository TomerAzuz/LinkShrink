import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UrlReportResult from './UrlReportResult';

const mockResultSuccess = { status: 201 };
const mockResultFail = { status: 400 };
const mockResetUrlInput = jest.fn();

describe('UrlReportResult Component', () => {
  test('renders success message when report is successful', () => {
    render(
      <UrlReportResult
        result={mockResultSuccess}
        resetUrlInput={mockResetUrlInput}
      />
    );

    expect(
      screen.getByText('Report submitted successfully ✅')
    ).toBeInTheDocument();
  });

  test('renders failure message when report fails', () => {
    render(
      <UrlReportResult
        result={mockResultFail}
        resetUrlInput={mockResetUrlInput}
      />
    );

    expect(
      screen.getByText('Failed to submit report. Please try again.')
    ).toBeInTheDocument();
  });

  test('calls resetUrlInput function when button is clicked', () => {
    render(
      <UrlReportResult
        result={mockResultSuccess}
        resetUrlInput={mockResetUrlInput}
      />
    );

    fireEvent.click(
      screen.getByRole('button', { name: /Report another URL/i })
    );
    expect(mockResetUrlInput).toHaveBeenCalled();
  });
});
