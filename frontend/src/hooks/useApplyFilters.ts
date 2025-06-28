import { Resource } from '../types';
import { FilterState } from '../hooks/useFilters';

export const useApplyFilters = (resources: Resource[], filters: FilterState): Resource[] => {
  console.log('useApplyFilters Input Resources:', resources);
  console.log('useApplyFilters Filters:', filters);

  let result = [...resources];

  if (filters.selectedSubjects.length > 0) {
    result = result.filter((resource) =>
      filters.selectedSubjects.includes(resource.category.name)
    );
    console.log('After Subject Filter:', result);
  }

  if (filters.selectedDifficulty.length > 0) {
    result = result.filter((resource) =>
      resource.level && filters.selectedDifficulty.includes(resource.level)
    );
    console.log('After Difficulty Filter:', result);
  }

  if (filters.selectedGrades.length > 0) {
    result = result.filter((resource) =>
      resource.grades.some((grade) =>
        filters.selectedGrades.includes(grade.toString())
      )
    );
    console.log('After Grades Filter:', result);
  }

  if (filters.selectedType) {
    // Assuming Resource has a type field; adjust if different
    result = result.filter((resource: any) =>
      resource.type === filters.selectedType
    );
    console.log('After Type Filter:', result);
  }

  if (filters.searchQuery) {
    result = result.filter((resource) =>
      resource.title.toLowerCase().includes(filters.searchQuery.toLowerCase())
    );
    console.log('After Search Filter:', result);
  }

  console.log('useApplyFilters Final Result:', result);
  return result;
};