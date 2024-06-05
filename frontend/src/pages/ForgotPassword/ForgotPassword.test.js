import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ForgotPassword from './ForgotPassword';
import RequestResetCodeForm from './RequestResetCodeForm/RequestResetCodeForm';
import VerifyResetCode from './VerifyResetCode/VerifyResetCode';
import ResetPassword from './ResetPassword/ResetPassword';

jest.mock('./RequestResetCodeForm/RequestResetCodeForm');
jest.mock('./VerifyResetCode/VerifyResetCode');
jest.mock('./ResetPassword/ResetPassword');

RequestResetCodeForm.mockImplementation(({ setStep }) => (
  <div>
    RequestResetCodeForm
    <button onClick={() => setStep(1)}>Next</button>
  </div>
));

VerifyResetCode.mockImplementation(({ setStep }) => (
  <div>
    VerifyResetCode
    <button onClick={() => setStep(2)}>Next</button>
  </div>
));

ResetPassword.mockImplementation(({ setStep }) => (
  <div>ResetPassword</div>
));

describe('ForgotPassword Component', () => {
  test('initial render shows RequestResetCodeForm', () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );
    expect(screen.getByText('RequestResetCodeForm')).toBeInTheDocument();
  });

  test('renders VerifyResetCode when step is 1', () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText('VerifyResetCode')).toBeInTheDocument();
  });

  test('renders ResetPassword when step is 2', () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText('ResetPassword')).toBeInTheDocument();
  });
});
