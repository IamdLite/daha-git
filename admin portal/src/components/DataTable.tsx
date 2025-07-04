// src/components/DataTable.tsx
import React from 'react';
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridPaginationModel,
} from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlinePencilSquare,
  HiOutlineEye,
  HiOutlineTrash,
} from 'react-icons/hi2';
import toast from 'react-hot-toast';

interface DataTableProps {
  columns: GridColDef[];
  rows: any[];
  slug: string;
  includeActionColumn?: boolean;
  pageSize?: number;
  rowsPerPageOptions?: number[];
  paginationModel?: GridPaginationModel;
  onPaginationModelChange?: (model: GridPaginationModel) => void;
  isCourseTable?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  rows,
  slug,
  includeActionColumn = true,
  pageSize = 10,
  rowsPerPageOptions = [10, 25, 50],
  paginationModel,
  onPaginationModelChange,
  isCourseTable = false,
}) => {
  const navigate = useNavigate();

  let baseColumns: GridColDef[] = [...columns];

  if (isCourseTable) {
    baseColumns = [
      { field: 'id', headerName: 'ID', width: 70 },
      {
        field: 'title',
        headerName: 'Название',
        width: 250,
        renderCell: (params) => (
          <div className="font-medium">{params.row.title}</div>
        ),
      },
      ...columns.filter(col => !['id', 'title'].includes(col.field as string))
    ];
  }

  const actionColumn: GridColDef = {
    field: 'action',
    headerName: 'Действия',
    width: 180,
    renderCell: (params) => (
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(`/${slug}/${params.row.id}`)}
          className="btn btn-ghost btn-sm hover:bg-blue-50 hover:text-blue-500"
        >
          <HiOutlineEye className="text-lg" />
        </button>
        <button
          onClick={() => toast('Редактирование: ' + params.row.title)}
          className="btn btn-ghost btn-sm hover:bg-green-50 hover:text-green-500"
        >
          <HiOutlinePencilSquare className="text-lg" />
        </button>
        <button
          onClick={() => {
            if (confirm(`Удалить ${params.row.title}?`)) {
              toast.error(`Удаление: ${params.row.title}`);
            }
          }}
          className="btn btn-ghost btn-sm hover:bg-red-50 hover:text-red-500"
        >
          <HiOutlineTrash className="text-lg" />
        </button>
      </div>
    ),
  };

  return (
    <div className="w-full bg-white rounded-lg shadow" style={{ height: 600 }}>
      <DataGrid
        rows={rows}
        columns={includeActionColumn ? [...baseColumns, actionColumn] : baseColumns}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={rowsPerPageOptions}
        initialState={{
          pagination: {
            paginationModel: { pageSize },
          },
        }}
        disableRowSelectionOnClick
        getRowHeight={() => 'auto'}
        sx={{
          '& .MuiDataGrid-cell': {
            py: 2,
            whiteSpace: 'normal',
            wordWrap: 'break-word',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'hsl(0, 0%, 98%)',
          },
          '& .MuiDataGrid-row': {
            maxHeight: 'none !important',
          },
        }}
        localeText={{
          toolbarQuickFilterPlaceholder: 'Поиск...',
        }}
      />
    </div>
  );
};

export default DataTable;