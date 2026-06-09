export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
  children?: MenuItem[];
}

export const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: '首页',
    icon: 'LayoutDashboard',
    path: '/admin',
  },
  {
    id: 'settings',
    label: '基础配置',
    icon: 'Settings',
    children: [
      { id: 'permission', label: '权限设置', icon: 'Lock', path: '/admin/settings/permission' },
      { id: 'model', label: '模型配置', icon: 'Brain', path: '/admin/settings/model' },
    ],
  },
  {
    id: 'customize',
    label: '前端定制',
    icon: 'Palette',
    children: [
      { id: 'style', label: '样式配置', icon: 'Paintbrush', path: '/admin/customize/style' },
    ],
  },
  {
    id: 'agents',
    label: '智能体集成',
    icon: 'Bot',
    children: [
      { id: 'agent-mgmt', label: 'Agent管理', icon: 'Settings', path: '/admin/agents' },
      { id: 'skill-mgmt', label: 'Agent Skill', icon: 'Sparkles', path: '/admin/agent-skill' },
    ],
  },
  {
    id: 'knowledge',
    label: '知识管理',
    icon: 'Database',
    children: [{ id: 'products', label: '数据产品', icon: 'Package', path: '/admin/knowledge/products' }],
  },
  {
    id: 'analytics',
    label: '分析中心',
    icon: 'BarChart3',
    children: [{ id: 'logs', label: '使用日志', icon: 'FileText', path: '/admin/analytics/logs' }],
  },
];

/**
 * 根据路径从菜单树中查找完整的面包屑层级
 * 例如: /admin/settings/permission -> [首页, 基础配置, 权限设置]
 */
export const getBreadcrumbs = (path: string): { name: string; path: string }[] => {
  if (path === '/' || path === '/admin') {
    return [{ name: '首页', path: '/admin' }];
  }

  const result: { name: string; path: string }[] = [{ name: '首页', path: '/admin' }];

  const findInTree = (items: MenuItem[], pathToMatch: string, parents: MenuItem[] = []): boolean => {
    for (const item of items) {
      if (item.path === pathToMatch) {
        parents.forEach((p) => {
          if (p.path) {
            result.push({ name: p.label, path: p.path });
          } else {
            result.push({ name: p.label, path: '' });
          }
        });
        result.push({ name: item.label, path: item.path! });
        return true;
      }
      if (item.children) {
        if (findInTree(item.children, pathToMatch, [...parents, item])) {
          return true;
        }
      }
    }
    return false;
  };

  findInTree(menuItems, path);

  return result;
};

/**
 * 根据路径查找当前页面的所有父菜单 ID
 * 用于在侧边栏自动展开相应菜单
 */
export const getParentMenuIds = (path: string): string[] => {
  const parents: string[] = [];

  const findInTree = (items: MenuItem[], pathToMatch: string, currentParents: string[] = []): boolean => {
    for (const item of items) {
      if (item.path === pathToMatch) {
        parents.push(...currentParents);
        return true;
      }
      if (item.children) {
        if (findInTree(item.children, pathToMatch, [...currentParents, item.id])) {
          return true;
        }
      }
    }
    return false;
  };

  findInTree(menuItems, path);
  return parents;
};
