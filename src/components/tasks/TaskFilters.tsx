import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Filter, 
  X, 
  CalendarIcon, 
  ChevronDown,
  RotateCcw 
} from 'lucide-react';
import { TaskFilters, TaskStatus, TaskPriority, User } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { mockUsers } from '@/data/mockData';

interface TaskFiltersProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  onReset: () => void;
}

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'A Fazer' },
  { value: 'in_progress', label: 'Em Progresso' },
  { value: 'review', label: 'Revisão' },
  { value: 'done', label: 'Concluído' },
];

const priorityOptions: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' },
  { value: 'urgent', label: 'Urgente' },
];

export default function TaskFiltersComponent({ filters, onFiltersChange, onReset }: TaskFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeFiltersCount = [
    filters.status?.length,
    filters.priority?.length,
    filters.assignee?.length,
    filters.dateRange ? 1 : 0,
    filters.showDeleted ? 1 : 0,
  ].filter(Boolean).reduce((a, b) => (a || 0) + (b || 0), 0) || 0;

  const handleStatusChange = (status: TaskStatus, checked: boolean) => {
    const current = filters.status || [];
    const updated = checked 
      ? [...current, status]
      : current.filter(s => s !== status);
    onFiltersChange({ ...filters, status: updated.length > 0 ? updated : undefined });
  };

  const handlePriorityChange = (priority: TaskPriority, checked: boolean) => {
    const current = filters.priority || [];
    const updated = checked 
      ? [...current, priority]
      : current.filter(p => p !== priority);
    onFiltersChange({ ...filters, priority: updated.length > 0 ? updated : undefined });
  };

  const handleAssigneeChange = (userId: string, checked: boolean) => {
    const current = filters.assignee || [];
    const updated = checked 
      ? [...current, userId]
      : current.filter(id => id !== userId);
    onFiltersChange({ ...filters, assignee: updated.length > 0 ? updated : undefined });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
              {activeFiltersCount}
            </Badge>
          )}
          <ChevronDown className="w-4 h-4 ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filtros Avançados</h4>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onReset}
              className="h-8 text-muted-foreground"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Limpar
            </Button>
          </div>

          <Separator />

          {/* Status Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Status</Label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${option.value}`}
                    checked={filters.status?.includes(option.value) || false}
                    onCheckedChange={(checked) => handleStatusChange(option.value, checked === true)}
                  />
                  <Label 
                    htmlFor={`status-${option.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Priority Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Prioridade</Label>
            <div className="grid grid-cols-2 gap-2">
              {priorityOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`priority-${option.value}`}
                    checked={filters.priority?.includes(option.value) || false}
                    onCheckedChange={(checked) => handlePriorityChange(option.value, checked === true)}
                  />
                  <Label 
                    htmlFor={`priority-${option.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Assignee Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Responsável</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
              {mockUsers.map((user) => (
                <div key={user.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`user-${user.id}`}
                    checked={filters.assignee?.includes(user.id) || false}
                    onCheckedChange={(checked) => handleAssigneeChange(user.id, checked === true)}
                  />
                  <Label 
                    htmlFor={`user-${user.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {user.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Show Deleted */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-deleted"
              checked={filters.showDeleted || false}
              onCheckedChange={(checked) => 
                onFiltersChange({ ...filters, showDeleted: checked === true })
              }
            />
            <Label 
              htmlFor="show-deleted"
              className="text-sm font-normal cursor-pointer"
            >
              Mostrar tarefas excluídas
            </Label>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
