// Task Types
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type UserRole = 'owner' | 'editor' | 'viewer';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: User;
  createdBy: User;
  projectId: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date; // Soft delete
  attachments: Attachment[];
  tags: string[];
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: User;
  uploadedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  owner: User;
  members: ProjectMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectMember {
  user: User;
  role: UserRole;
  joinedAt: Date;
}

export interface ActivityLog {
  id: string;
  action: ActivityAction;
  taskId?: string;
  taskTitle?: string;
  user: User;
  details: string;
  timestamp: Date;
}

export type ActivityAction = 
  | 'task_created'
  | 'task_updated'
  | 'task_deleted'
  | 'task_restored'
  | 'status_changed'
  | 'assignee_changed'
  | 'comment_added'
  | 'attachment_added'
  | 'member_added'
  | 'member_removed';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  taskId?: string;
  createdAt: Date;
}

export type NotificationType = 
  | 'task_assigned'
  | 'task_updated'
  | 'comment_mention'
  | 'due_date_reminder'
  | 'task_completed';

// Filter Types
export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assignee?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
  showDeleted?: boolean;
}

// Pagination Types
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
