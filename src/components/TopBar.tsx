import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, MessageCircle, User } from 'lucide-react';
import { getBreadcrumbs } from '../config/menu';
import ProfileModal from './ProfileModal';

interface TopBarProps {
  sidebarCollapsed: boolean;
}

export default function TopBar({ sidebarCollapsed }: TopBarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const breadcrumbs = getBreadcrumbs(location.pathname);
  const sidebarWidth = sidebarCollapsed ? '64px' : '240px';
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <header
        className="fixed top-0 h-[56px] bg-white/85 backdrop-blur-sm border-b border-deep-blue-10 flex items-center justify-between px-6 z-30 transition-all duration-300"
        style={{ left: sidebarWidth, right: 0 }}
      >
        {/* Left: Back to Chat + Breadcrumb */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3 py-1.5 text-brand-petrol hover:bg-primary-soft rounded-lg transition-colors font-medium"
            title="返回对话首页"
          >
            <MessageCircle size={18} />
            <span className="text-sm">返回对话</span>
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1 border-l border-deep-blue-10 pl-4">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.path} className="flex items-center gap-1">
                {index > 0 && (
                  <ChevronRight size={16} className="text-deep-blue-40" />
                )}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-sm font-semibold text-deep-blue-80">
                    {crumb.name}
                  </span>
                ) : (
                  <span className="text-sm text-deep-blue-60 hover:text-brand-petrol cursor-pointer transition-colors">
                    {crumb.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: User Profile */}
        <button
          onClick={() => setProfileOpen(true)}
          className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-primary-soft rounded-lg transition-colors group"
          title="查看个人资料"
        >
          <div className="w-8 h-8 bg-gradient-petrol-bold rounded-full flex items-center justify-center shadow-soft group-hover:shadow-md transition-shadow">
            <User size={14} className="text-white" />
          </div>
          <span className="text-sm font-medium text-deep-blue-80 group-hover:text-brand-petrol transition-colors">Admin</span>
        </button>
      </header>

      {/* Profile Modal */}
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}
