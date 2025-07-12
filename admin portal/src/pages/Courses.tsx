// src/pages/Courses.tsx
import React, { useEffect, useState } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import DataTable from '../components/DataTable';
import toast from 'react-hot-toast';
import { HiOutlineEye, HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2';
import CourseForm from '../components/courseForm';
import { useAuth } from '../contexts/AuthContext';
import { fetchCourses, addCourse, updateCourse, deleteCourse, fetchCategories, fetchGrades } from '../api/ApiCollection';
import { useNavigate } from 'react-router-dom';

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

const Courses = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [data, setData] = useState<Course[]>([]);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [courses, fetchedCategories, fetchedGrades] = await Promise.all([
          fetchCourses(0, 100),
          fetchCategories(),
          fetchGrades(),
        ]);
        setData(courses);
        setCategories(fetchedCategories);
        setGrades(fetchedGrades);
        setIsLoading(false);
        toast.success('Данные успешно загружены!', { id: 'promiseCourses' });
      } catch (error: any) {
        console.error('Fetch error:', error);
        setIsError(error.message);
        setIsLoading(false);
        if (error.message.includes('401') || error.message.includes('403')) {
          logout();
          navigate('/login', { replace: true });
          toast.error('Сессия истекла. Пожалуйста, войдите снова.');
        } else {
          toast.error('Ошибка при загрузке данных: ' + error.message, { id: 'promiseCourses' });
        }
      }
    };
    fetchData();
  }, [logout, navigate]);

  const handleAddCourse = async (courseData: any) => {
    console.log('Submitting course data:', courseData); // Debug log
    try {
      const newCourse = await addCourse({
        title: courseData.title,
        description: courseData.description,
        url: courseData.url,
        provider: courseData.provider,
        category_id: Number(courseData.categoryId),
        level: courseData.level,
        grade_ids: courseData.grades.map(Number),
        start_date: courseData.startDate,
        end_date: courseData.endDate,
      });
      setData([...data, newCourse]);
      setIsOpen(false);
      toast.success('Курс успешно добавлен!');
    } catch (error: any) {
      console.error('Add course error:', error);
      if (error.message.includes('404')) {
        toast.error(`Ошибка: Один или несколько ID оценок не найдены (отправлены: ${courseData.grades.join(', ')}, допустимые ID: 1–5)`);
      } else if (error.message.includes('400')) {
        toast.error('Ошибка: Проверьте правильность введенных данных (например, категория или даты)');
      } else {
        toast.error(error.message || 'Ошибка при добавлении курса!');
      }
    }
  };

  const handleEditCourse = async (courseData: any) => {
    if (!editingCourse) return;
    console.log('Editing course data:', courseData); // Debug log
    try {
      const updatedCourse = await updateCourse(editingCourse.id, {
        title: courseData.title,
        description: courseData.description,
        url: courseData.url,
        provider: courseData.provider,
        category_id: Number(courseData.categoryId),
        level: courseData.level,
        grade_ids: courseData.grades.map(Number),
        start_date: courseData.startDate,
        end_date: courseData.endDate,
      });
      setData(data.map((course) => (course.id === editingCourse.id ? updatedCourse : course)));
      setIsOpen(false);
      setEditingCourse(null);
      toast.success('Курс успешно обновлен!');
    } catch (error: any) {
      console.error('Update course error:', error);
      if (error.message.includes('404')) {
        toast.error(`Ошибка: Один или несколько ID оценок не найдены (отправлены: ${courseData.grades.join(', ')}, допустимые ID: 1–5)`);
      } else if (error.message.includes('400')) {
        toast.error('Ошибка: Проверьте правильность введенных данных (например, категория или даты)');
      } else {
        toast.error(error.message || 'Ошибка при обновлении курса!');
      }
    }
  };

  const handleDeleteCourse = async (id: number) => {
    try {
      await deleteCourse(id);
      setData(data.filter((course) => course.id !== id));
      toast.success('Курс успешно удален!');
    } catch (error: any) {
      console.error('Delete course error:', error);
      toast.error(error.message || 'Ошибка при удалении курса!');
    }
  };

  const handleEditClick = (course: Course) => {
    const validGrades = course.grades
      ?.map((g: Grade) => g.id)
      .filter((id: number) => grades.some((grade) => grade.id === id)) || [];
    setEditingCourse({
      ...course,
      categoryId: course.category?.id?.toString() || '',
      grades: validGrades,
      startDate: course.start_date,
      endDate: course.end_date,
    });
    setIsOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот курс?')) {
      handleDeleteCourse(id);
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 0.1, minWidth: 60 },
    {
      field: 'title',
      headerName: 'Название',
      flex: 0.3,
      minWidth: 200,
      renderCell: (params) => (
        <div className="flex flex-col gap-1 py-2">
          <span className="font-medium dark:text-white line-clamp-2">{params.row.title}</span>
        </div>
      ),
    },
    {
      field: 'provider',
      headerName: 'Компания',
      flex: 0.2,
      minWidth: 120,
      renderCell: (params) => <div className="text-sm line-clamp-2">{params.row.provider || '—'}</div>,
    },
    {
      field: 'description',
      headerName: 'Описание',
      flex: 0.3,
      minWidth: 180,
      renderCell: (params) => (
        <p className="text-sm line-clamp-2 text-neutral-400">{params.row.description || '—'}</p>
      ),
    },
    {
      field: 'category',
      headerName: 'Категория',
      flex: 0.2,
      minWidth: 120,
      renderCell: (params) => (
        <div className="flex flex-wrap gap-1">
          {params.row.category ? (
            <div className="rounded-full bg-base-200 dark:bg-base-300 px-2 py-1 text-xs line-clamp-1">
              {params.row.category.name}
            </div>
          ) : (
            <div className="text-sm text-neutral-400">—</div>
          )}
        </div>
      ),
    },
    {
      field: 'level',
      headerName: 'Уровень',
      flex: 0.15,
      minWidth: 100,
      renderCell: (params) => <span className="text-sm">{params.row.level || '—'}</span>,
    },
    {
      field: 'grades',
      headerName: 'Оценки',
      flex: 0.2,
      minWidth: 120,
      renderCell: (params) => (
        <div className="flex flex-wrap gap-1">
          {params.row.grades?.length ? (
            params.row.grades.map((grade: Grade, index: number) => (
              <div
                className="rounded-full bg-base-200 dark:bg-base-300 px-1.5 py-0.5 text-xs"
                key={index}
              >
                {grade.level}
              </div>
            ))
          ) : (
            <div className="text-sm text-neutral-400">—</div>
          )}
        </div>
      ),
    },
    {
      field: 'url',
      headerName: 'Ссылка',
      flex: 0.15,
      minWidth: 100,
      renderCell: (params) => (
        <a
          href={params.row.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline line-clamp-1"
        >
          {params.row.url ? 'Перейти' : '—'}
        </a>
      ),
    },
    {
      field: 'dates',
      headerName: 'Даты',
      flex: 0.2,
      minWidth: 150,
      renderCell: (params) => (
        <div className="flex flex-col text-xs">
          <span>
            Начало:{' '}
            {params.row.start_date ? new Date(params.row.start_date).toLocaleDateString() : '—'}
          </span>
          <span>
            Конец: {params.row.end_date ? new Date(params.row.end_date).toLocaleDateString() : '—'}
          </span>
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: 'Действия',
      flex: 0.2,
      minWidth: 120,
      renderCell: (params) => (
        <div className="flex items-center gap-1.5 w-full">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toast('Просмотр: ' + params.row.id);
            }}
            className="text-blue-500 hover:text-blue-700 p-1"
            title="Просмотреть"
          >
            <HiOutlineEye size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(params.row);
            }}
            className="text-green-500 hover:text-green-700 p-1"
            title="Редактировать"
          >
            <HiOutlinePencilSquare size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(params.row.id);
            }}
            className="text-red-500 hover:text-red-700 p-1"
            title="Удалить"
          >
            <HiOutlineTrash size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full p-4">
      <div className="w-full flex flex-col items-stretch gap-3">
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
          <div className="flex flex-col">
            <h2 className="font-bold text-2xl xl:text-4xl text-base-content dark:text-neutral-200">
              Курсы
            </h2>
            {data && data.length > 0 && (
              <span className="text-neutral dark:text-neutral-content font-medium text-base">
                Найдено {data.length} курсов
              </span>
            )}
          </div>
          <button
            onClick={() => {
              setEditingCourse(null);
              setIsOpen(true);
            }}
            className={`btn btn-primary w-full sm:w-auto ${isLoading ? 'btn-disabled' : ''}`}
          >
            Добавить курс +
          </button>
        </div>

        <div className="w-full" style={{ height: 'calc(100vh - 200px)' }}>
          {isLoading ? (
            <DataTable slug="courses" columns={columns} rows={[]} includeActionColumn={false} />
          ) : isError ? (
            <>
              <DataTable slug="courses" columns={columns} rows={[]} includeActionColumn={false} />
              <div className="w-full flex justify-center text-red-500">{isError}</div>
            </>
          ) : (
            <DataTable slug="courses" columns={columns} rows={data} includeActionColumn={false} />
          )}
        </div>

        <CourseForm
          onSubmit={editingCourse ? handleEditCourse : handleAddCourse}
          onCancel={() => {
            setIsOpen(false);
            setEditingCourse(null);
          }}
          isOpen={isOpen}
          initialData={editingCourse}
          categories={categories}
          grades={grades}
        />
      </div>
    </div>
  );
};

export default Courses;