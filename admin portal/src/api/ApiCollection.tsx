// // src/api/APICollection.ts
// import { authenticatedFetch } from './auth';

// interface Category {
//   id: number;
//   name: string;
// }

// interface Grade {
//   id: number;
// }

// interface Course {
//   id: number;
//   title: string;
//   description: string;
//   url: string;
//   provider: string;
//   level: string;
//   start_date: string;
//   end_date: string;
//   created_at: string;
//   updated_at: string;
//   category: Category;
//   grades: Grade[];
// }

// interface CourseInput {
//   title: string;
//   description: string;
//   url: string;
//   provider: string;
//   category_id: number;
//   level: string;
//   grade_ids: number[];
//   start_date: string;
//   end_date: string;
// }

// export const fetchCourses = async (skip: number = 0, limit: number = 10): Promise<Course[]> => {
//   const response = await authenticatedFetch(
//     `https://daha.linkpc.net/api/courses/?skip=${skip}&limit=${limit}`,
//     {
//       method: 'GET',
//       headers: {
//         accept: 'application/json',
//       },
//     }
//   );
//   if (!response.ok) {
//     const errorText = await response.text().catch(() => 'Unknown error');
//     throw new Error(`Failed to fetch courses: ${response.status} ${response.statusText} - ${errorText}`);
//   }
//   return response.json();
// };

// export const addCourse = async (courseData: CourseInput): Promise<Course> => {
//   const response = await authenticatedFetch('https://daha.linkpc.net/api/courses/', {
//     method: 'POST',
//     headers: {
//       accept: 'application/json',
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       title: courseData.title,
//       description: courseData.description,
//       url: courseData.url,
//       provider: courseData.provider,
//       category_id: courseData.category_id,
//       level: courseData.level,
//       grade_ids: courseData.grade_ids,
//       start_date: courseData.start_date,
//       end_date: courseData.end_date,
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString(),
//     }),
//   });
//   if (!response.ok) {
//     const errorText = await response.text().catch(() => 'Unknown error');
//     throw new Error(`Failed to add course: ${response.status} ${response.statusText} - ${errorText}`);
//   }
//   return response.json();
// };

// export const updateCourse = async (id: number, courseData: CourseInput): Promise<Course> => {
//   const response = await authenticatedFetch(`https://daha.linkpc.net/api/courses/${id}`, {
//     method: 'PATCH',
//     headers: {
//       accept: 'application/json',
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       title: courseData.title,
//       description: courseData.description,
//       url: courseData.url,
//       provider: courseData.provider,
//       category_id: courseData.category_id,
//       level: courseData.level,
//       grade_ids: courseData.grade_ids,
//       start_date: courseData.start_date,
//       end_date: courseData.end_date,
//     }),
//   });
//   if (!response.ok) {
//     const errorText = await response.text().catch(() => 'Unknown error');
//     throw new Error(`Failed to update course: ${response.status} ${response.statusText} - ${errorText}`);
//   }
//   return response.json();
// };

// export const deleteCourse = async (id: number): Promise<void> => {
//   const response = await authenticatedFetch(`https://daha.linkpc.net/api/courses/${id}`, {
//     method: 'DELETE',
//     headers: {
//       accept: 'application/json',
//     },
//   });
//   if (!response.ok) {
//     const errorText = await response.text().catch(() => 'Unknown error');
//     throw new Error(`Failed to delete course: ${response.status} ${response.statusText} - ${errorText}`);
//   }
// };
// // Optional: Fetch categories if an endpoint exists
// export const fetchCategories = async (): Promise<Category[]> => {
//   // If no endpoint exists, return static categories
//   return [
//     { id: 1, name: 'Программирование' },
//     { id: 2, name: 'Математика' },
//     { id: 3, name: 'Искусственный интеллект' },
//     { id: 4, name: 'Физика' },
//     { id: 5, name: 'Химия' },
//     { id: 6, name: 'Робототехника' },
//     { id: 7, name: 'Информационная безопасность' },
//     { id: 8, name: 'Финансовая грамотность' },
//     { id: 9, name: 'Наука' },
//   ];


//   // Uncomment if Liuboc creates categories endpoint
//   /*
//   const response = await authenticatedFetch('https://daha.linkpc.net/api/categories', {
//     method: 'GET',
//     headers: {
//       accept: 'application/json',
//     },
//   });
//   if (!response.ok) {
//     throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
//   }
//   return response.json();
//   */
// };

// export const fetchGrades = async (): Promise<Grade[]> => {
//   // Static grades 7–11 (replace with API call if endpoint exists)
//   return Array.from({ length: 5 }, (_, i) => ({ id: i + 7 }));
//   // If a grades endpoint exists, e.g., /api/grades:
//   /*
//   const response = await authenticatedFetch('https://daha.linkpc.net/api/grades', {
//     method: 'GET',
//     headers: {
//       accept: 'application/json',
//     },
//   });
//   if (!response.ok) {
//     throw new Error(`Failed to fetch grades: ${response.status} ${response.statusText}`);
//   }
//   return response.json();
//   */
// };

// src/api/APICollection.ts
import { authenticatedFetch } from './auth';

interface Category {
  id: number;
  name: string;
}

interface Grade {
  id: number;
  level: number;
}

interface Course {
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

interface CourseInput {
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

export const fetchCourses = async (skip: number = 0, limit: number = 10): Promise<Course[]> => {
  const response = await authenticatedFetch(
    `https://daha.linkpc.net/api/courses/?skip=${skip}&limit=${limit}`,
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    }
  );
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Failed to fetch courses: ${response.status} ${response.statusText} - ${errorText}`);
  }
  return response.json();
};

export const addCourse = async (courseData: CourseInput): Promise<Course> => {
  console.log('Sending course data:', JSON.stringify(courseData, null, 2)); // Debug log
  const response = await authenticatedFetch('https://daha.linkpc.net/api/courses/', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: courseData.title,
      description: courseData.description,
      url: courseData.url,
      provider: courseData.provider,
      category_id: courseData.category_id,
      level: courseData.level,
      grade_ids: courseData.grade_ids,
      start_date: courseData.start_date,
      end_date: courseData.end_date,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }),
  });
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Failed to add course: ${response.status} ${response.statusText} - ${errorText} (grade_ids: ${courseData.grade_ids})`);
  }
  return response.json();
};

export const updateCourse = async (id: number, courseData: CourseInput): Promise<Course> => {
  console.log('Updating course data:', JSON.stringify(courseData, null, 2)); // Debug log
  const response = await authenticatedFetch(`https://daha.linkpc.net/api/courses/${id}`, {
    method: 'PATCH',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: courseData.title,
      description: courseData.description,
      url: courseData.url,
      provider: courseData.provider,
      category_id: courseData.category_id,
      level: courseData.level,
      grade_ids: courseData.grade_ids,
      start_date: courseData.start_date,
      end_date: courseData.end_date,
    }),
  });
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Failed to update course: ${response.status} ${response.statusText} - ${errorText} (grade_ids: ${courseData.grade_ids})`);
  }
  return response.json();
};

export const deleteCourse = async (id: number): Promise<void> => {
  const response = await authenticatedFetch(`https://daha.linkpc.net/api/courses/${id}`, {
    method: 'DELETE',
    headers: {
      accept: 'application/json',
    },
  });
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Failed to delete course: ${response.status} ${response.statusText} - ${errorText}`);
  }
};

export const fetchCategories = async (): Promise<Category[]> => {
  return [
    { id: 1, name: 'Искусственный интеллект' },
    { id: 2, name: 'Программирование' },
    { id: 3, name: 'Информационная безопасность' },
    { id: 4, name: 'Робототехника' },
    { id: 5, name: 'Предпринимательство' },
     { id: 6, name:  'Финансовая грамотность' },
      { id: 7, name: 'Наука' },
  ];
};

export const fetchGrades = async (): Promise<Grade[]> => {
  console.log('Fetching grades: [{ id: 1, level: 7 }, ..., { id: 5, level: 11 }]'); // Debug log
  return [
    { id: 1, level: 7 },
    { id: 2, level: 8 },
    { id: 3, level: 9 },
    { id: 4, level: 10 },
    { id: 5, level: 11 },
  ];
  // If /api/grades exists, uncomment and adjust:
  /*
  const response = await authenticatedFetch('https://daha.linkpc.net/api/grades', {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  });
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Failed to fetch grades: ${response.status} ${response.statusText} - ${errorText}`);
  }
  return response.json();
  */
};