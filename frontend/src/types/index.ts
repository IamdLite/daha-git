export interface GradeLevel {
  id: number;
  level: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface Resource {
  id: number;
  title: string;
  description: string;
  url: string;
  provider: string;
  level: string; // e.g., "Начальный"
  created_at: string;
  updated_at: string;
  category: Category;
  grades: GradeLevel[];  // Changed from number[] to GradeLevel[]
  startDate?: string;
  endDate?: string;
  gradesEnum?: string[]; // e.g., ["7", "8"]
  subjectEnum?: string; // e.g., "Программирование"
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

export type Subject =
  | "Программирование"
  | "Математика"
  | "Искусственный интеллект"
  | "Физика"
  | "Химия"
  | "Робототехника"
  | "Информационная безопасность"
  | "Предпринимательство"
  | "Финансовая грамотность"
  | "Наука"; // Expanded to match ResourceCard

export const Grade = ["7", "8", "9", "10", "11"] as const;
// export type Grade = typeof Grade[number];

export const DifficultyLevel = ["Начальный", "Средний", "Продвинутый"] as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DifficultyLevel = typeof DifficultyLevel[number];