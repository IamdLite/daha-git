import { useState, useEffect } from 'react';
import axios from 'axios';
import { Resource } from '../types';

// Define API response type
interface ApiResponse {
  data?: Resource[];
  detail?: string;
}

export const useFetchCourses = () => {
  const [allResources, setAllResources] = useState<Resource[]>([]);
  const [totalOpportunities, setTotalOpportunities] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        console.log('Fetching courses from:', `${apiUrl}/api/courses`);
        
        // Add CORS headers to the request
        const response = await axios.get<ApiResponse>(`${apiUrl}/api/courses?limit=100`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        console.log('Courses API Response:', response.data);

        // Handle case where API returns data in different formats
        const responseData = response.data.data || response.data;
        
        if (!Array.isArray(responseData)) {
          throw new Error('Invalid API response format');
        }

        const mappedResources: Resource[] = responseData.map((item: any) => ({
          id: item.id || Date.now().toString(), // Fallback ID
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

        console.log('Mapped Courses:', mappedResources);
        setAllResources(mappedResources);
        setTotalOpportunities(mappedResources.length);
        setLoading(false);
      } catch (err: any) {
        console.error('Fetch Courses Error:', err);
        
        let errorMessage = 'Не удалось загрузить курсы';
        if (err.response) {
          // Server responded with error status
          errorMessage = err.response.data?.detail || 
                         err.response.statusText || 
                         `Ошибка сервера: ${err.response.status}`;
        } else if (err.request) {
          // Request was made but no response received
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

    fetchCourses();

    // Cleanup function
    return () => {
      // Cancel ongoing request if component unmounts
      // (You might need axios cancel token for this)
    };
  }, []);

  return { allResources, totalOpportunities, loading, error };
};