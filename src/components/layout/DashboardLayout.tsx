import { ReactNode, useState } from 'react';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';

interface DashboardLayoutProps {
  children: ReactNode;
  onSearch?: (query: string) => void;
  onNewTask?: () => void;
}

export default function DashboardLayout({ children, onSearch, onNewTask }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader onSearch={onSearch} onNewTask={onNewTask} />
        <main className="flex-1 overflow-auto custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
