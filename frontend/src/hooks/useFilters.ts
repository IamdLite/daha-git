import { useState, useEffect } from 'react';
import axios from 'axios';
import { Resource } from '../types';

// Define API response type
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
    searchQuery: '',
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
        // const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        const apiUrl = 'https://daha.linkpc.net'
        console.log('Fetching from:', `${apiUrl}/api/courses`);
        
        const api  = axios.create({
          baseURL: apiUrl,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },

        });

        api.interceptors.request.use(config => {
          if (config.url?.startsWith('http://')) {
            config.url = config.url.replace('http://', 'https://');
          }
          return config;
        });

        const response = await api.get<ApiResponse>('/api/courses', {
          params: { limit: 100}
        });

        console.log('API Response:', response.data);

        // Handle different response formats
        const responseData = Array.isArray(response.data) 
          ? response.data 
          : response.data?.data || [];

        const mappedResources: Resource[] = responseData.map((item: any) => ({
          id: item.id || Date.now().toString(),
          title: item.title || 'Без названия',
          description: item.description || '',
          url: item.url || '#',
          provider: item.provider || 'Неизвестный провайдер',
          level: item.level || 'Не указан',
          created_at: item.created_at || new Date().toISOString(),
          updated_at: item.updated_at || new Date().toISOString(),
          category: item.category || { id: 0, name: 'Неизвестно' },
          grades: Array.isArray(item.grades) ? item.grades : [],
          startDate: item.start_date || item.created_at || new Date().toISOString(),
          endDate: item.end_date || item.updated_at || new Date().toISOString(),
          gradesEnum: Array.isArray(item.grades) 
            ? item.grades.map((grade: number) => grade.toString()) 
            : [],
          subjectEnum: item.category?.name || 'Неизвестно',
        }));

        console.log('Mapped Resources:', mappedResources);
        setResources(mappedResources);
        setLoading(false);
      } catch (err: any) {
        console.error('Fetch Error:', err);
        
        let errorMessage = 'Не удалось загрузить курсы';
        if (err.response) {
          errorMessage = err.response.data?.detail || 
                       err.response.statusText || 
                       `Ошибка сервера: ${err.response.status}`;
        } else if (err.request) {
          errorMessage = 'Нет ответа от сервера. Проверьте подключение.';
        } else if (err.message.includes('Network Error')) {
          errorMessage = 'Проблемы с подключением к сети';
        } else if (err.message.includes('CORS')) {
          errorMessage = 'Ошибка CORS. Проверьте настройки сервера.';
        }

        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  useEffect(() => {
    if (loading || error) {
      setFilteredResources([]);
      return;
    }

    let result = [...resources];
    console.log('Filtering with:', filters);

    // Apply filters sequentially
    if (filters.selectedSubjects.length > 0) {
      result = result.filter(resource => 
        filters.selectedSubjects.includes(resource.category.name)
      );
    }

    if (filters.selectedDifficulty.length > 0) {
      result = result.filter(resource =>
        resource.level && filters.selectedDifficulty.includes(resource.level)
      );
    }

    if (filters.selectedGrades.length > 0) {
      result = result.filter(resource =>
        resource.grades.some(grade =>
          filters.selectedGrades.includes(grade.toString())
        )
      );
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(resource =>
        resource.title.toLowerCase().includes(query)
      );
    }

    setFilteredResources(result);
  }, [filters, resources, loading, error]);

  const updateFilters = (updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates, page: 1 }));
  };

  const handlers: FilterHandlers = {
    handleSubjectsChange: (subjects) => updateFilters({ selectedSubjects: subjects }),
    handleDifficultyChange: (difficulty) => updateFilters({ selectedDifficulty: difficulty }),
    handleGradesChange: (grades) => updateFilters({ selectedGrades: grades }),
    handleTypeChange: (type) => updateFilters({ selectedType: type }),
    handleSearchChange: (query) => updateFilters({ searchQuery: query }),
    handleResetFilters: () => updateFilters({
      selectedSubjects: [],
      selectedDifficulty: [],
      selectedGrades: [],
      selectedType: null,
      searchQuery: '',
    }),
    handlePageChange: (page) => setFilters(prev => ({ ...prev, page })),
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