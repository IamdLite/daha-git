import React from 'react';
import { HiOutlineXMark } from 'react-icons/hi2';
import toast from 'react-hot-toast';

interface CourseFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isOpen: boolean;
  initialData?: any;
}

const categories = [
  { id: 1, name: 'Программирование' },
  { id: 2, name: 'Дизайн' },
  { id: 3, name: 'Маркетинг' },
  { id: 4, name: 'Аналитика данных' },
  { id: 5, name: 'Управление' }
];

const levels = [
  { value: 'Начальный', label: 'Начальный' },
  { value: 'Средний', label: 'Средний' },
  { value: 'Продвинутый', label: 'Продвинутый' }
];

const grades = Array.from({ length: 11 }, (_, i) => i + 1); // Grades from 1 to 11

const CourseForm: React.FC<CourseFormProps> = ({ 
  onSubmit, 
  onCancel, 
  isOpen,
  initialData 
}) => {
  const [formData, setFormData] = React.useState({
    title: '',
    provider: '',
    description: '',
    level: 'Начальный',
    url: '',
    startDate: '',
    endDate: '',
    categoryId: '',
    grades: [] as number[]
  });

  const [showModal, setShowModal] = React.useState(false);

  React.useEffect(() => {
    setShowModal(isOpen);
    
    if (isOpen && initialData) {
      setFormData({
        title: initialData.title || '',
        provider: initialData.provider || '',
        description: initialData.description || '',
        level: initialData.level || 'Начальный',
        url: initialData.url || '',
        startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
        endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
        categoryId: initialData.category?.id?.toString() || initialData.categoryId || '',
        grades: initialData.grades ? initialData.grades.map((g: any) => g.level) : []
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
        grades: []
      });
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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

    const selectedCategory = categories.find(cat => cat.id === Number(formData.categoryId));
    
    const courseData = {
      title: formData.title,
      description: formData.description,
      url: formData.url,
      provider: formData.provider,
      level: formData.level,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      category: selectedCategory,
      grades: formData.grades.map(grade => ({ level: grade }))
    };

    onSubmit(courseData);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({...formData, categoryId: e.target.value});
  };

  const handleGradeToggle = (grade: number) => {
    setFormData(prev => {
      if (prev.grades.includes(grade)) {
        return {
          ...prev,
          grades: prev.grades.filter(g => g !== grade)
        };
      } else {
        return {
          ...prev,
          grades: [...prev.grades, grade]
        };
      }
    });
  };

  return (
    <div className={`w-screen h-screen fixed top-0 left-0 flex justify-center items-center bg-black/75 z-[99] ${
      !showModal ? 'hidden' : ''
    }`}>
      <div
        className={`w-[80%] xl:w-[50%] rounded-lg p-7 bg-base-100 relative transition duration-300 flex flex-col items-stretch gap-5 ${
          showModal ? 'translate-y-0' : 'translate-y-full'
        } ${
          showModal ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="w-full flex justify-between pb-5 border-b border-base-content border-opacity-30">
          <button
            onClick={() => {
              setShowModal(false);
              onCancel();
            }}
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
              onChange={(e) => setFormData({...formData, title: e.target.value})}
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
              onChange={(e) => setFormData({...formData, provider: e.target.value})}
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
              onChange={(e) => setFormData({...formData, description: e.target.value})}
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
              {categories.map(category => (
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
              onChange={(e) => setFormData({...formData, level: e.target.value})}
              required
            >
              {levels.map(level => (
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
              onChange={(e) => setFormData({...formData, url: e.target.value})}
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
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
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
              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              required
            />
          </div>

          <div className="form-control lg:col-span-2">
            <label className="label">
              <span className="label-text">Оценки</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {grades.map(grade => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => handleGradeToggle(grade)}
                  className={`btn btn-sm ${formData.grades.includes(grade) ? 'btn-primary' : 'btn-outline'}`}
                >
                  {grade}
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