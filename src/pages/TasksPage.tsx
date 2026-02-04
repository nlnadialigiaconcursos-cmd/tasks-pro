import { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TaskGrid from '@/components/tasks/TaskGrid';
import TaskFilters from '@/components/tasks/TaskFilters';
import TaskDialog from '@/components/tasks/TaskDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus } from 'lucide-react';
import { mockTasks } from '@/data/mockData';
import { Task, TaskFilters as TaskFiltersType } from '@/types';
import { toast } from 'sonner';

export default function TasksPage() {
  const [filters, setFilters] = useState<TaskFiltersType>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.tags.some(tag => tag.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      if (filters.status?.length && !filters.status.includes(task.status)) {
        return false;
      }

      if (filters.priority?.length && !filters.priority.includes(task.priority)) {
        return false;
      }

      if (filters.assignee?.length && (!task.assignee || !filters.assignee.includes(task.assignee.id))) {
        return false;
      }

      if (!filters.showDeleted && task.deletedAt) {
        return false;
      }

      return true;
    });
  }, [tasks, filters, searchQuery]);

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
    toast.success('Tarefa movida para lixeira');
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
      setTasks(prev => prev.map(t => 
        t.id === taskData.id 
          ? { ...t, ...taskData, updatedAt: new Date() }
          : t
      ));
      toast.success('Tarefa atualizada');
    } else {
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
    <DashboardLayout onNewTask={handleNewTask}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Tarefas</h1>
            <p className="text-muted-foreground">
              Gerencie todas as tarefas do projeto
            </p>
          </div>
          <Button onClick={handleNewTask}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar tarefas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <TaskFilters 
            filters={filters}
            onFiltersChange={setFilters}
            onReset={handleResetFilters}
          />
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">
              Todas ({filteredTasks.length})
            </TabsTrigger>
            <TabsTrigger value="my">
              Minhas Tarefas
            </TabsTrigger>
            <TabsTrigger value="unassigned">
              Não Atribuídas
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

          <TabsContent value="my" className="mt-4">
            <TaskGrid
              tasks={filteredTasks.filter(t => t.assignee?.id === '1')}
              onViewTask={handleViewTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onRestoreTask={handleRestoreTask}
            />
          </TabsContent>

          <TabsContent value="unassigned" className="mt-4">
            <TaskGrid
              tasks={filteredTasks.filter(t => !t.assignee)}
              onViewTask={handleViewTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onRestoreTask={handleRestoreTask}
            />
          </TabsContent>
        </Tabs>
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
