import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  Palette,
  Bot,
  Database,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Lock,
  Brain,
  Paintbrush,
  MessageCircleQuestion,
  Package,
  FileText,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { menuItems, type MenuItem, getParentMenuIds } from '../config/menu';

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Settings,
  Palette,
  Bot,
  Database,
  BarChart3,
  Lock,
  Brain,
  Paintbrush,
  MessageCircleQuestion,
  Package,
  FileText,
  Sparkles,
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  useEffect(() => {
    const parentIds = getParentMenuIds(location.pathname);
    if (parentIds.length > 0) {
      setExpandedMenus(parentIds);
    }
  }, [location.pathname]);

  const toggleMenu = (id: string) => {
    setExpandedMenus((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [id];
      }
    });
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isParentActive = (item: MenuItem) => {
    if (item.path && isActive(item.path)) return true;
    if (item.children) {
      return item.children.some((child) => location.pathname.startsWith(child.path!));
    }
    return false;
  };

  const renderMenuItem = (item: MenuItem) => {
    const Icon = iconMap[item.icon];
    const iconElement = Icon ? <Icon size={18} /> : null;

    if (item.path && !item.children) {
      return (
        <NavLink
          key={item.id}
          to={item.path}
          className={({ isActive: navActive }) =>
            `relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer group ${
              navActive
                ? 'bg-primary-soft text-brand-petrol font-medium'
                : 'text-deep-blue-60 hover:bg-light-sand hover:text-deep-blue-80'
            }`
          }
        >
          <span className={`shrink-0 transition-colors ${isActive(item.path) ? 'text-brand-petrol' : 'text-deep-blue-40 group-hover:text-deep-blue-60'}`}>
            {iconElement}
          </span>
          {!collapsed && (
            <span className="text-sm">{item.label}</span>
          )}
          {!collapsed && isActive(item.path) && (
            <span className="ml-auto w-1.5 h-1.5 bg-brand-petrol rounded-full" />
          )}
        </NavLink>
      );
    }

    const isExpanded = expandedMenus.includes(item.id);
    const parentActive = isParentActive(item);

    return (
      <li key={item.id}>
        <div
          onClick={() => toggleMenu(item.id)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer ${
            parentActive || isExpanded
              ? 'bg-light-sand text-deep-blue-80 font-medium'
              : 'text-deep-blue-60 hover:bg-light-sand hover:text-deep-blue-80'
          }`}
        >
          <span className={`shrink-0 ${parentActive || isExpanded ? 'text-brand-petrol' : 'text-deep-blue-40'}`}>
            {iconElement}
          </span>
          {!collapsed && (
            <>
              <span className="flex-1 text-sm">{item.label}</span>
              <ChevronRight
                size={16}
                className={`transition-transform duration-200 text-deep-blue-40 ${
                  isExpanded ? 'rotate-90 text-brand-petrol' : ''
                }`}
              />
            </>
          )}
          {collapsed && (
            <span className="absolute left-full ml-2 px-2 py-1 bg-deep-blue-80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
              {item.label}
            </span>
          )}
        </div>
        {!collapsed && isExpanded && item.children && (
          <ul className="ml-4 mt-1 space-y-0.5 pl-3 border-l border-deep-blue-10">
            {item.children.map((child) => {
              const ChildIcon = iconMap[child.icon];
              const childIconElement = ChildIcon ? <ChildIcon size={16} /> : null;
              return (
                <li key={child.id}>
                  <NavLink
                    to={child.path!}
                    className={({ isActive: navActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        navActive
                          ? 'bg-primary-soft text-brand-petrol font-medium -ml-[1px] border-l-2 border-brand-petrol'
                          : 'text-deep-blue-60 hover:text-deep-blue-80 hover:bg-light-sand'
                      }`
                    }
                  >
                    {childIconElement && (
                      <span className={isActive(child.path) ? 'text-brand-petrol' : 'text-deep-blue-40'}>
                        {childIconElement}
                      </span>
                    )}
                    {child.label}
                    {isActive(child.path) && (
                      <span className="ml-auto w-1 h-1 bg-brand-petrol rounded-full" />
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        )}
      </li>
    );
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white text-deep-blue-80 flex flex-col transition-all duration-300 z-40 border-r border-deep-blue-10 ${
        collapsed ? 'w-sidebar-collapsed' : 'w-sidebar'
      }`}
    >
      {/* Logo Area */}
      <div className="h-topbar flex items-center px-4 border-b border-deep-blue-10 bg-white">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-petrol-soft rounded-xl flex items-center justify-center font-bold text-deep-blue-80 shadow-soft">
              禹
            </div>
            <div>
              <p className="font-semibold text-sm text-deep-blue-80">小禹管理后台</p>
              <p className="text-xs text-deep-blue-40">Workspace Admin</p>
            </div>
          </div>
        ) : (
          <div className="w-9 h-9 bg-gradient-petrol-soft rounded-xl flex items-center justify-center font-bold text-deep-blue-80 shadow-soft mx-auto">
            禹
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => renderMenuItem(item))}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-deep-blue-10">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-deep-blue-40 hover:text-deep-blue-80 hover:bg-light-sand rounded-lg transition-all duration-200 group"
          title={collapsed ? '展开菜单' : '收起菜单'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span className="text-sm text-deep-blue-60">收起</span>}
        </button>
      </div>
    </aside>
  );
}
