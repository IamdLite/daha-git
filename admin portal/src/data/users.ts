// ./data/users.ts
export interface Category {
  id: number;
  name: string;
}

export interface Grade {
  id: number;
  level: number;
}

export interface SavedFilters {
  categories: Category[];
  levels: string[];
  grades: Grade[];
}

export interface User {
  id: number;
  username: string;
  first_name: string;
  role: 'admin' | 'user';
  telegram_notifications: boolean;
  saved_filters: SavedFilters;
  created_at: string;
}

export interface SavedFilters {
  categories: Category[];
  levels: string[];
  grades: Grade[];
}



export const mockUsers: User[] = [
  {
    id: 1,
    username: "admin_user",
    first_name: "Admin",
    role: "admin",
    telegram_notifications: true,
    saved_filters: {
      categories: [
        { id: 1, name: "Искусственный интеллект" },
        { id: 2, name: "Веб-разработка" }
      ],
      levels: ["Начальный", "Средний"],
      grades: [
        { id: 1, level: 5 },
        { id: 2, level: 8 }
      ]
    },
    created_at: "2025-06-01T10:30:00.000Z"
  },
  {
    id: 2,
    username: "regular_user",
    first_name: "John",
    role: "user",
    telegram_notifications: false,
    saved_filters: {
      categories: [
        { id: 3, name: "Мобильная разработка" }
      ],
      levels: ["Продвинутый"],
      grades: [
        { id: 3, level: 7 }
      ]
    },
    created_at: "2025-06-15T14:45:00.000Z"
  },
  {
    id: 3,
    username: "manager_user",
    first_name: "Alice",
    role: "user",
    telegram_notifications: true,
    saved_filters: {
      categories: [
        { id: 1, name: "Искусственный интеллект" },
        { id: 4, name: "Анализ данных" }
      ],
      levels: ["Средний"],
      grades: [
        { id: 4, level: 6 }
      ]
    },
    created_at: "2025-06-20T09:15:00.000Z"
  }
];

export const fetchUsers = (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUsers);
    }, 1000);
  });
};