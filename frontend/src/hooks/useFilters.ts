
import { useState, useEffect } from 'react';
import { Resource, Subject, Grade } from '../types';
import { mockResources } from '../data/mockResources';

export interface FilterState {
  selectedSubjects: string[];
  selectedDifficulty: string[];
  selectedGrades: string[];
  searchQuery: string;
  page: number;
  rowsPerPage: number;
}

export interface FilterHandlers {
  handleSubjectsChange: (subjects: string[]) => void;
  handleDifficultyChange: (difficulty: string[]) => void;
  handleGradesChange: (grades: string[]) => void;
  handleSearchChange: (query: string) => void;
  handleResetFilters: () => void;
  handlePageChange: (page: number) => void;
}

export const useFilters = (): {
  filters: FilterState;
  handlers: FilterHandlers;
  filteredResources: Resource[];
} => {
  const [filters, setFilters] = useState<FilterState>({
    selectedSubjects: [],
    selectedDifficulty: [],
    selectedGrades: [],
    searchQuery: '',
    page: 1,
    rowsPerPage: 5, // Configurable
  });
  const [filteredResources, setFilteredResources] = useState<Resource[]>(mockResources);

  const handleSubjectsChange = (subjects: string[]) =>
    setFilters((prev) => ({ ...prev, selectedSubjects: subjects, page: 1 }));
  const handleDifficultyChange = (difficulty: string[]) =>
    setFilters((prev) => ({ ...prev, selectedDifficulty: difficulty, page: 1 }));
  const handleGradesChange = (grades: string[]) =>
    setFilters((prev) => ({ ...prev, selectedGrades: grades, page: 1 }));
  const handleSearchChange = (query: string) =>
    setFilters((prev) => ({ ...prev, searchQuery: query, page: 1 }));
  const handleResetFilters = () =>
    setFilters((prev) => ({
      ...prev,
      selectedSubjects: [],
      selectedDifficulty: [],
      selectedGrades: [],
      searchQuery: '',
      page: 1,
    }));
  const handlePageChange = (page: number) => setFilters((prev) => ({ ...prev, page }));

  useEffect(() => {
    let result = [...mockResources];

    if (filters.selectedSubjects.length > 0) {
      result = result.filter((resource) =>
        resource.subjects.some((subject: Subject) => filters.selectedSubjects.includes(subject))
      );
    }

    if (filters.selectedDifficulty.length > 0) {
      result = result.filter(
        (resource) =>
          resource.difficultyLevel && filters.selectedDifficulty.includes(resource.difficultyLevel)
      );
    }

    if (filters.selectedGrades.length > 0) {
      result = result.filter((resource) =>
        resource.grades.some((grade: Grade) => filters.selectedGrades.includes(grade))
      );
    }

    if (filters.searchQuery) {
      result = result.filter((resource) =>
        resource.title.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    setFilteredResources(result);
  }, [filters.selectedSubjects, filters.selectedDifficulty, filters.selectedGrades, filters.searchQuery]);

  return { filters, handlers: { handleSubjectsChange, handleDifficultyChange, handleGradesChange, handleSearchChange, handleResetFilters, handlePageChange }, filteredResources };
};
