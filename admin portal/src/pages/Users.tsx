import React from 'react';
import { GridColDef } from '@mui/x-data-grid';
import DataTable from '../components/DataTable';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { HiOutlineEye, HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2';
import { HiOutlineCheck, HiOutlineX } from 'react-icons/hi';
import AddData from '../components/AddData';
import { Category, Grade, User, fetchUsers } from '../data/users';

const Users = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const { isLoading, isError, isSuccess, data } = useQuery({
    queryKey: ['allusers'],
    queryFn: fetchUsers,
  });

  // Adjusted columns to take more space
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80, flex: 0.1 },
    {
      field: 'username',
      headerName: 'Логин',
      flex: 0.3,
      minWidth: 200,
      renderCell: (params) => (
        <div className="font-medium">
          {params.row.username}
        </div>
      ),
    },
    {
      field: 'first_name',
      headerName: 'Имя',
      flex: 0.3,
      minWidth: 180,
      renderCell: (params) => (
        <div className="text-sm">
          {params.row.first_name}
        </div>
      ),
    },
    {
      field: 'role',
      headerName: 'Роль',
      flex: 0.2,
      minWidth: 150,
      renderCell: (params) => (
        <span className={`badge ${
          params.row.role === 'admin' ? 'badge-primary' : 'badge-secondary'
        }`}>
          {params.row.role === 'admin' ? 'Админ' : 'Пользователь'}
        </span>
      ),
    },
    {
      field: 'telegram_notifications',
      headerName: 'Телеграм',
      flex: 0.2,
      minWidth: 150,
      renderCell: (params) => (
        params.row.telegram_notifications ? (
          <HiOutlineCheck className="text-green-500 text-lg" />
        ) : (
          <HiOutlineX className="text-red-500 text-lg" />
        )
      ),
    },
    {
      field: 'created_at',
      headerName: 'Создан',
      flex: 0.3,
      minWidth: 180,
      renderCell: (params) => (
        <div className="text-sm">
          {new Date(params.row.created_at).toLocaleDateString('ru-RU')}
        </div>
      ),
    },
   // Then in your column definition:
{
  field: 'saved_filters',
  headerName: 'Сохраненные фильтры',
  flex: 0.5,
  minWidth: 300,
  renderCell: (params: { row: User }) => (
    <div className="text-sm space-y-1">
      {params.row.saved_filters?.categories?.length > 0 && (
        <div>
          Категории:{" "}
          {params.row.saved_filters.categories
            .map((cat: Category) => cat.name)
            .join(", ")}
        </div>
      )}
      {params.row.saved_filters?.levels?.length > 0 && (
        <div>
          Уровни: {params.row.saved_filters.levels.join(", ")}
        </div>
      )}
      {params.row.saved_filters?.grades?.length > 0 && (
        <div>
          Оценки:{" "}
          {params.row.saved_filters.grades
            .map((grade: Grade) => grade.level)
            .join(", ")}
        </div>
      )}
    </div>
  ),
},
    {
      field: 'actions',
      headerName: 'Действия',
      flex: 0.3,
      minWidth: 180,
      renderCell: (params) => (
        <div className="flex gap-2">
          <button 
            onClick={() => toast('Просмотр: ' + params.row.id)}
            className="text-blue-500 hover:text-blue-700"
          >
            <HiOutlineEye size={18} />
          </button>
          <button 
            onClick={() => toast('Редактировать: ' + params.row.id)}
            className="text-green-500 hover:text-green-700"
          >
            <HiOutlinePencilSquare size={18} />
          </button>
          <button 
            onClick={() => toast('Удалить: ' + params.row.id)}
            className="text-red-500 hover:text-red-700"
          >
            <HiOutlineTrash size={18} />
          </button>
        </div>
      ),
    },
  ];

  React.useEffect(() => {
    if (isLoading) {
      toast.loading('Загрузка...', { id: 'promiseUsers' });
    }
    if (isError) {
      toast.error('Ошибка при загрузке данных!', {
        id: 'promiseUsers',
      });
    }
    if (isSuccess) {
      toast.success('Данные успешно загружены!', {
        id: 'promiseUsers',
      });
    }
  }, [isError, isLoading, isSuccess]);

  return (
    <div className="w-full p-0 m-0">
      <div className="w-full flex flex-col items-stretch gap-3">
        <div className="w-full flex justify-between mb-5">
          <div className="flex gap-1 justify-start flex-col items-start">
            <h2 className="font-bold text-2xl xl:text-4xl mt-0 pt-0 text-base-content dark:text-neutral-200">
              Пользователи
            </h2>
            {data && data.length > 0 && (
              <span className="text-neutral dark:text-neutral-content font-medium text-base">
                Найдено {data.length} пользователей
              </span>
            )}
          </div>
          {/* <button
            onClick={() => setIsOpen(true)}
            className={`btn ${isLoading ? 'btn-disabled' : 'btn-primary'}`}
          >
            Добавить пользователя +
          </button> */}
        </div>
        
        <div className="w-full" style={{ height: 'calc(100vh - 200px)' }}>
          {isLoading ? (
            <DataTable
              slug="users"
              columns={columns}
              rows={[]}
              includeActionColumn={false}
            />
          ) : isSuccess ? (
            <DataTable
              slug="users"
              columns={columns}
              rows={data}
              includeActionColumn={false}
            />
          ) : (
            <>
              <DataTable
                slug="users"
                columns={columns}
                rows={[]}
                includeActionColumn={false}
              />
              <div className="w-full flex justify-center">
                Ошибка при загрузке данных!
              </div>
            </>
          )}
        </div>

        {isOpen && (
          <AddData
            slug={'user'}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        )}
      </div>
    </div>
  );
};

export default Users;