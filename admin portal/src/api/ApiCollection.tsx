// src/api/APICollection.ts

import { fetchWithAuth } from '../utils/api';

// Types
export interface Category {
  id: number;
  name: string;
}

export interface Grade {
  id: number;
  level: number;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  url: string;
  provider: string;
  level: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  category: Category | null;
  grades: Grade[];
}

export interface CourseInput {
  title: string;
  description: string;
  url: string;
  provider: string;
  category_id: number;
  level: string;
  grade_ids: number[];
  start_date: string;
  end_date: string;
}

// Fetch a page of courses
export const fetchCourses = async (
  skip: number = 0,
  limit: number = 100
): Promise<Course[]> => {
  const response = await fetchWithAuth(
    `https://daha.linkpc.net/api/courses/?skip=${skip}&limit=${limit}`,
    {
      method: 'GET',
      headers: { accept: 'application/json' },
    }
  );
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Failed to fetch courses: ${response.status} ${response.statusText} - ${errorText}`);
  }
  return response.json();
};

// Fetch total course count
// export const fetchCoursesCount = async (): Promise<number> => {
//   const resp = await fetchWithAuth('https://daha.linkpc.net/api/courses/count?skip=0&limit=100', {
//     method: 'GET',
//     headers: { accept: 'application/json' },
//   });
//   if (!resp.ok) throw new Error('Failed to fetch course count');
//   const { count } = await resp.json();
//   if (typeof count !== 'number') throw new Error('Bad count value');
//   return count;
// };
export const fetchCoursesCount = async (): Promise<number> => {
  const resp = await fetchWithAuth('https://daha.linkpc.net/api/courses/count?skip=0&limit=100', {
    method: 'GET',
    headers: { accept: 'application/json' },
  });
  if (!resp.ok) throw new Error('Failed to fetch course count');
  const { total } = await resp.json();
  if (typeof total !== 'number') throw new Error('Bad total value from /courses/count');
  return total;
};


// Fetch *all* courses, via paging loop
export const fetchAllCourses = async (): Promise<Course[]> => {
  const count = await fetchCoursesCount();
  const LIMIT = 100;
  const promises: Promise<Course[]>[] = [];
  for (let skip = 0; skip < count; skip += LIMIT) {
    promises.push(fetchCourses(skip, LIMIT));
  }
  const results = await Promise.all(promises);
  return results.flat();
};

// CRUD -- add, update, delete
export const addCourse = async (courseData: CourseInput): Promise<Course> => {
  const response = await fetchWithAuth('https://daha.linkpc.net/api/courses/', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...courseData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }),
  });
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Failed to add course: ${response.status} ${response.statusText} - ${errorText}`);
  }
  return response.json();
};

export const updateCourse = async (id: number, courseData: CourseInput): Promise<Course> => {
  const response = await fetchWithAuth(`https://daha.linkpc.net/api/courses/${id}`, {
    method: 'PATCH',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...courseData }),
  });
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Failed to update course: ${response.status} ${response.statusText} - ${errorText}`);
  }
  return response.json();
};

export const deleteCourse = async (id: number): Promise<void> => {
  const response = await fetchWithAuth(`https://daha.linkpc.net/api/courses/${id}`, {
    method: 'DELETE',
    headers: { accept: 'application/json' },
  });
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Failed to delete course: ${response.status} ${response.statusText} - ${errorText}`);
  }
};

// Static fallback data for categories/grades
export const fetchCategories = async (): Promise<Category[]> => {
  return [
    { id: 1, name: 'AI' },
    { id: 2, name: 'Programming' },
    { id: 3, name: 'Security' },
    { id: 4, name: 'Robotics' },
    { id: 5, name: 'Entrepreneurship' },
    { id: 6, name: 'Financial Literacy' },
    { id: 7, name: 'Science' },
  ];
  /*
  // Uncomment if/when real endpoint is available:
  // const response = await fetchWithAuth('https://daha.linkpc.net/api/categories', { ... });
  // if (!response.ok) throw new Error(`Failed to fetch categories...`);
  // return response.json();
  */
};

export const fetchGrades = async (): Promise<Grade[]> => {
  return [
    { id: 1, level: 7 },
    { id: 2, level: 8 },
    { id: 3, level: 9 },
    { id: 4, level: 10 },
    { id: 5, level: 11 },
  ];
  /*
  // Uncomment if/when real endpoint is available:
  // const response = await fetchWithAuth('https://daha.linkpc.net/api/grades', { ... });
  // if (!response.ok) throw new Error(...);
  // return response.json();
  */
};
