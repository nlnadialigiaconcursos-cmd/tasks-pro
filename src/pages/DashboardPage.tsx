import { useMemo, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import TaskGrid from '@/components/tasks/TaskGrid';
import TaskFilters from '@/components/tasks/TaskFilters';
import TaskDialog from '@/components/tasks/TaskDialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ListTodo, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  LayoutGrid,
  List,
  Plus
} from 'lucide-react';
import { mockTasks, getTaskStats } from '@/data/mockData';
import { Task, TaskFilters as TaskFiltersType } from '@/types';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [filters, setFilters] = useState<TaskFiltersType>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const stats = useMemo(() => getTaskStats(), []);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.tags.some(tag => tag.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status?.length && !filters.status.includes(task.status)) {
        return false;
      }

      // Priority filter
      if (filters.priority?.length && !filters.priority.includes(task.priority)) {
        return false;
      }

      // Assignee filter
      if (filters.assignee?.length && (!task.assignee || !filters.assignee.includes(task.assignee.id))) {
        return false;
      }

      // Show deleted filter
      if (!filters.showDeleted && task.deletedAt) {
        return false;
      }

      return true;
    });
  }, [tasks, filters, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleNewTask = () => {
    setSelectedTask(null);
    setTaskDialogOpen(true);
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setTaskDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setTaskDialogOpen(true);
  };

  const handleDeleteTask = (task: Task) => {
    setTasks(prev => prev.map(t => 
      t.id === task.id 
        ? { ...t, deletedAt: new Date() }
        : t
    ));
    toast.success('Tarefa movida para lixeira', {
      description: 'A tarefa foi excluída com sucesso.',
      action: {
        label: 'Desfazer',
        onClick: () => handleRestoreTask(task),
      },
    });
  };

  const handleRestoreTask = (task: Task) => {
    setTasks(prev => prev.map(t => 
      t.id === task.id 
        ? { ...t, deletedAt: undefined }
        : t
    ));
    toast.success('Tarefa restaurada');
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (taskData.id) {
      // Update existing task
      setTasks(prev => prev.map(t => 
        t.id === taskData.id 
          ? { ...t, ...taskData, updatedAt: new Date() }
          : t
      ));
      toast.success('Tarefa atualizada');
    } else {
      // Create new task
      const newTask: Task = {
        id: `new-${Date.now()}`,
        title: taskData.title || '',
        description: taskData.description || '',
        status: taskData.status || 'todo',
        priority: taskData.priority || 'medium',
        assignee: taskData.assignee,
        createdBy: { id: '1', email: 'demo@email.com', name: 'Demo User', role: 'owner', createdAt: new Date() },
        projectId: '1',
        dueDate: taskData.dueDate,
        createdAt: new Date(),
        updatedAt: new Date(),
        attachments: [],
        tags: taskData.tags || [],
      };
      setTasks(prev => [newTask, ...prev]);
      toast.success('Tarefa criada');
    }
  };

  const handleResetFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  return (
    <DashboardLayout onSearch={handleSearch} onNewTask={handleNewTask}>
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total de Tarefas"
            value={stats.total}
            description="tarefas no projeto"
            icon={ListTodo}
          />
          <StatsCard
            title="Em Progresso"
            value={stats.byStatus.in_progress}
            description="tarefas ativas"
            icon={Clock}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Concluídas"
            value={stats.byStatus.done}
            description="tarefas finalizadas"
            icon={CheckCircle2}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Atrasadas"
            value={stats.overdue}
            description="precisam de atenção"
            icon={AlertTriangle}
            trend={{ value: 2, isPositive: false }}
          />
        </div>

        {/* Tasks Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Tarefas</h2>
            <div className="flex items-center gap-2">
              <TaskFilters 
                filters={filters}
                onFiltersChange={setFilters}
                onReset={handleResetFilters}
              />
              <div className="flex items-center border rounded-lg p-0.5 bg-muted">
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs for status */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">
                Todas ({filteredTasks.length})
              </TabsTrigger>
              <TabsTrigger value="todo">
                A Fazer ({filteredTasks.filter(t => t.status === 'todo').length})
              </TabsTrigger>
              <TabsTrigger value="in_progress">
                Em Progresso ({filteredTasks.filter(t => t.status === 'in_progress').length})
              </TabsTrigger>
              <TabsTrigger value="review">
                Revisão ({filteredTasks.filter(t => t.status === 'review').length})
              </TabsTrigger>
              <TabsTrigger value="done">
                Concluídas ({filteredTasks.filter(t => t.status === 'done').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <TaskGrid
                tasks={filteredTasks}
                onViewTask={handleViewTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onRestoreTask={handleRestoreTask}
                showDeleted={filters.showDeleted}
              />
            </TabsContent>

            <TabsContent value="todo" className="mt-4">
              <TaskGrid
                tasks={filteredTasks.filter(t => t.status === 'todo')}
                onViewTask={handleViewTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onRestoreTask={handleRestoreTask}
              />
            </TabsContent>

            <TabsContent value="in_progress" className="mt-4">
              <TaskGrid
                tasks={filteredTasks.filter(t => t.status === 'in_progress')}
                onViewTask={handleViewTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onRestoreTask={handleRestoreTask}
              />
            </TabsContent>

            <TabsContent value="review" className="mt-4">
              <TaskGrid
                tasks={filteredTasks.filter(t => t.status === 'review')}
                onViewTask={handleViewTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onRestoreTask={handleRestoreTask}
              />
            </TabsContent>

            <TabsContent value="done" className="mt-4">
              <TaskGrid
                tasks={filteredTasks.filter(t => t.status === 'done')}
                onViewTask={handleViewTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onRestoreTask={handleRestoreTask}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        task={selectedTask}
        onSave={handleSaveTask}
      />
    </DashboardLayout>
  );
}
