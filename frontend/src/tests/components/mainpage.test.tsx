import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import MainPage from "../../components/layout/MainPage";

// Import the hook module to spy on
import * as mediaQueriesHook from "../../hooks/useMediaQueries";

// Mock child components with displayName assigned
jest.mock("../../components/filters/FiltersPanel", () => {
  const FiltersPanel = () => <div data-testid="filters-panel" />;
  FiltersPanel.displayName = "FiltersPanel";
  return FiltersPanel;
});

jest.mock("../../components/filters/MobileFiltersDrawer", () => {
  const MobileFiltersDrawer = (props: any) =>
    props.open ? (
      <div data-testid="mobile-filters-drawer" data-open="true" />
    ) : null;
  MobileFiltersDrawer.displayName = "MobileFiltersDrawer";
  return MobileFiltersDrawer;
});

jest.mock("../../components/resources/ResourcesSection", () => {
  const ResourcesSection = (props: any) => (
    <div
      data-testid="resources-section"
      data-page={props.page}
      data-loading={props.isLoading ? "true" : "false"}
    />
  );
  ResourcesSection.displayName = "ResourcesSection";
  return ResourcesSection;
});

// Mock useFilters hook
jest.mock("../../hooks/useFilters", () => ({
  useFilters: () => ({
    filters: { page: 1, rowsPerPage: 10 },
    handlers: {
      handlePageChange: jest.fn(),
      handleSearchChange: jest.fn(),
    },
    filteredResources: ["resource1", "resource2"],
    totalOpportunities: 2,
    loading: false,
  }),
}));

// Mock the useMediaQueries hook
jest.mock("../../hooks/useMediaQueries");

const mockedUseMediaQueries = mediaQueriesHook.useMediaQueries as jest.Mock;

describe("MainPage component", () => {
  beforeEach(() => {
    // Default to desktop viewport
    mockedUseMediaQueries.mockReturnValue({ isMobile: false });
  });

  test("renders FiltersPanel and ResourcesSection on desktop", () => {
    render(<MainPage />);
    expect(screen.getByTestId("filters-panel")).toBeInTheDocument();
    expect(screen.queryByTestId("mobile-filters-drawer")).not.toBeInTheDocument();
    expect(screen.getByTestId("resources-section")).toBeInTheDocument();
  });

  test("renders filter button and mobile drawer on mobile and toggles drawer", () => {
    mockedUseMediaQueries.mockReturnValue({ isMobile: true });

    const { rerender } = render(<MainPage />);

    const filterButton = screen.getByRole("button");
    expect(filterButton).toBeInTheDocument();

    expect(screen.queryByTestId("filters-panel")).not.toBeInTheDocument();
    expect(screen.queryByTestId("mobile-filters-drawer")).not.toBeInTheDocument();

    fireEvent.click(filterButton);

    rerender(<MainPage />);

    const drawer = screen.getByTestId("mobile-filters-drawer");
    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveAttribute("data-open", "true");
  });

  test("passes correct props to ResourcesSection", () => {
    render(<MainPage />);
    const resourcesSection = screen.getByTestId("resources-section");
    expect(resourcesSection).toHaveAttribute("data-page", "1");
    expect(resourcesSection).toHaveAttribute("data-loading", "false");
  });
});
