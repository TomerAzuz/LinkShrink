import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LinkDetailsItem from "./LinkDetailsItem";
import { qrCodeToBase64 } from "../../utils/qrCodeToBase64";
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

jest.mock("../../utils/qrCodeToBase64");
jest.mock('./LinkDetailsItem.css', () => ({}));
jest.mock('../../AuthContext', () => ({
  useAuth: jest.fn(),
}));

const link = {
  id: '1',
  longUrl: 'https://www.example.com',
  shortUrl: 'https://short.ly/abcd',
  qrCodeData: 'mock-qr-code-data',
  createdAt: '2023-01-01T00:00:00.000Z',
  title: 'Example',
};

const deleteLink = jest.fn();

describe("LinkDetailsItem Component", () => {
  beforeEach(() => {
    qrCodeToBase64.mockReturnValue('mock-base64-qr-code');
  });

  test("renders without crashing", () => {
    render(
      <BrowserRouter>
        <LinkDetailsItem link={link} deleteLink={deleteLink} />
      </BrowserRouter>
    );
    expect(screen.getByText('Example')).toBeInTheDocument();
    expect(screen.getByText('https://www.example.com')).toBeInTheDocument();
    expect(screen.getByText('https://short.ly/abcd')).toBeInTheDocument();
  });

  test("toggles QR code view on button click", () => {
    render(
      <BrowserRouter>
        <LinkDetailsItem link={link} deleteLink={deleteLink} />
      </BrowserRouter>
    );
    const button = screen.getByRole('button', { name: /view qr code/i });
    fireEvent.click(button);
  
    const qrCodeImg = screen.getByAltText('QR Code');
    expect(qrCodeImg).toHaveAttribute('src', 'mock-base64-qr-code');
  
    fireEvent.click(button);
    expect(screen.getByText('https://short.ly/abcd')).toBeInTheDocument();
  });

  test("opens delete confirmation dialog on delete button click", () => {
    render(
      <BrowserRouter>
        <LinkDetailsItem link={link} deleteLink={deleteLink} />
      </BrowserRouter>
    );
    const deleteButton = screen.getByRole('button', { name: /remove link/i });
    fireEvent.click(deleteButton);
    expect(screen.getByText('Delete Link')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to permanently delete this link?')).toBeInTheDocument();
  });

  test("calls deleteLink function when confirming delete", () => {
    render(
      <BrowserRouter>
        <LinkDetailsItem link={link} deleteLink={deleteLink} />
      </BrowserRouter>
    );
    const deleteButton = screen.getByRole('button', { name: /remove link/i });
    fireEvent.click(deleteButton);
    const confirmButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(confirmButton);
    expect(deleteLink).toHaveBeenCalledWith('1');
  });
});
