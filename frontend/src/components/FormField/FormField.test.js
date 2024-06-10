import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { toBeInTheDocument, toHaveAttribute } from '@testing-library/jest-dom/matchers';
import { TextField } from '@mui/material';
import FormField from './FormField'; 

expect.extend({ toBeInTheDocument, toHaveAttribute });

describe('FormField Component', () => {
  const fieldProps = {
    name: 'testField',
    value: '',
    onChange: jest.fn(),
    onBlur: jest.fn(),
  };

  const formProps = {
    touched: { testField: true },
    errors: { testField: 'Test error' },
  };

  test('renders the component with given props', () => {
    render(
      <FormField
        label="Test Label"
        type="text"
        field={fieldProps}
        form={{ touched: {}, errors: {} }}
        autoComplete="off"
      />
    );
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
  });

  test('displays error text when the field has been touched and there is an error', () => {
    render(
      <FormField
        label="Test Label"
        type="text"
        field={fieldProps}
        form={formProps}
        autoComplete="off"
      />
    );
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  test('passes the correct props to the TextField component', () => {
    render(
      <TextField
        label="Test Label"
        type="text"
        field={fieldProps}
        form={{ touched: {}, errors: {} }}
        autoComplete="off"
      />
    );
    const textField = screen.getByLabelText('Test Label');
    expect(textField).toHaveAttribute('type', 'text');
    expect(textField).toHaveAttribute('autocomplete', 'off');
  });

  test('displays no error text when the field is not touched and there is no error', () => {
    render(
      <FormField
        label="Test Label"
        type="text"
        field={fieldProps}
        form={{ touched: {}, errors: {} }}
        autoComplete="off"
      />
    );
    expect(screen.queryByText('Test error')).not.toBeInTheDocument();
  });

  test('toggles password visibility when the type is password', () => {
    render(
      <FormField
        label="Password"
        type="password"
        field={fieldProps}
        form={{ touched: {}, errors: {} }}
        autoComplete="new-password"
      />
    );

    const passwordField = screen.getByLabelText('Password');
    expect(passwordField).toHaveAttribute('type', 'password');

    const toggleButton = screen.getByRole('button');
    act(() => {
      toggleButton.click();
    });
    expect(passwordField).toHaveAttribute('type', 'text');

    act(() => {
      toggleButton.click();
    });
    expect(passwordField).toHaveAttribute('type', 'password');
  });
});