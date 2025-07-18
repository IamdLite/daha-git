import React, { useEffect, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../components/DataTable";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  HiOutlineCheck,
  HiOutlineXMark,
} from "react-icons/hi2";
import AddData from "../components/AddData";
import {
  Category,
  Grade,
  User,
  fetchUsers,
  updateUserPreferences,
  deleteUser,
  fetchCategories,
  fetchGrades,
} from "../data/users";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Button,
} from "@mui/material";

const Users = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const queryClient = useQueryClient();

  // Для диалога admin-кода
  const [adminCodeDialog, setAdminCodeDialog] = useState<null | { user: User }>(null);
  const [adminCode, setAdminCode] = useState("");
  const [promoteLoading, setPromoteLoading] = useState(false);

  const { isLoading, isError, isSuccess, data } = useQuery({
    queryKey: ["allusers", "0", "100"],
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
        console.error("Failed to fetch data:", error);
        toast.error(
          "Ошибка при загрузке классов или категорий: " + error.message
        );
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (isLoading) {
      toast.loading("Загрузка...", { id: "promiseUsers" });
    }
    if (isError) {
      toast.error("Ошибка при загрузке данных!", { id: "promiseUsers" });
    }
    if (isSuccess) {
      toast.success("Данные успешно загружены!", { id: "promiseUsers" });
    }
  }, [isError, isLoading, isSuccess]);

  const handleDeleteClick = async (id: number) => {
    if (window.confirm("Вы уверены, что хотите удалить этого пользователя?")) {
      try {
        await deleteUser(id);
        toast.success("Пользователь успешно удален!");
        queryClient.invalidateQueries({ queryKey: ["allusers"] });
      } catch (error: any) {
        console.error("Delete user error:", error);
        toast.error(error?.message || "Ошибка при удалении пользователя!");
      }
    }
  };

  // === Показать диалог промоута ===
  const promoteToAdmin = (user: User) => {
    if (user.role === "admin") {
      toast("Пользователь уже админ");
      return;
    }
    setAdminCodeDialog({ user });
    setAdminCode("");
  };

  // === Подтвердить промоут с admin-кодом ===
  const confirmPromote = async () => {
    if (!adminCodeDialog?.user || !adminCode) return;
    setPromoteLoading(true);

    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("Отсутствует access_token. Войдите заново как админ.");
      setPromoteLoading(false);
      setAdminCodeDialog(null);
      return;
    }

    try {
      const resp = await fetch("https://daha.linkpc.net/api/users/set-admin", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: adminCodeDialog.user.id,
          username: adminCodeDialog.user.username,
          code: adminCode,
        }),
      });
      if (resp.ok) {
        toast.success("Пользователь теперь администратор!");
        queryClient.invalidateQueries({ queryKey: ["allusers"] });
        setAdminCodeDialog(null);
      } else {
        const json = await resp.json().catch(() => ({}));
        toast.error("Ошибка: " + (json.detail || resp.statusText));
      }
    } catch (error: any) {
      toast.error("Ошибка сети: " + (error?.message || String(error)));
    } finally {
      setPromoteLoading(false);
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 80, flex: 0.1 },
    {
      field: "username",
      headerName: "Логин",
      flex: 0.3,
      minWidth: 200,
      renderCell: (params) => (
        <div className="font-medium">{params.row.username}</div>
      ),
    },
    {
      field: "first_name",
      headerName: "Имя",
      flex: 0.3,
      minWidth: 180,
      renderCell: (params) => (
        <div className="text-sm">{params.row.first_name || "—"}</div>
      ),
    },
    {
      field: "role",
      headerName: "Роль",
      flex: 0.2,
      minWidth: 150,
      renderCell: (params) => (
        <span
          className={`badge ${
            params.row.role === "admin"
              ? "badge-primary"
              : "badge-secondary"
          }`}
        >
          {params.row.role === "admin" ? "Админ" : "Пользователь"}
        </span>
      ),
    },
    {
      field: "notifications",
      headerName: "Телеграм",
      flex: 0.2,
      minWidth: 150,
      renderCell: (params) =>
        params.row.notifications === "yes" ? (
          <HiOutlineCheck className="text-green-500 text-lg" />
        ) : (
          <HiOutlineXMark className="text-red-500 text-lg" />
        ),
    },
    {
      field: "created_at",
      headerName: "Создан",
      flex: 0.3,
      minWidth: 180,
      renderCell: (params) => (
        <div className="text-sm">
          {new Date(params.row.created_at).toLocaleDateString("ru-RU")}
        </div>
      ),
    },
    {
      field: "saved_filters",
      headerName: "Сохраненные фильтры",
      flex: 0.5,
      minWidth: 300,
      renderCell: (params: { row: User }) => {
        const category = categories.find(
          (cat) => cat.id === params.row.saved_filters.category_id
        );
        const grades = params.row.saved_filters.grades || [];
        return (
          <div className="text-sm space-y-1">
            {category && <div>Категория: {category.name}</div>}
            {params.row.saved_filters.level && (
              <div>Уровень: {params.row.saved_filters.level}</div>
            )}
            {grades.length > 0 && (
              <div>
                Классы: {grades.map((grade: Grade) => grade.level).join(", ")}
              </div>
            )}
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "Действия",
      flex: 0.3,
      minWidth: 220,
      renderCell: (params) => (
        <div className="flex gap-2">
          <button
            onClick={() => promoteToAdmin(params.row)}
            className={`text-blue-600 hover:text-blue-800 font-semibold border border-blue-200 rounded px-3 py-1 disabled:opacity-40`}
            title={
              params.row.role === "admin"
                ? "Пользователь уже админ"
                : "Сделать админом"
            }
            disabled={params.row.role === "admin"}
          >
            Сделать админом
          </button>
          <button
            onClick={() => handleDeleteClick(params.row.id)}
            className="text-red-500 hover:text-red-700 font-semibold border border-red-200 rounded px-3 py-1"
            title="Удалить пользователя"
          >
            Удалить
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Диалог admin-кода */}
      <Dialog
        open={!!adminCodeDialog}
        onClose={() => !promoteLoading && setAdminCodeDialog(null)}
      >
        <DialogTitle>Подтвердите действие</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Чтобы сделать пользователя{" "}
            <b>{adminCodeDialog?.user?.username}</b> администратором, введите секретный admin-код.
          </Typography>
          <TextField
            label="Admin-код"
            type="password"
            fullWidth
            autoFocus
            disabled={promoteLoading}
            value={adminCode}
            onChange={(e) => setAdminCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !promoteLoading && !!adminCode) confirmPromote();
            }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Button
            onClick={() => setAdminCodeDialog(null)}
            disabled={promoteLoading}
          >
            Отмена
          </Button>
          <Button
            onClick={confirmPromote}
            disabled={promoteLoading || !adminCode}
            variant="contained"
            color="primary"
          >
            {promoteLoading ? "Обработка..." : "Подтвердить"}
          </Button>
        </DialogActions>
      </Dialog>

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

          <div className="w-full" style={{ height: "calc(100vh - 200px)" }}>
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

          {/* AddData убран, так как ручное добавление/редактирование юзеров больше неактуально */}
        </div>
      </div>
    </>
  );
};

export default Users;
