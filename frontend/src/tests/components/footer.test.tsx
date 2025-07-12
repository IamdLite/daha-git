import { render, screen } from "@testing-library/react";
import React from "react";
import Footer from "../../components/layout/common/Footer";
import "@testing-library/jest-dom";

describe("Footer component", () => {
  test("renders footer container", () => {
    render(<Footer />);
    const footer = screen.getByTestId("footer");
    expect(footer).toBeInTheDocument();
  });

  test("renders logo with correct alt text and src", () => {
    render(<Footer />);
    const logo = screen.getByAltText(/DAHA Logo/i);
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src");
  });

  test("renders navigation links with correct text", () => {
    render(<Footer />);
    // Query links by role and accessible name instead of text + closest
    const aboutLink = screen.getByRole("link", { name: "О нас" });
    const addResourceLink = screen.getByRole("link", { name: "Как добавить ресурс" });
    const partnersLink = screen.getByRole("link", { name: "Партнерам" });

    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute("href", "#");

    expect(addResourceLink).toBeInTheDocument();
    expect(addResourceLink).toHaveAttribute("href", "#");

    expect(partnersLink).toBeInTheDocument();
    expect(partnersLink).toHaveAttribute("href", "#");
  });

  test("renders social media icon buttons with correct aria-labels", () => {
    render(<Footer />);
    const githubButton = screen.getByLabelText("github");
    const telegramButton = screen.getByLabelText("telegram");
    const emailButton = screen.getByLabelText("email");

    expect(githubButton).toBeInTheDocument();
    expect(telegramButton).toBeInTheDocument();
    expect(emailButton).toBeInTheDocument();
  });

  test("displays current year in copyright", () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    const copyrightText = screen.getByText(
      new RegExp(`© ${currentYear} DAHA`, "i")
    );
    expect(copyrightText).toBeInTheDocument();
  });
});
