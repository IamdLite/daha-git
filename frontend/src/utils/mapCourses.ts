import { Resource } from "../types";

export const mapCourses = (data: any[]): Resource[] => {
  return data.map((item: any) => {
    const resource: Resource = {
      id: item.id,
      title: item.title || "Без названия",
      description: item.description || "",
      url: item.url || "#",
      provider: item.provider || "Неизвестный провайдер",
      level: item.level || "Не указан",
      created_at: item.created_at || new Date().toISOString(),
      updated_at: item.updated_at || new Date().toISOString(),
      category: item.category || { id: 0, name: "Неизвестно" },
      grades: Array.isArray(item.grades) ? item.grades : [],
      startDate: item.created_at || new Date().toISOString(),
      endDate: item.updated_at || new Date().toISOString(),
      gradesEnum: Array.isArray(item.grades) ? item.grades.map((grade: number) => grade.toString()) : [],
      subjectEnum: item.category?.name || "Неизвестно",
    };
    console.log("Mapped Resource:", resource);
    return resource;
  });
};