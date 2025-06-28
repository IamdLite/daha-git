import { useState, useEffect } from 'react';
import axios from 'axios';
import { Resource } from '../types';

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

export const useFilters = (): {
  filters: FilterState;
  handlers: FilterHandlers;
  filteredResources: Resource[];
  totalOpportunities: number;
  loading: boolean;
  error: string | null;
} => {
  const [filters, setFilters] = useState<FilterState>({
    selectedSubjects: [],
    selectedDifficulty: [],
    selectedGrades: [],
    selectedType: null,
    searchQuery: '',
    page: 1,
    rowsPerPage: 5,
  });
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [totalOpportunities, setTotalOpportunities] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        console.log('Fetching from:', `${apiUrl}/api/courses`);
        const response = await axios.get(`${apiUrl}/api/courses?limit=100`, {
          params: {
            page: filters.page,
            limit: filters.rowsPerPage,
            subjects: filters.selectedSubjects.join(',') || undefined,
            difficulty: filters.selectedDifficulty.join(',') || undefined,
            grades: filters.selectedGrades.join(',') || undefined,
            search: filters.searchQuery || undefined,
          },
        });
        console.log('API Response:', response.data);

        const mappedResources: Resource[] = response.data.data.map((item: any) => ({
          id: item.id,
          title: item.title || 'Без названия',
          description: item.description || '',
          url: item.url || '#',
          provider: item.provider || 'Неизвестный провайдер',
          level: item.level || 'Не указан',
          created_at: item.created_at || new Date().toISOString(),
          updated_at: item.updated_at || new Date().toISOString(),
          category: item.category || { id: 0, name: 'Неизвестно' },
          grades: Array.isArray(item.grades) ? item.grades : [],
          startDate: item.created_at || new Date().toISOString(),
          endDate: item.updated_at || new Date().toISOString(),
          gradesEnum: Array.isArray(item.grades) ? item.grades.map((grade: number) => grade.toString()) : [],
          subjectEnum: item.category?.name || 'Неизвестно',
        }));

        console.log('All Mapped Resources:', mappedResources);
        setResources(mappedResources);
        setFilteredResources(mappedResources);
        setTotalOpportunities(response.data.total || mappedResources.length);
        setLoading(false);
      } catch (err: any) {
        const errorMessage = err.response?.data?.detail || err.message || 'Не удалось загрузить курсы';
        console.error('Fetch Error:', err);
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchResources();
  }, [filters.page, filters.rowsPerPage, filters.selectedSubjects, filters.selectedDifficulty, filters.selectedGrades, filters.searchQuery]);

  const handleSubjectsChange = (subjects: string[]) =>
    setFilters((prev) => ({ ...prev, selectedSubjects: subjects, page: 1 }));
  const handleDifficultyChange = (difficulty: string[]) =>
    setFilters((prev) => ({ ...prev, selectedDifficulty: difficulty, page: 1 }));
  const handleGradesChange = (grades: string[]) =>
    setFilters((prev) => ({ ...prev, selectedGrades: grades, page: 1 }));
  const handleTypeChange = (type: string | null) =>
    setFilters((prev) => ({ ...prev, selectedType: type, page: 1 }));
  const handleSearchChange = (query: string) =>
    setFilters((prev) => ({ ...prev, searchQuery: query, page: 1 }));
  const handleResetFilters = () =>
    setFilters((prev) => ({
      ...prev,
      selectedSubjects: [],
      selectedDifficulty: [],
      selectedGrades: [],
      selectedType: null,
      searchQuery: '',
      page: 1,
    }));
  const handlePageChange = (page: number) =>
    setFilters((prev) => ({ ...prev, page }));

  return {
    filters,
    handlers: {
      handleSubjectsChange,
      handleDifficultyChange,
      handleGradesChange,
      handleTypeChange,
      handleSearchChange,
      handleResetFilters,
      handlePageChange,
    },
    filteredResources,
    totalOpportunities,
    loading,
    error,
  };
};