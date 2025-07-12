
import React, { useEffect, useState } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import DataTable from '../components/DataTable';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { HiOutlineEye, HiOutlinePencilSquare, HiOutlineTrash, HiOutlineCheck, HiOutlineXMark } from 'react-icons/hi2';
import AddData from '../components/AddData';
import { Category, Grade, User, fetchUsers, updateUserPreferences, deleteUser, fetchCategories, fetchGrades } from '../data/users';

const Users = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const queryClient = useQueryClient();

  const { isLoading, isError, isSuccess, data } = useQuery({
    queryKey: ['allusers', '0', '100'],
    queryFn: fetchUsers,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedGrades, fetchedCategories] = await Promise.all([
          fetchGrades(),
          fetchCategories(),
        ]);
        setGrades(fetchedGrades);
        setCategories(fetchedCategories);
      } catch (error: any) {
        console.error('Failed to fetch data:', error);
        toast.error('Ошибка при загрузке классов или категорий: ' + error.message);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (isLoading) {
      toast.loading('Загрузка...', { id: 'promiseUsers' });
    }
    if (isError) {
      toast.error('Ошибка при загрузке данных!', { id: 'promiseUsers' });
    }
    if (isSuccess) {
      toast.success('Данные успешно загружены!', { id: 'promiseUsers' });
    }
  }, [isError, isLoading, isSuccess]);

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setIsOpen(true);
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      try {
        await deleteUser(id);
        toast.success('Пользователь успешно удален!');
        queryClient.invalidateQueries({ queryKey: ['allusers'] });
      } catch (error: any) {
        console.error('Delete user error:', error);
        toast.error(error.message || 'Ошибка при удалении пользователя!');
      }
    }
  };

  const handleAddOrEditUser = async (userData: any) => {
    try {
      if (!editingUser) {
        throw new Error('Нет пользователя для редактирования');
      }
      const preferences = {
        saved_filters: {
          category_id: Number(userData.categoryId) || undefined,
          level: userData.level || undefined,
          grade: userData.grades?.length > 0 ? grades.find((g) => g.id === userData.grades[0]) : undefined,
        },
        notifications: userData.notifications || 'no',
        role: userData.role || 'user',
      };

      console.log('Submitting user preferences:', preferences);

      const updatedUser = await updateUserPreferences(preferences);
      toast.success('Пользователь обновлен!');
      setIsOpen(false);
      setEditingUser(null);
      queryClient.invalidateQueries({ queryKey: ['allusers'] });
    } catch (error: any) {
      console.error('User save error:', error);
      if (error.message.includes('404')) {
        toast.error(`Ошибка: Один или несколько ID классов не найдены (отправлены: ${userData.grades?.join(', ')}, допустимые ID: 1–5, отображаемые как 7–11)`);
      } else {
        toast.error(error.message || 'Ошибка при сохранении пользователя!');
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80, flex: 0.1 },
    {
      field: 'username',
      headerName: 'Логин',
      flex: 0.3,
      minWidth: 200,
      renderCell: (params) => (
        <div className="font-medium">{params.row.username}</div>
      ),
    },
    {
      field: 'first_name',
      headerName: 'Имя',
      flex: 0.3,
      minWidth: 180,
      renderCell: (params) => (
        <div className="text-sm">{params.row.first_name || '—'}</div>
      ),
    },
    {
      field: 'role',
      headerName: 'Роль',
      flex: 0.2,
      minWidth: 150,
      renderCell: (params) => (
        <span
          className={`badge ${
            params.row.role === 'admin' ? 'badge-primary' : 'badge-secondary'
          }`}
        >
          {params.row.role === 'admin' ? 'Админ' : 'Пользователь'}
        </span>
      ),
    },
    {
      field: 'notifications',
      headerName: 'Телеграм',
      flex: 0.2,
      minWidth: 150,
      renderCell: (params) => (
        params.row.notifications === 'yes' ? (
          <HiOutlineCheck className="text-green-500 text-lg" />
        ) : (
          <HiOutlineXMark className="text-red-500 text-lg" />
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
    {
      field: 'saved_filters',
      headerName: 'Сохраненные фильтры',
      flex: 0.5,
      minWidth: 300,
      renderCell: (params: { row: User }) => {
        const category = categories.find((cat) => cat.id === params.row.saved_filters.category_id);
        const grades = params.row.saved_filters.grades || [];
        return (
          <div className="text-sm space-y-1">
            {category && <div>Категория: {category.name}</div>}
            {params.row.saved_filters.level && <div>Уровень: {params.row.saved_filters.level}</div>}
            {grades.length > 0 && (
              <div>
                Классы: {grades.map((grade: Grade) => grade.level).join(', ')}
              </div>
            )}
          </div>
        );
      },
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
            title="Просмотреть"
          >
            <HiOutlineEye size={18} />
          </button>
          <button
            onClick={() => handleEditClick(params.row)}
            className="text-green-500 hover:text-green-700"
            title="Редактировать"
          >
            <HiOutlinePencilSquare size={18} />
          </button>
          <button
            onClick={() => handleDeleteClick(params.row.id)}
            className="text-red-500 hover:text-red-700"
            title="Удалить"
          >
            <HiOutlineTrash size={18} />
          </button>
        </div>
      ),
    },
  ];

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
              <div className="w-full flex justify-center text-red-500">
                Ошибка при загрузке данных!
              </div>
            </>
          )}
        </div>

        {isOpen && (
          <AddData
            slug="user"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            initialData={editingUser}
            grades={grades}
            categories={categories}
            onSubmit={handleAddOrEditUser}
          />
        )}
      </div>
    </div>
  );
};

export default Users;
