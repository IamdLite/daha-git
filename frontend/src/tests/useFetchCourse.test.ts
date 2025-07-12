import { renderHook, waitFor } from "@testing-library/react";
import axios from "axios";
import { useFetchCourses } from "../hooks/useFetchCourses";
import { Resource } from "../types";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  (console.log as jest.Mock).mockRestore();
  (console.error as jest.Mock).mockRestore();
});


describe("useFetchCourses hook", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("fetches and maps courses successfully", async () => {
    const mockApiResponse = {
      data: [
        {
          id: "1",
          title: "Course 1",
          description: "Description 1",
          url: "https://example.com/1",
          provider: "Provider 1",
          level: "Beginner",
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-02T00:00:00Z",
          category: { id: 10, name: "Category 1" },
          grades: [1, 2],
          start_date: "2023-02-01T00:00:00Z",
          end_date: "2023-03-01T00:00:00Z",
        },
      ],
    };

    mockedAxios.get.mockResolvedValueOnce({ data: mockApiResponse });

    const { result } = renderHook(() => useFetchCourses());

    // Initially loading is true
    expect(result.current.loading).toBe(true);

    // Wait for loading to become false and data to be set
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.totalOpportunities).toBe(1);
    expect(result.current.allResources.length).toBe(1);

    const resource: Resource = result.current.allResources[0];
    expect(resource.id).toBe("1");
    expect(resource.title).toBe("Course 1");
    expect(resource.provider).toBe("Provider 1");
    expect(resource.gradesEnum).toEqual(["1", "2"]);
    expect(resource.subjectEnum).toBe("Category 1");
  });

  test("handles API error response", async () => {
    const errorResponse = {
      response: {
        data: { detail: "Server error detail" },
        status: 500,
        statusText: "Internal Server Error",
      },
    };

    mockedAxios.get.mockRejectedValueOnce(errorResponse);

    const { result } = renderHook(() => useFetchCourses());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Server error detail");
    expect(result.current.allResources).toHaveLength(0);
    expect(result.current.totalOpportunities).toBe(0);
  });

  test("handles network error", async () => {
    const networkError = new Error("Network Error");
    mockedAxios.get.mockRejectedValueOnce(networkError);

    const { result } = renderHook(() => useFetchCourses());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Проблемы с подключением к сети");
  });

  test("handles invalid API response format", async () => {
    // API returns an object instead of array
    const invalidApiResponse = {
      data: { some: "object" },
    };

    mockedAxios.get.mockResolvedValueOnce({ data: invalidApiResponse });

    const { result } = renderHook(() => useFetchCourses());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Не удалось загрузить курсы");
  });
});
