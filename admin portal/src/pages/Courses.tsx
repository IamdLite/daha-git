import React from 'react';
import { GridColDef } from '@mui/x-data-grid';
import DataTable from '../components/DataTable';
import toast from 'react-hot-toast';
import { HiOutlineEye, HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2';
import { coursesData } from '../data/courses';
import CourseForm from '../components/courseForm';

const Courses = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [data, setData] = React.useState<any[]>([]);
  const [editingCourse, setEditingCourse] = React.useState<any>(null);

  const categories = [
    { id: 1, name: 'Программирование' },
    { id: 2, name: 'Математика' },
    { id: 3, name: 'Искусственный интеллект' },
    { id: 4, name: 'Физика' },
    { id: 5, name: 'Химия' },
    { id: 6, name: 'Робототехника' },
    { id: 7, name: 'Информационная безопасность' },
    { id: 8, name: 'Финансовая грамотность' },
    { id: 9, name: 'Наука' }
  ];

  React.useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      try {
        setTimeout(() => {
          setData(coursesData);
          setIsLoading(false);
          toast.success('Данные успешно загружены!', {
            id: 'promiseCourses',
          });
        }, 500);
      } catch (error) {
        setIsError(true);
        setIsLoading(false);
        toast.error('Ошибка при загрузке данных!', {
          id: 'promiseCourses',
        });
      }
    };
    fetchData();
  }, []);

  const handleAddCourse = (courseData: any) => {
    const newCourse = {
      id: Math.max(...data.map(c => c.id)) + 1,
      ...courseData,
      category: categories.find(cat => cat.id === Number(courseData.categoryId)),
      grades: courseData.grades.map((grade: number) => ({ level: grade }))
    };
    
    setData([...data, newCourse]);
    setIsOpen(false);
    toast.success('Курс успешно добавлен!');
  };

  const handleEditCourse = (courseData: any) => {
    setData(data.map(course => 
      course.id === editingCourse.id ? {
        ...course,
        title: courseData.title,
        description: courseData.description,
        url: courseData.url,
        provider: courseData.provider,
        level: courseData.level,
        startDate: courseData.startDate,
        endDate: courseData.endDate,
        category: categories.find(cat => cat.id === Number(courseData.categoryId)),
        grades: courseData.grades.map((grade: number) => ({ level: grade }))
      } : course
    ));
    setIsOpen(false);
    setEditingCourse(null);
    toast.success('Курс успешно обновлен!');
  };

  const handleDeleteCourse = (id: number) => {
    setData(data.filter(course => course.id !== id));
    toast.success('Курс успешно удален!');
  };

  const handleEditClick = (course: any) => {
    setEditingCourse({
      ...course,
      categoryId: course.category?.id?.toString() || '',
      grades: course.grades?.map((g: any) => g.level) || []
    });
    setIsOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот курс?')) {
      handleDeleteCourse(id);
    }
  };

  const columns: GridColDef[] = [
    { 
      field: 'id', 
      headerName: 'ID', 
      flex: 0.1,
      minWidth: 60 
    },
    {
      field: 'title',
      headerName: 'Название',
      flex: 0.3,
      minWidth: 200,
      renderCell: (params) => (
        <div className="flex flex-col gap-1 py-2">
          <span className="font-medium dark:text-white line-clamp-2">
            {params.row.title}
          </span>
        </div>
      ),
    },
    {
      field: 'provider',
      headerName: 'Компания',
      flex: 0.2,
      minWidth: 120,
      renderCell: (params) => (
        <div className="text-sm line-clamp-2">
          {params.row.provider}
        </div>
      ),
    },
    {
      field: 'description',
      headerName: 'Описание',
      flex: 0.3,
      minWidth: 180,
      renderCell: (params) => (
        <p className="text-sm line-clamp-2 text-neutral-400">
          {params.row.description}
        </p>
      ),
    },
    {
      field: 'category',
      headerName: 'Категория',
      flex: 0.2,
      minWidth: 120,
      renderCell: (params) => (
        <div className="flex flex-wrap gap-1">
          {params.row.category && (
            <div className="rounded-full bg-base-200 dark:bg-base-300 px-2 py-1 text-xs line-clamp-1">
              {params.row.category.name}
            </div>
          )}
        </div>
      ),
    },
    {
      field: 'level',
      headerName: 'Уровень',
      flex: 0.15,
      minWidth: 100,
      renderCell: (params) => (
        <span className="text-sm">{params.row.level}</span>
      ),
    },
    {
      field: 'grades',
      headerName: 'Оценки',
      flex: 0.2,
      minWidth: 120,
      renderCell: (params) => (
        <div className="flex flex-wrap gap-1">
          {params.row.grades?.map((grade: any, index: number) => (
            <div 
              className="rounded-full bg-base-200 dark:bg-base-300 px-1.5 py-0.5 text-xs"
              key={index}
            >
              {grade.level}
            </div>
          ))}
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
          Перейти
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
          <span>Начало: {new Date(params.row.startDate).toLocaleDateString()}</span>
          <span>Конец: {new Date(params.row.endDate).toLocaleDateString()}</span>
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
            <DataTable
              slug="courses"
              columns={columns}
              rows={[]}
              includeActionColumn={false}
            />
          ) : isError ? (
            <>
              <DataTable
                slug="courses"
                columns={columns}
                rows={[]}
                includeActionColumn={false}
              />
              <div className="w-full flex justify-center">
                Ошибка при загрузке данных!
              </div>
            </>
          ) : (
            <DataTable
              slug="courses"
              columns={columns}
              rows={data}
              includeActionColumn={false}
            />
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
        />
      </div>
    </div>
  );
};

export default Courses;