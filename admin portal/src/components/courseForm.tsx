// src/components/CourseForm.tsx
import React, { useState, useEffect } from 'react';
import { HiOutlineXMark } from 'react-icons/hi2';
import toast from 'react-hot-toast';

interface CourseFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isOpen: boolean;
  initialData?: any;
  categories: { id: number; name: string }[];
  grades: { id: number; level: number }[];
}

const levels = [
  { value: 'Начальный', label: 'Начальный' },
  { value: 'Средний', label: 'Средний' },
  { value: 'Продвинутый', label: 'Продвинутый' },
];

const CourseForm: React.FC<CourseFormProps> = ({
  onSubmit,
  onCancel,
  isOpen,
  initialData,
  categories,
  grades,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    provider: '',
    description: '',
    level: 'Начальный',
    url: '',
    startDate: '',
    endDate: '',
    categoryId: '',
    grades: [] as number[],
  });

  useEffect(() => {
    if (isOpen && initialData) {
      const validGrades = initialData.grades?.filter((id: number) => grades.some((g) => g.id === id)) || [];
      setFormData({
        title: initialData.title || '',
        provider: initialData.provider || '',
        description: initialData.description || '',
        level: initialData.level || 'Начальный',
        url: initialData.url || '',
        startDate: initialData.startDate
          ? new Date(initialData.startDate).toISOString().split('T')[0]
          : '',
        endDate: initialData.endDate
          ? new Date(initialData.endDate).toISOString().split('T')[0]
          : '',
        categoryId: initialData.categoryId || '',
        grades: validGrades,
      });
    } else if (isOpen && !initialData) {
      setFormData({
        title: '',
        provider: '',
        description: '',
        level: 'Начальный',
        url: '',
        startDate: '',
        endDate: '',
        categoryId: '',
        grades: [],
      });
    }
  }, [isOpen, initialData, grades]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title) {
      toast.error('Пожалуйста, укажите название курса');
      return;
    }

    if (!formData.provider) {
      toast.error('Пожалуйста, укажите провайдера');
      return;
    }

    if (!formData.categoryId) {
      toast.error('Пожалуйста, выберите категорию');
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      toast.error('Пожалуйста, укажите даты начала и окончания');
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast.error('Дата окончания должна быть после даты начала');
      return;
    }

    // Validate grades
    const invalidGrades = formData.grades.filter((id) => !grades.some((g) => g.id === id));
    if (invalidGrades.length > 0) {
      toast.error(`Недопустимые ID оценок: ${invalidGrades.join(', ')} (допустимые ID: 1–5, отображаемые как 7–11)`);
      return;
    }

    console.log('Form submission data:', formData); // Debug log

    const courseData = {
      title: formData.title,
      description: formData.description,
      url: formData.url,
      provider: formData.provider,
      level: formData.level,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      categoryId: formData.categoryId,
      grades: formData.grades,
    };

    onSubmit(courseData);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, categoryId: e.target.value });
  };

  const handleGradeToggle = (gradeId: number) => {
    setFormData((prev) => {
      if (prev.grades.includes(gradeId)) {
        return {
          ...prev,
          grades: prev.grades.filter((g) => g !== gradeId),
        };
      } else {
        return {
          ...prev,
          grades: [...prev.grades, gradeId],
        };
      }
    });
  };

  return (
    <div
      className={`w-screen h-screen fixed top-0 left-0 flex justify-center items-center bg-black/75 z-[99] ${
        !isOpen ? 'hidden' : ''
      }`}
    >
      <div
        className={`w-[80%] xl:w-[50%] rounded-lg p-7 bg-base-100 relative transition duration-300 flex flex-col items-stretch gap-5 ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        <div className="w-full flex justify-between pb-5 border-b border-base-content border-opacity-30">
          <button
            onClick={() => onCancel()}
            className="absolute top-5 right-3 btn btn-ghost btn-circle"
          >
            <HiOutlineXMark className="text-xl font-bold" />
          </button>
          <span className="text-2xl font-bold">
            {initialData ? 'Редактировать курс' : 'Добавить новый курс'}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Название курса*</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Провайдер*</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={formData.provider}
              onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
              required
            />
          </div>

          <div className="form-control lg:col-span-2">
            <label className="label">
              <span className="label-text">Описание</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Категория*</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={formData.categoryId}
              onChange={handleCategoryChange}
              required
            >
              <option value="">Выберите категорию</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Уровень*</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              required
            >
              {levels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control lg:col-span-2">
            <label className="label">
              <span className="label-text">Ссылка на курс</span>
            </label>
            <input
              type="url"
              className="input input-bordered w-full"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://example.com"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Дата начала*</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Дата окончания*</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
          </div>

          <div className="form-control lg:col-span-2">
            <label className="label">
              <span className="label-text">Классы </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {grades.map((grade) => (
                <button
                  key={grade.id}
                  type="button"
                  onClick={() => handleGradeToggle(grade.id)}
                  className={`btn btn-sm ${formData.grades.includes(grade.id) ? 'btn-primary' : 'btn-outline'}`}
                >
                  {grade.level}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="mt-5 btn btn-primary btn-block col-span-full font-semibold"
          >
            {initialData ? 'Обновить курс' : 'Добавить курс'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;