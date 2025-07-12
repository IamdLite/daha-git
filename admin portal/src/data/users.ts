// src/data/users.ts
import { QueryFunctionContext } from '@tanstack/react-query';
import { authenticatedFetch } from '../api/auth';

export interface Category {
  id: number;
  name: string;
}

export interface Grade {
  id: number;
  level: number;
}

export interface SavedFilters {
  category_id?: number;
  level?: string;
  grade?: Grade;
  grades?: Grade[];
}

export interface User {
  id: number;
  username: string;
  first_name?: string;
  notifications: string;
  role: 'admin' | 'user';
  saved_filters: SavedFilters;
  created_at: string;
}

export const fetchUsers = async ({ queryKey }: QueryFunctionContext<string[]>): Promise<User[]> => {
  const [, skip = '0', limit = '100'] = queryKey;
  const response = await authenticatedFetch(
    `https://daha.linkpc.net/api/users/?skip=${skip}&limit=${limit}`,
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    }
  );
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Failed to fetch users: ${response.status} ${response.statusText} - ${errorText}`);
  }
  const users: User[] = await response.json();
  return users.map((user) => ({
    ...user,
    saved_filters: {
      ...user.saved_filters,
      grades: user.saved_filters.grade ? [user.saved_filters.grade] : user.saved_filters.grades || [],
    },
  }));
};

export const updateUserPreferences = async (preferences: {
  saved_filters: { category_id?: number; level?: string; grade?: Grade };
  notifications: string;
  role: 'admin' | 'user';
}): Promise<User> => {
  const response = await authenticatedFetch('https://daha.linkpc.net/api/users/me/preferences', {
    method: 'PUT',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preferences),
  });
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Failed to update preferences: ${response.status} ${response.statusText} - ${errorText}`);
  }
  const user: User = await response.json();
  return {
    ...user,
    saved_filters: {
      ...user.saved_filters,
      grades: user.saved_filters.grade ? [user.saved_filters.grade] : user.saved_filters.grades || [],
    },
  };
};

export const deleteUser = async (id: number): Promise<void> => {
  const response = await authenticatedFetch(`https://daha.linkpc.net/api/users/${id}`, {
    method: 'DELETE',
    headers: {
      accept: '*/*',
    },
  });
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Failed to delete user: ${response.status} ${response.statusText} - ${errorText}`);
  }
};

export const fetchCategories = async (): Promise<Category[]> => {
  return [
    { id: 1, name: 'Программирование' },
    { id: 2, name: 'Дизайн' },
    { id: 3, name: 'Маркетинг' },
    { id: 4, name: 'Аналитика данных' },
    { id: 5, name: 'Управление' },
  ];
};

export const fetchGrades = async (): Promise<Grade[]> => {
  console.log('Fetching grades: [{ id: 1, level: 7 }, ..., { id: 5, level: 11 }]');
  return [
    { id: 1, level: 7 },
    { id: 2, level: 8 },
    { id: 3, level: 9 },
    { id: 4, level: 10 },
    { id: 5, level: 11 },
  ];
};