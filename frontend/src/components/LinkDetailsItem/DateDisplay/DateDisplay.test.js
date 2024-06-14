import React from 'react';
import { render, screen } from '@testing-library/react';
import DateDisplay from './DateDisplay';

describe('DateDisplay Component', () => {
  const testDate = '2023-05-16T00:00:00.000Z';

  test('displays the date within a Grid item', () => {
    render(<DateDisplay createdAt={testDate} />);

    const dateText = new Date(testDate).toLocaleDateString();
    const gridItem = screen.getByText(dateText);

    expect(gridItem).toBeInTheDocument();
    expect(gridItem).toHaveTextContent(dateText);
  });
});
