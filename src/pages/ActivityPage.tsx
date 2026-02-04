import DashboardLayout from '@/components/layout/DashboardLayout';
import ActivityList from '@/components/activity/ActivityList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Download } from 'lucide-react';
import { mockActivityLogs } from '@/data/mockData';
import { useState } from 'react';

export default function ActivityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredActivities = mockActivityLogs.filter(activity => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        activity.details.toLowerCase().includes(query) ||
        activity.user.name.toLowerCase().includes(query) ||
        activity.taskTitle?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    if (filterType !== 'all' && activity.action !== filterType) {
      return false;
    }

    return true;
  });

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Log de Atividades</h1>
            <p className="text-muted-foreground">
              Acompanhe todas as ações realizadas no projeto
            </p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar atividades..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as ações</SelectItem>
                  <SelectItem value="task_created">Tarefas criadas</SelectItem>
                  <SelectItem value="task_updated">Tarefas atualizadas</SelectItem>
                  <SelectItem value="task_deleted">Tarefas excluídas</SelectItem>
                  <SelectItem value="status_changed">Mudanças de status</SelectItem>
                  <SelectItem value="assignee_changed">Atribuições</SelectItem>
                  <SelectItem value="comment_added">Comentários</SelectItem>
                  <SelectItem value="attachment_added">Anexos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ActivityList activities={filteredActivities} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
