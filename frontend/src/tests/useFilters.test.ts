// src/tests/useFilters.test.ts
import { renderHook, act, waitFor } from "@testing-library/react";
import axios from "axios";
import { useFilters } from "../hooks/useFilters";
import { Resource } from "../types";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockResources: Resource[] = [
  {
    id: 1,
    title: "React Basics",
    description: "Learn React",
    url: "https://example.com/react",
    provider: "Provider A",
    level: "Beginner",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-02T00:00:00Z",
    category: { id: 10, name: "Programming" },
    grades: [{ id: 1, level: 7 },],
    startDate: "2023-02-01T00:00:00Z",
    endDate: "2023-03-01T00:00:00Z",
    gradesEnum: ["7", "8"],
    subjectEnum: "Programming",
  },
  {
    id: 2,
    title: "Advanced React",
    description: "Deep dive React",
    url: "https://example.com/adv-react",
    provider: "Provider B",
    level: "Advanced",
    created_at: "2023-01-10T00:00:00Z",
    updated_at: "2023-01-12T00:00:00Z",
    category: { id: 11, name: "Programming" },
    grades: [{ id: 1, level: 9 }],
    startDate: "2023-03-01T00:00:00Z",
    endDate: "2023-04-01T00:00:00Z",
    gradesEnum: ["9", "10"],
    subjectEnum: "Programming",
  },
  {
    id: 3,
    title: "Math 101",
    description: "Basic Math",
    url: "https://example.com/math",
    provider: "Provider C",
    level: "Beginner",
    created_at: "2023-01-05T00:00:00Z",
    updated_at: "2023-01-06T00:00:00Z",
    category: { id: 20, name: "Math" },
    grades: [{ id: 1, level: 7 },],
    startDate: "2023-02-15T00:00:00Z",
    endDate: "2023-03-15T00:00:00Z",
    gradesEnum: ["7"],
    subjectEnum: "Math",
  },
];

describe("useFilters hook", () => {
  beforeEach(() => {
    mockedAxios.create.mockReturnThis();
    mockedAxios.get.mockResolvedValue({ data: mockResources });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("loads resources and applies no filters initially", async () => {
    const { result } = renderHook(() => useFilters());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeNull();
    expect(result.current.filteredResources.length).toBe(mockResources.length);
  });

  test("filters by subject", async () => {
    const { result } = renderHook(() => useFilters());

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.handlers.handleSubjectsChange(["Math"]);
    });

    expect(result.current.filters.selectedSubjects).toEqual(["Math"]);
    expect(result.current.filteredResources.length).toBe(1);
    expect(result.current.filteredResources[0].title).toBe("Math 101");
  });

  test("filters by difficulty", async () => {
    const { result } = renderHook(() => useFilters());

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.handlers.handleDifficultyChange(["Beginner"]);
    });

    expect(result.current.filters.selectedDifficulty).toEqual(["Beginner"]);
    expect(result.current.filteredResources.length).toBe(2);
    expect(result.current.filteredResources.some(r => r.title === "React Basics")).toBe(true);
    expect(result.current.filteredResources.some(r => r.title === "Math 101")).toBe(true);
  });

  test("filters by grades", async () => {
    const { result } = renderHook(() => useFilters());

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.handlers.handleGradesChange(["9"]);
    });

    expect(result.current.filters.selectedGrades).toEqual(["9"]);
    expect(result.current.filteredResources.length).toBe(1);
    expect(result.current.filteredResources[0].title).toBe("Advanced React");
  });

  test("filters by search query", async () => {
    const { result } = renderHook(() => useFilters());

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.handlers.handleSearchChange("advanced");
    });

    expect(result.current.filters.searchQuery).toBe("advanced");
    expect(result.current.filteredResources.length).toBe(1);
    expect(result.current.filteredResources[0].title).toBe("Advanced React");
  });

  test("resets filters", async () => {
    const { result } = renderHook(() => useFilters());

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.handlers.handleSubjectsChange(["Math"]);
      result.current.handlers.handleDifficultyChange(["Beginner"]);
      result.current.handlers.handleGradesChange(["7"]);
      result.current.handlers.handleSearchChange("math");
    });

    expect(result.current.filteredResources.length).toBe(1);

    act(() => {
      result.current.handlers.handleResetFilters();
    });

    expect(result.current.filters.selectedSubjects).toEqual([]);
    expect(result.current.filters.selectedDifficulty).toEqual([]);
    expect(result.current.filters.selectedGrades).toEqual([]);
    expect(result.current.filters.searchQuery).toBe("");
    expect(result.current.filteredResources.length).toBe(mockResources.length);
  });
});