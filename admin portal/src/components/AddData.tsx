import React, { useState, useEffect } from 'react';
import { HiOutlineXMark } from 'react-icons/hi2';
import toast from 'react-hot-toast';

interface Category {
  id: number;
  name: string;
}

interface Grade {
  id: number;
  level: number;
}

interface SavedFilters {
  category_id?: number;
  level?: string;
  grades?: Grade[];
}

interface User {
  id: number;
  username: string;
  first_name?: string;
  notifications: string;
  role: 'admin' | 'user';
  saved_filters: SavedFilters;
  created_at: string;
}

interface AddDataProps {
  slug: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  initialData?: User | null;
  grades: Grade[];
  categories: Category[];
  onSubmit: (userData: any) => Promise<void>;
}

const levels = [
  { value: 'Начальный', label: 'Начальный' },
  { value: 'Средний', label: 'Средний' },
  { value: 'Продвинутый', label: 'Продвинутый' },
];

const AddData: React.FC<AddDataProps> = ({
  slug,
  isOpen,
  setIsOpen,
  initialData,
  grades,
  categories,
  onSubmit,
}) => {
  const [showModal, setShowModal] = useState(isOpen);
  const [formData, setFormData] = useState({
    username: '',
    role: 'user' as 'admin' | 'user',
    notifications: 'no',
    categoryId: '',
    level: '',
    grades: [] as number[],
  });
  const [formIsEmpty, setFormIsEmpty] = useState(true);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && initialData) {
      const validGrades = initialData.saved_filters.grades
        ?.map((g: Grade) => g.id)
        .filter((id: number) => grades.some((grade) => grade.id === id)) || [];
      setFormData({
        username: initialData.username || '',
        role: initialData.role || 'user',
        notifications: initialData.notifications || 'no',
        categoryId: initialData.saved_filters.category_id?.toString() || '',
        level: initialData.saved_filters.level || '',
        grades: validGrades,
      });
    } else if (isOpen && !initialData) {
      setFormData({
        username: '',
        role: 'user',
        notifications: 'no',
        categoryId: '',
        level: '',
        grades: [],
      });
    }
  }, [isOpen, initialData, grades]);

  useEffect(() => {
    setFormIsEmpty(!formData.username); // Require username only
  }, [formData.username]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username) {
      toast.error('Пожалуйста, укажите логин');
      return;
    }

    // Validate grades
    const invalidGrades = formData.grades.filter((id) => !grades.some((g) => g.id === id));
    if (invalidGrades.length > 0) {
      toast.error(`Недопустимые ID классов: ${invalidGrades.join(', ')} (допустимые ID: 1–5, отображаемые как 7–11)`);
      return;
    }

    console.log('Form submission data:', formData); // Debug log

    const userData = {
      username: formData.username,
      role: formData.role,
      notifications: formData.notifications,
      categoryId: formData.categoryId ? Number(formData.categoryId) : undefined,
      level: formData.level || undefined,
      grades: formData.grades,
    };

    onSubmit(userData);
  };

  const handleGradeToggle = (gradeId: number) => {
    setFormData((prev) => {
      if (prev.grades.includes(gradeId)) {
        return { ...prev, grades: prev.grades.filter((g) => g !== gradeId) };
      } else {
        return { ...prev, grades: [...prev.grades, gradeId] };
      }
    });
  };

  const handleNotificationsToggle = () => {
    setFormData((prev) => ({
      ...prev,
      notifications: prev.notifications === 'yes' ? 'no' : 'yes',
    }));
  };

  if (slug === 'user') {
    return (
      <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center bg-black/75 z-[99]">
        <div
          className={`w-[80%] xl:w-[50%] rounded-lg p-7 bg-base
            4-100 relative transition duration-300 flex flex-col items-stretch gap-5 ${
            showModal ? 'translate-y-0' : 'translate-y-full'
          } ${showModal ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="w-full flex justify-between pb-5 border-b border-base-content border-opacity-30">
            <button
              onClick={() => {
                setShowModal(false);
                setIsOpen(false);
              }}
              className="absolute top-5 right-3 btn btn-ghost btn-circle"
            >
              <HiOutlineXMark className="text-xl font-bold" />
            </button>
            <span className="text-2xl font-bold">
              {initialData ? 'Редактировать пользователя' : 'Добавить пользователя'}
            </span>
          </div>
          <form
            onSubmit={handleSubmit}
            className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            <input
              type="text"
              placeholder="Логин"
              className="input input-bordered w-full"
              name="username"
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Роль</span>
              </div>
              <select
                className="select select-bordered"
                name="role"
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
              >
                <option value="user">Пользователь</option>
                <option value="admin">Админ</option>
              </select>
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Категория</span>
              </div>
              <select
                className="select select-bordered"
                name="categoryId"
                id="categoryId"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                <option value="">Выберите категорию</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Уровень</span>
              </div>
              <select
                className="select select-bordered"
                name="level"
                id="level"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              >
                <option value="">Выберите уровень</option>
                {levels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="form-control lg:col-span-2">
              <div className="label">
                <span className="label-text">Классы (7–11)</span>
              </div>
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
            <label className="form-control lg:col-span-2">
              <div className="label">
                <span className="label-text">Уведомления в Telegram</span>
              </div>
              <input
                type="checkbox"
                className="toggle"
                checked={formData.notifications === 'yes'}
                onChange={handleNotificationsToggle}
              />
            </label>
            <button
              type="submit"
              className={`mt-5 btn ${formIsEmpty ? 'btn-disabled' : 'btn-primary'} btn-block col-span-full font-semibold`}
            >
              {initialData ? 'Обновить' : 'Добавить'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return null;
};

export default AddData;