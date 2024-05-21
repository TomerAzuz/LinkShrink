import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { toBeInTheDocument } from '@testing-library/jest-dom/matchers';
import SubmitButton from './SubmitButton';

expect.extend({ toBeInTheDocument });

describe('SubmitButton component', () => {
  test('renders the button with the correct title', () => {
    const title = 'Submit';
    const { getByText } = render(<SubmitButton title={title} onClick={() => {}} />);
    const buttonElement = getByText(title);

    expect(buttonElement).toBeInTheDocument();
  });

  test('calls the onClick handler when the button is clicked', () => {
    const title = 'Submit';
    const handleClick = jest.fn();
    const { getByText } = render(<SubmitButton title={title} onClick={handleClick} />);
    const buttonElement = getByText(title);

    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
