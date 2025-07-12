import axios from "axios";
import { useState, useEffect } from "react";
import { Resource, GradeLevel } from "../types";

interface ApiResponse {
  data?: Resource[];
  detail?: string;
}

export interface FilterState {
  selectedSubjects: string[];
  selectedDifficulty: string[];
  selectedGrades: string[];
  selectedType: string | null;
  searchQuery: string;
  page: number;
  rowsPerPage: number;
}

export interface FilterHandlers {
  handleSubjectsChange: (subjects: string[]) => void;
  handleDifficultyChange: (difficulty: string[]) => void;
  handleGradesChange: (grades: string[]) => void;
  handleTypeChange: (type: string | null) => void;
  handleSearchChange: (query: string) => void;
  handleResetFilters: () => void;
  handlePageChange: (page: number) => void;
}

export const useFilters = () => {
  const [filters, setFilters] = useState<FilterState>({
    selectedSubjects: [],
    selectedDifficulty: [],
    selectedGrades: [],
    selectedType: null,
    searchQuery: "",
    page: 1,
    rowsPerPage: 5,
  });

  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.get<ApiResponse>(`${apiUrl}/api/courses`, {
          params: { limit: 100 },
        });

        const responseData = Array.isArray(response.data)
          ? response.data
          : response.data?.data || [];

        const mappedResources: Resource[] = responseData.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          url: item.url,
          provider: item.provider,
          level: item.level,
          created_at: item.created_at,
          updated_at: item.updated_at,
          category: item.category,
          grades: item.grades || [],
          startDate: item.start_date,
          endDate: item.end_date,
          gradesEnum: item.grades
            ? item.grades.map((g: GradeLevel) => g.level.toString())
            : [],
          subjectEnum: item.category?.name,
        }));

        setResources(mappedResources);
        setFilteredResources(mappedResources);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  useEffect(() => {
    if (loading || error) return;

    const filtered = resources.filter((resource) => {
      // Subject filter
      if (
        filters.selectedSubjects.length > 0 &&
        !filters.selectedSubjects.includes(resource.category?.name)
      ) {
        return false;
      }

      // Difficulty filter
      if (
        filters.selectedDifficulty.length > 0 &&
        !filters.selectedDifficulty.includes(resource.level)
      ) {
        return false;
      }

      // Grade filter
      if (filters.selectedGrades.length > 0) {
        const resourceGrades = resource.gradesEnum || [];
        if (
          !resourceGrades.some((grade) =>
            filters.selectedGrades.includes(grade)
          )
        ) {
          return false;
        }
      }

      // Search filter
      if (
        filters.searchQuery &&
        !resource.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
        !resource.description
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase())
      ) {
        return false;
      }

      return true;
    });

    setFilteredResources(filtered);
  }, [filters, resources, loading, error]);

  const updateFilters = (updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates, page: 1 }));
  };

  const handlers: FilterHandlers = {
    handleSubjectsChange: (subjects) =>
      updateFilters({ selectedSubjects: subjects }),
    handleDifficultyChange: (difficulty) =>
      updateFilters({ selectedDifficulty: difficulty }),
    handleGradesChange: (grades) => updateFilters({ selectedGrades: grades }),
    handleTypeChange: (type) => updateFilters({ selectedType: type }),
    handleSearchChange: (query) => updateFilters({ searchQuery: query }),
    handleResetFilters: () =>
      updateFilters({
        selectedSubjects: [],
        selectedDifficulty: [],
        selectedGrades: [],
        selectedType: null,
        searchQuery: "",
      }),
    handlePageChange: (page) => setFilters((prev) => ({ ...prev, page })),
  };

  return {
    filters,
    handlers,
    filteredResources,
    totalOpportunities: filteredResources.length,
    loading,
    error,
  };
};

