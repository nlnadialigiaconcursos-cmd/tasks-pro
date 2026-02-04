import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TaskStatus, TaskPriority, UserRole } from '@/types';

// Status Badge
const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  todo: { label: 'A Fazer', className: 'status-todo' },
  in_progress: { label: 'Em Progresso', className: 'status-in-progress' },
  review: { label: 'Revisão', className: 'status-review' },
  done: { label: 'Concluído', className: 'status-done' },
};

interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={cn('font-medium border-0', config.className, className)}>
      {config.label}
    </Badge>
  );
}

// Priority Badge
const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  low: { label: 'Baixa', className: 'priority-low' },
  medium: { label: 'Média', className: 'priority-medium' },
  high: { label: 'Alta', className: 'priority-high' },
  urgent: { label: 'Urgente', className: 'priority-urgent' },
};

interface PriorityBadgeProps {
  priority: TaskPriority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  return (
    <Badge variant="outline" className={cn('font-medium border-0', config.className, className)}>
      {config.label}
    </Badge>
  );
}

// Role Badge
const roleConfig: Record<UserRole, { label: string; className: string }> = {
  owner: { label: 'Proprietário', className: 'role-owner' },
  editor: { label: 'Editor', className: 'role-editor' },
  viewer: { label: 'Visualizador', className: 'role-viewer' },
};

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const config = roleConfig[role];
  return (
    <Badge variant="outline" className={cn('font-medium border-0', config.className, className)}>
      {config.label}
    </Badge>
  );
}
