import { useMemo, useState, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Task, TaskStatus, TaskPriority } from '@/types';
import { StatusBadge, PriorityBadge } from '@/components/ui/status-badges';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  RotateCcw,
  Paperclip 
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskGridProps {
  tasks: Task[];
  onViewTask?: (task: Task) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (task: Task) => void;
  onRestoreTask?: (task: Task) => void;
  showDeleted?: boolean;
}

export default function TaskGrid({
  tasks,
  onViewTask,
  onEditTask,
  onDeleteTask,
  onRestoreTask,
  showDeleted = false,
}: TaskGridProps) {
  const [gridApi, setGridApi] = useState<any>(null);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
  }, []);

  // Cell Renderers
  const TitleRenderer = (params: ICellRendererParams<Task>) => {
    const task = params.data;
    if (!task) return null;
    
    return (
      <div className="flex items-center gap-2 py-2">
        <span className="font-medium truncate">{task.title}</span>
        {task.attachments.length > 0 && (
          <Paperclip className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
        )}
      </div>
    );
  };

  const StatusRenderer = (params: ICellRendererParams<Task>) => {
    const task = params.data;
    if (!task) return null;
    return <StatusBadge status={task.status} />;
  };

  const PriorityRenderer = (params: ICellRendererParams<Task>) => {
    const task = params.data;
    if (!task) return null;
    return <PriorityBadge priority={task.priority} />;
  };

  const AssigneeRenderer = (params: ICellRendererParams<Task>) => {
    const task = params.data;
    if (!task) return null;
    
    if (!task.assignee) {
      return <span className="text-muted-foreground text-sm">Não atribuído</span>;
    }

    const initials = task.assignee.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return (
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6">
          <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm truncate">{task.assignee.name}</span>
      </div>
    );
  };

  const DueDateRenderer = (params: ICellRendererParams<Task>) => {
    const task = params.data;
    if (!task || !task.dueDate) return <span className="text-muted-foreground text-sm">-</span>;
    
    const isOverdue = task.dueDate < new Date() && task.status !== 'done';
    
    return (
      <span className={isOverdue ? 'text-destructive font-medium' : 'text-sm'}>
        {format(task.dueDate, "dd MMM yyyy", { locale: ptBR })}
      </span>
    );
  };

  const TagsRenderer = (params: ICellRendererParams<Task>) => {
    const task = params.data;
    if (!task || task.tags.length === 0) return null;
    
    return (
      <div className="flex items-center gap-1 flex-wrap">
        {task.tags.slice(0, 2).map((tag, index) => (
          <span 
            key={index}
            className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground"
          >
            {tag}
          </span>
        ))}
        {task.tags.length > 2 && (
          <span className="text-xs text-muted-foreground">+{task.tags.length - 2}</span>
        )}
      </div>
    );
  };

  const ActionsRenderer = (params: ICellRendererParams<Task>) => {
    const task = params.data;
    if (!task) return null;
    
    const isDeleted = !!task.deletedAt;
    
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onViewTask?.(task)}>
            <Eye className="w-4 h-4 mr-2" />
            Visualizar
          </DropdownMenuItem>
          {!isDeleted && (
            <>
              <DropdownMenuItem onClick={() => onEditTask?.(task)}>
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDeleteTask?.(task)}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </>
          )}
          {isDeleted && (
            <DropdownMenuItem onClick={() => onRestoreTask?.(task)}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Restaurar
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // Column Definitions
  const columnDefs = useMemo<ColDef<Task>[]>(() => [
    {
      headerName: 'Título',
      field: 'title',
      cellRenderer: TitleRenderer,
      flex: 2,
      minWidth: 200,
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: StatusRenderer,
      width: 140,
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Prioridade',
      field: 'priority',
      cellRenderer: PriorityRenderer,
      width: 120,
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Responsável',
      field: 'assignee',
      cellRenderer: AssigneeRenderer,
      flex: 1,
      minWidth: 150,
      sortable: true,
    },
    {
      headerName: 'Prazo',
      field: 'dueDate',
      cellRenderer: DueDateRenderer,
      width: 130,
      sortable: true,
    },
    {
      headerName: 'Tags',
      field: 'tags',
      cellRenderer: TagsRenderer,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: '',
      field: 'id',
      cellRenderer: ActionsRenderer,
      width: 60,
      sortable: false,
      filter: false,
      resizable: false,
    },
  ], [onViewTask, onEditTask, onDeleteTask, onRestoreTask]);

  const defaultColDef = useMemo<ColDef>(() => ({
    resizable: true,
    suppressMovable: true,
  }), []);

  return (
    <div className="ag-theme-custom w-full h-full rounded-lg overflow-hidden border border-border">
      <AgGridReact<Task>
        rowData={tasks}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        onGridReady={onGridReady}
        animateRows={true}
        rowSelection="multiple"
        suppressRowClickSelection={true}
        pagination={true}
        paginationPageSize={20}
        paginationPageSizeSelector={[10, 20, 50, 100]}
        domLayout="autoHeight"
        getRowId={(params) => params.data.id}
      />
    </div>
  );
}
