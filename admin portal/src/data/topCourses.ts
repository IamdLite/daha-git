// src/data/topCourses.ts
export interface TopCourse {
  id: number;
  title: string;
  provider: string;
  clicks: number;
}

export const topCoursesData: TopCourse[] = [
  {
    id: 1,
    title: "Основы машинного обучения и нейронных сетей",
    provider: "Яндекс Практикум",
    clicks: 245
  },
  {
    id: 2,
    title: "Python для искусственного интеллекта",
    provider: "Сириус",
    clicks: 189
  },
  {
    id: 3,
    title: "Робототехника для начинающих",
    provider: "Иннополис",
    clicks: 156
  },
  {
    id: 4,
    title: "Программирование микроконтроллеров Arduino",
    provider: "Сколтех",
    clicks: 132
  },
  {
    id: 5,
    title: "Разработка игр на Unity",
    provider: "GeekBrains",
    clicks: 121
  },
  {
    id: 6,
    title: "UX/UI дизайн с нуля",
    provider: "VK",
    clicks: 98
  },
  {
    id: 7,
    title: "Основы кибербезопасности",
    provider: "СберКибер",
    clicks: 87
  }
];