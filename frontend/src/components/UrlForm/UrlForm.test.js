import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import UrlForm from './UrlForm';

describe('UrlForm Component', () => {
  const handleSubmitMock = jest.fn();

  afterEach(() => {
    handleSubmitMock.mockClear();
  });

  test('renders without crashing', () => {
    render(
      <UrlForm
        handleSubmit={handleSubmitMock}
        buttonLabel="Submit"
        endpoint="/submit-url"
      />
    );
  });

  test('validates URL correctly', async () => {
    const { getByLabelText, getByText } = render(
      <UrlForm
        handleSubmit={handleSubmitMock}
        buttonLabel="Submit"
        endpoint="/submit-url"
      />
    );

    const input = getByLabelText('Insert URL');
    fireEvent.change(input, { target: { value: 'invalid-url' } });

    fireEvent.submit(input);

    await waitFor(() => {
      expect(getByText('Invalid URL')).toBeInTheDocument();
    });
  });

  test('calls handleSubmit with correct values on form submission', async () => {
    const { getByLabelText, getByText } = render(
      <UrlForm
        handleSubmit={handleSubmitMock}
        buttonLabel="Submit"
        endpoint="/submit-url"
      />
    );

    const input = getByLabelText('Insert URL');
    const button = getByText('Submit');

    fireEvent.change(input, { target: { value: 'https://example.com' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(handleSubmitMock).toHaveBeenCalledWith(
        { url: 'https://example.com' },
        expect.anything(),
        '/submit-url'
      );
    });
  });
});
