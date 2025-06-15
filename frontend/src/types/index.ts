// Типы для фильтрации
export enum ResourceType {
  COURSE = 'course',
}

export enum Subject {
  AI = 'ai',
  ROBOTICS = 'robotics',
  PROGRAMMING = 'programming',
  CYBERSECURITY = 'cybersecurity',
  ENTREPRENEURSHIP = 'entrepreneurship',
  FINANCIAL_LITERACY = 'financial_literacy',
  SCIENCE = 'science',
}

export enum Grade {
  GRADE_7 = '7',
  GRADE_8 = '8',
  GRADE_9 = '9',
  GRADE_10 = '10',
  GRADE_11 = '11',
}

// Уровень сложности курса
export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

// Тип ресурса (только курсы)
export interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  subjects: Subject[];
  grades: Grade[];
  startDate: string;
  endDate: string;
  url: string;
  imageUrl?: string;
  organizer?: string;
  difficultyLevel?: DifficultyLevel;
}