import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  PlusCircle, 
  Edit3, 
  Trash2, 
  RotateCcw, 
  MessageSquare, 
  Paperclip, 
  UserPlus, 
  UserMinus,
  ArrowRight
} from 'lucide-react';
import { ActivityLog, ActivityAction } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ActivityListProps {
  activities: ActivityLog[];
  maxItems?: number;
}

const actionIcons: Record<ActivityAction, typeof PlusCircle> = {
  task_created: PlusCircle,
  task_updated: Edit3,
  task_deleted: Trash2,
  task_restored: RotateCcw,
  status_changed: ArrowRight,
  assignee_changed: UserPlus,
  comment_added: MessageSquare,
  attachment_added: Paperclip,
  member_added: UserPlus,
  member_removed: UserMinus,
};

const actionColors: Record<ActivityAction, string> = {
  task_created: 'bg-success/10 text-success',
  task_updated: 'bg-info/10 text-info',
  task_deleted: 'bg-destructive/10 text-destructive',
  task_restored: 'bg-success/10 text-success',
  status_changed: 'bg-warning/10 text-warning',
  assignee_changed: 'bg-info/10 text-info',
  comment_added: 'bg-muted text-muted-foreground',
  attachment_added: 'bg-muted text-muted-foreground',
  member_added: 'bg-success/10 text-success',
  member_removed: 'bg-destructive/10 text-destructive',
};

export default function ActivityList({ activities, maxItems }: ActivityListProps) {
  const displayedActivities = maxItems ? activities.slice(0, maxItems) : activities;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1">
        {displayedActivities.map((activity, index) => {
          const Icon = actionIcons[activity.action];
          const colorClass = actionColors[activity.action];

          return (
            <div
              key={activity.id}
              className={cn(
                'flex gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors',
                index === 0 && 'bg-accent/30'
              )}
            >
              <div className={cn('mt-0.5 p-1.5 rounded-full', colorClass)}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="text-[9px] bg-primary/10 text-primary">
                      {getInitials(activity.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user.name}</span>
                      {' '}
                      <span className="text-muted-foreground">{activity.details}</span>
                    </p>
                    {activity.taskTitle && (
                      <p className="text-xs text-primary truncate mt-0.5">
                        {activity.taskTitle}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1 ml-7">
                  {formatDistanceToNow(activity.timestamp, { 
                    addSuffix: true,
                    locale: ptBR 
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
