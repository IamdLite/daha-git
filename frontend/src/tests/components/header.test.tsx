import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import Header from "../../components/layout/common/Header";
import "@testing-library/jest-dom";

describe("Header component", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("renders logo with correct alt text", () => {
    render(<Header />);
    expect(screen.getByAltText(/DAHA Logo/i)).toBeInTheDocument();
  });

  test("shows login button when not authenticated", () => {
    render(<Header />);
    expect(screen.getByRole("button", { name: /вход/i })).toBeInTheDocument();
  });

  test("opens login dialog when login button is clicked", () => {
    render(<Header />);
    fireEvent.click(screen.getByRole("button", { name: /вход/i }));
    
    expect(screen.getByRole("heading", { name: /вход/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/ваш телеграмм username/i)).toBeInTheDocument();
  });

  test("shows validation error for empty username", async () => {
    render(<Header />);
    fireEvent.click(screen.getByRole("button", { name: /вход/i }));
    fireEvent.click(screen.getByRole("button", { name: /отправить/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/введите ваш username/i)).toBeInTheDocument();
    });
  });

  test("shows validation error for username without '@'", async () => {
    render(<Header />);
    fireEvent.click(screen.getByRole("button", { name: /вход/i }));
    fireEvent.change(
      screen.getByPlaceholderText(/ваш телеграмм username/i),
      { target: { value: "testuser" } }
    );
    fireEvent.click(screen.getByRole("button", { name: /отправить/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/username должен начинаться с "@"/i)).toBeInTheDocument();
    });
  });
});