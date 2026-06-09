import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

export default function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const sidebarWidth = sidebarCollapsed ? '64px' : '240px';

  return (
    <div className="min-h-screen bg-content-bg">
      {/* Sidebar - fixed on left */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area - with margin to avoid sidebar overlap */}
      <div 
        className="transition-all duration-300 min-h-screen"
        style={{ marginLeft: sidebarWidth }}
      >
        {/* TopBar - fixed on top */}
        <TopBar sidebarCollapsed={sidebarCollapsed} />
        
        {/* Main Content - with padding-top to avoid topbar overlap */}
        <main className="pt-[56px]">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
