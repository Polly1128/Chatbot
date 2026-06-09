import { useState } from 'react';
import { Package, Eye, Settings, Trash2, Check, Clock, AlertTriangle, RefreshCw, CheckSquare, Square, ChevronRight, FileText, Folder as FolderIcon } from 'lucide-react';
import Toggle from '../components/Toggle';

// ============================================
// 数据结构定义
// ============================================

// 权限类型
export type PermissionType = 'allow' | 'deny' | 'inherit';

// 基础节点属性
interface TreeNodeBase {
  id: string;
  name: string;
  permission: PermissionType; // 权限设置：allow=允许, deny=拒绝, inherit=继承
}

// 文件节点
export interface FileNode extends TreeNodeBase {
  type: 'file';
  size: string;
  status: 'learned' | 'learning' | 'failed'; // 索引状态
}

// 文件夹节点
export interface FolderNode extends TreeNodeBase {
  type: 'folder';
  children: (FileNode | FolderNode)[];
  expanded?: boolean; // 展开状态
}

// 树节点联合类型
export type TreeNode = FileNode | FolderNode;

// 数据产品
export interface DataProduct {
  id: string;
  name: string;
  version: string;
  sourcePath: string;
  fileCount: number; // 包含文件总数
  learnStatus: 'learning' | 'completed' | 'failed'; // 整体学习状态
  indexStrategy: 'realtime' | 'daily';
  createdAt: string;
  children: TreeNode[]; // 根层级的文件和文件夹
  allowDownload: boolean;
}

// ============================================
// Mock 数据
// ============================================

const initialProducts: DataProduct[] = [
  {
    id: 'product-1',
    name: '销售知识库',
    version: 'v2.1',
    sourcePath: 'SDCC LAKE / sales-knowledge-v2',
    fileCount: 12,
    learnStatus: 'learning',
    indexStrategy: 'realtime',
    createdAt: '2024-01-15',
    allowDownload: true,
    children: [
      {
        id: 'folder-1',
        name: '产品手册',
        type: 'folder',
        permission: 'allow',
        expanded: false,
        children: [
          {
            id: 'folder-1-1',
            name: '销售流程',
            type: 'folder',
            permission: 'inherit',
            expanded: true,
            children: [
              { id: 'file-1', name: 'sales_manual_2024.pdf', type: 'file', size: '2.3MB', status: 'learned', permission: 'allow' },
              { id: 'file-2', name: 'customer_handbook.docx', type: 'file', size: '1.1MB', status: 'learned', permission: 'allow' },
            ],
          },
          { id: 'file-3', name: 'pricing_guidelines.pdf', type: 'file', size: '560KB', status: 'failed', permission: 'allow' },
        ],
      },
      {
        id: 'folder-2',
        name: '产品目录',
        type: 'folder',
        permission: 'allow',
        expanded: false,
        children: [
          { id: 'file-4', name: 'product_catalog.xlsx', type: 'file', size: '890KB', status: 'learning', permission: 'allow' },
        ],
      },
      {
        id: 'folder-3',
        name: '客户资料',
        type: 'folder',
        permission: 'deny',
        expanded: false,
        children: [
          { id: 'file-5', name: 'customer_list_2024.xlsx', type: 'file', size: '1.5MB', status: 'learned', permission: 'deny' },
          { id: 'file-6', name: 'customer_feedback.pdf', type: 'file', size: '980KB', status: 'learned', permission: 'deny' },
        ],
      },
      { id: 'file-7', name: '销售培训视频.mp4', type: 'file', size: '25MB', status: 'learning', permission: 'allow' },
    ],
  },
  {
    id: 'product-2',
    name: '财务分析报告',
    version: 'v1.0',
    sourcePath: 'SDCC LAKE / finance-analysis',
    fileCount: 8,
    learnStatus: 'completed',
    indexStrategy: 'daily',
    createdAt: '2024-01-10',
    allowDownload: false,
    children: [
      {
        id: 'folder-4',
        name: '季度报告',
        type: 'folder',
        permission: 'allow',
        expanded: false,
        children: [
          { id: 'file-8', name: 'q4_financial_report.pdf', type: 'file', size: '5.2MB', status: 'learned', permission: 'allow' },
          { id: 'file-9', name: 'q3_financial_report.pdf', type: 'file', size: '4.8MB', status: 'learned', permission: 'allow' },
        ],
      },
      { id: 'file-10', name: 'budget_2024.xlsx', type: 'file', size: '1.5MB', status: 'learned', permission: 'allow' },
    ],
  },
  {
    id: 'product-3',
    name: '产品文档库',
    version: 'v3.2',
    sourcePath: 'SDCC LAKE / product-docs',
    fileCount: 25,
    learnStatus: 'failed',
    indexStrategy: 'realtime',
    createdAt: '2024-01-12',
    allowDownload: true,
    children: [
      { id: 'file-11', name: 'product_spec_v3.pdf', type: 'file', size: '3.8MB', status: 'failed', permission: 'allow' },
    ],
  },
];

// ============================================
// 工具函数
// ============================================

// 统计文件总数
const countFiles = (nodes: TreeNode[]): number => {
  let count = 0;
  nodes.forEach(node => {
    if (node.type === 'file') {
      count++;
    } else {
      count += countFiles(node.children);
    }
  });
  return count;
};

// 获取节点的有效权限（考虑继承）
export const getEffectivePermission = (
  node: TreeNodeBase,
  parentPermission: PermissionType = 'allow'
): PermissionType => {
  if (node.permission === 'inherit') {
    return parentPermission;
  }
  return node.permission;
};

// ============================================
// 主组件
// ============================================

export default function DataProducts() {
  const [products, setProducts] = useState<DataProduct[]>(initialProducts);
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBatchEditing, setIsBatchEditing] = useState(false);
  const [batchIndexStrategy, setBatchIndexStrategy] = useState<'realtime' | 'daily'>('realtime');
  const [activeTab, setActiveTab] = useState<'structure' | 'learning'>('structure');

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map(p => p.id));
    }
  };

  // Toggle single selection
  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Update index strategy for a single product
  const updateIndexStrategy = (productId: string, strategy: 'realtime' | 'daily') => {
    setProducts(
      products.map(p =>
        p.id === productId ? { ...p, indexStrategy: strategy } : p
      )
    );
  };

  // Update download permission
  const updateDownloadPermission = (productId: string, allow: boolean) => {
    setProducts(
      products.map(p =>
        p.id === productId ? { ...p, allowDownload: allow } : p
      )
    );
  };

  // Remove product
  const handleRemove = (productId: string) => {
    if (confirm('确定要移除这个数据产品吗？')) {
      setProducts(products.filter(p => p.id !== productId));
      setSelectedIds(selectedIds.filter(id => id !== productId));
      if (expandedProductId === productId) {
        setExpandedProductId(null);
      }
    }
  };

  // Batch update index strategy
  const handleBatchUpdate = () => {
    setProducts(
      products.map(p =>
        selectedIds.includes(p.id) ? { ...p, indexStrategy: batchIndexStrategy } : p
      )
    );
    setIsBatchEditing(false);
    setSelectedIds([]);
  };

  // Retry learning
  const handleRetryLearning = (productId: string, mode: 'all' | 'failed') => {
    setProducts(
      products.map(p => {
        if (p.id === productId) {
          const updatedChildren = retryLearnInTree(p.children, mode);
          return { ...p, children: updatedChildren, learnStatus: 'learning' };
        }
        return p;
      })
    );
  };

  // 递归重新学习
  const retryLearnInTree = (nodes: TreeNode[], mode: 'all' | 'failed'): TreeNode[] => {
    return nodes.map(node => {
      if (node.type === 'file') {
        if (mode === 'all' || node.status === 'failed') {
          return { ...node, status: 'learning' as const };
        }
        return node;
      } else {
        return { ...node, children: retryLearnInTree(node.children, mode) };
      }
    });
  };

  // 更新树中单个文件的学习状态
  const updateFileStatusInTree = (nodes: TreeNode[], fileId: string, newStatus: 'learned' | 'learning' | 'failed'): TreeNode[] => {
    return nodes.map(node => {
      if (node.type === 'file' && node.id === fileId) {
        return { ...node, status: newStatus };
      }
      if (node.type === 'folder') {
        return { ...node, children: updateFileStatusInTree(node.children, fileId, newStatus) };
      }
      return node;
    });
  };

  // Toggle folder expanded
  const toggleFolderExpanded = (productId: string, folderId: string) => {
    setProducts(
      products.map(p => {
        if (p.id === productId) {
          return {
            ...p,
            children: toggleFolderInTree(p.children, folderId),
          };
        }
        return p;
      })
    );
  };

  // 递归切换文件夹展开状态
  const toggleFolderInTree = (nodes: TreeNode[], folderId: string): TreeNode[] => {
    return nodes.map(node => {
      if (node.id === folderId && node.type === 'folder') {
        return { ...node, expanded: !node.expanded };
      }
      if (node.type === 'folder') {
        return { ...node, children: toggleFolderInTree(node.children, folderId) };
      }
      return node;
    });
  };

  // Update node permission
  const updateNodePermission = (productId: string, nodeId: string, permission: PermissionType) => {
    setProducts(
      products.map(p => {
        if (p.id === productId) {
          return {
            ...p,
            children: updatePermissionInTree(p.children, nodeId, permission),
          };
        }
        return p;
      })
    );
  };

  // 递归更新节点权限
  const updatePermissionInTree = (nodes: TreeNode[], nodeId: string, permission: PermissionType): TreeNode[] => {
    return nodes.map(node => {
      if (node.id === nodeId) {
        return { ...node, permission };
      }
      if (node.type === 'folder') {
        return { ...node, children: updatePermissionInTree(node.children, nodeId, permission) };
      }
      return node;
    });
  };

  // 递归统计子节点数量
  const getChildCount = (node: FolderNode): number => {
    let count = 0;
    node.children.forEach(child => {
      if (child.type === 'file') {
        count++;
      } else {
        count += getChildCount(child);
      }
    });
    return count;
  };

  // 收集所有 allow 权限的文件（用户选择让 AI 学习的文件）
  interface LearnedFile {
    id: string;
    name: string;
    size: string;
    status: 'learned' | 'learning' | 'failed';
    path: string;
  }

  const collectAllowedFiles = (nodes: TreeNode[], currentPath: string = '', parentPermission: PermissionType = 'allow'): LearnedFile[] => {
    const files: LearnedFile[] = [];
    nodes.forEach(node => {
      const effectivePermission = getEffectivePermission(node, parentPermission);
      if (node.type === 'file') {
        if (effectivePermission === 'allow') {
          files.push({
            id: node.id,
            name: node.name,
            size: node.size,
            status: node.status,
            path: currentPath,
          });
        }
      } else {
        const newPath = currentPath ? `${currentPath} / ${node.name}` : node.name;
        files.push(...collectAllowedFiles(node.children, newPath, effectivePermission));
      }
    });
    return files;
  };

  // 获取状态图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'learned':
        return <Check size={16} className="text-green" />;
      case 'learning':
        return <RefreshCw size={16} className="text-brand-petrol animate-spin" />;
      case 'failed':
        return <AlertTriangle size={16} className="text-red" />;
      default:
        return null;
    }
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'learning':
        return '学习中';
      case 'failed':
        return '失败';
      case 'learned':
        return '已学习';
      default:
        return status;
    }
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'learned':
        return 'bg-brand-green/25 text-dark-green';
      case 'learning':
        return 'bg-primary-soft text-brand-petrol-dark';
      case 'failed':
        return 'bg-red-light text-red';
      default:
        return 'bg-light-sand text-deep-blue-80';
    }
  };

  // 获取权限文本
  const getPermissionText = (permission: PermissionType) => {
    switch (permission) {
      case 'allow':
        return '允许';
      case 'deny':
        return '拒绝';
      case 'inherit':
        return '继承';
      default:
        return permission;
    }
  };

  // 获取权限颜色
  const getPermissionColor = (permission: PermissionType) => {
    switch (permission) {
      case 'allow':
        return 'bg-brand-green/25 text-dark-green';
      case 'deny':
        return 'bg-red-light text-red';
      case 'inherit':
        return 'bg-light-sand text-deep-blue-80';
      default:
        return 'bg-light-sand text-deep-blue-80';
    }
  };

  // 渲染树节点
  const renderTreeNode = (
    node: TreeNode,
    productId: string,
    depth: number = 0,
    parentPermission: PermissionType = 'allow'
  ) => {
    const effectivePermission = getEffectivePermission(node, parentPermission);
    const paddingLeft = depth * 24 + 16;

    return (
      <div key={node.id}>
        <div
          className="flex items-center justify-between py-2 px-4 hover:bg-light-sand transition-colors border-b border-deep-blue-10"
          style={{ paddingLeft }}
        >
          <div className="flex items-center gap-3 flex-1">
            {node.type === 'folder' ? (
              <button
                onClick={() => toggleFolderExpanded(productId, node.id)}
                className="p-1 hover:bg-deep-blue-10 rounded transition-colors"
              >
                <ChevronRight
                  size={16}
                  className={`text-deep-blue-40 transition-transform ${node.expanded ? 'rotate-90' : ''}`}
                />
              </button>
            ) : (
              <div className="w-6" />
            )}

            {node.type === 'folder' ? (
              <FolderIcon size={18} className="text-yellow-500" />
            ) : (
              <FileText size={18} className="text-brand-petrol" />
            )}

            <span className="text-sm text-deep-blue-80 font-medium">
              {node.name}
            </span>

            {node.type === 'folder' && (
              <span className="text-xs text-deep-blue-40">
                ({getChildCount(node)} 个项目)
              </span>
            )}

            {node.type === 'file' && (
              <span className="text-xs text-deep-blue-40 ml-2">
                {node.size}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* 权限选择器 */}
            <select
              value={node.permission}
              onChange={(e) => updateNodePermission(productId, node.id, e.target.value as PermissionType)}
              className={`text-xs px-2 py-1 rounded-full border-0 cursor-pointer ${getPermissionColor(effectivePermission)}`}
              title={`当前权限: ${getPermissionText(effectivePermission)}`}
            >
              <option value="allow">允许</option>
              <option value="deny">拒绝</option>
              <option value="inherit">继承</option>
            </select>

            {/* 文件状态 */}
            {node.type === 'file' && (
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(node.status)}`}>
                {getStatusIcon(node.status)}
                {getStatusText(node.status)}
              </div>
            )}
          </div>
        </div>

        {/* 渲染子节点 */}
        {node.type === 'folder' && node.expanded && node.children.length > 0 && (
          <div>
            {node.children.map(child => renderTreeNode(child, productId, depth + 1, effectivePermission))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-petrol-soft rounded-xl flex items-center justify-center shadow-soft">
            <Package size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-deep-blue-80 tracking-tight">数据产品</h1>
            <p className="text-sm text-deep-blue-40">管理 OneRAG 知识库数据产品</p>
          </div>
        </div>
        
        {/* Batch Operations */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-deep-blue-40 font-medium">
              已选择 {selectedIds.length} 项
            </span>
            <button
              onClick={() => setIsBatchEditing(true)}
              className="px-4 py-2 bg-brand-petrol text-white text-sm font-medium rounded-lg hover:bg-brand-petrol active:bg-brand-petrol-dark transition-all shadow-soft"
            >
              批量设置索引策略
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-4 py-2 text-deep-blue-60 text-sm font-medium rounded-lg hover:bg-light-sand transition-colors"
            >
              取消选择
            </button>
          </div>
        )}
      </div>

      {/* Batch Edit Modal */}
      {isBatchEditing && (
        <div className="bg-white rounded-xl border border-deep-blue-10 shadow-soft p-6">
          <h3 className="font-semibold text-deep-blue-80 mb-4">批量设置索引策略</h3>
          <div className="flex gap-4 mb-6">
            <label
              className={`flex items-center gap-3 px-5 py-3 rounded-lg cursor-pointer transition-all border-2 ${
                batchIndexStrategy === 'realtime'
                  ? 'bg-primary-soft border-brand-petrol text-brand-petrol-dark'
                  : 'bg-light-sand border-transparent text-deep-blue-60 hover:bg-light-sand'
              }`}
            >
              <input
                type="radio"
                name="batchIndexStrategy"
                checked={batchIndexStrategy === 'realtime'}
                onChange={() => setBatchIndexStrategy('realtime')}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                batchIndexStrategy === 'realtime' ? 'border-brand-petrol' : 'border-deep-blue-20'
              }`}>
                {batchIndexStrategy === 'realtime' && <div className="w-2.5 h-2.5 rounded-full bg-brand-petrol" />}
              </div>
              <span className="font-medium text-sm">上传后实时创建索引</span>
            </label>
            <label
              className={`flex items-center gap-3 px-5 py-3 rounded-lg cursor-pointer transition-all border-2 ${
                batchIndexStrategy === 'daily'
                  ? 'bg-primary-soft border-brand-petrol text-brand-petrol-dark'
                  : 'bg-light-sand border-transparent text-deep-blue-60 hover:bg-light-sand'
              }`}
            >
              <input
                type="radio"
                name="batchIndexStrategy"
                checked={batchIndexStrategy === 'daily'}
                onChange={() => setBatchIndexStrategy('daily')}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                batchIndexStrategy === 'daily' ? 'border-brand-petrol' : 'border-deep-blue-20'
              }`}>
                {batchIndexStrategy === 'daily' && <div className="w-2.5 h-2.5 rounded-full bg-brand-petrol" />}
              </div>
              <span className="font-medium text-sm">每天自动创建索引</span>
            </label>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsBatchEditing(false)}
              className="px-4 py-2 text-deep-blue-60 font-medium rounded-lg hover:bg-light-sand transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleBatchUpdate}
              className="px-4 py-2 bg-brand-petrol text-white font-medium rounded-lg hover:bg-brand-petrol active:bg-brand-petrol-dark transition-all shadow-soft"
            >
              应用到选中项
            </button>
          </div>
        </div>
      )}

      {/* Product List Table */}
      <div className="bg-white rounded-xl border border-deep-blue-10 shadow-soft overflow-hidden">
        <table className="w-full">
          <thead className="bg-light-sand border-b border-deep-blue-10">
            <tr>
              <th className="px-6 py-4 w-12">
                <button
                  onClick={toggleSelectAll}
                  className="p-1 hover:bg-deep-blue-10 rounded transition-colors"
                >
                  {selectedIds.length === products.length ? (
                    <CheckSquare size={18} className="text-brand-petrol" />
                  ) : (
                    <Square size={18} className="text-deep-blue-40" />
                  )}
                </button>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-deep-blue-40 uppercase tracking-wider">数据产品名称</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-deep-blue-40 uppercase tracking-wider">包含文件数</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-deep-blue-40 uppercase tracking-wider">学习状态</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-deep-blue-40 uppercase tracking-wider">索引策略</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-deep-blue-40 uppercase tracking-wider">申请时间</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-deep-blue-40 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-deep-blue-10">
            {products.map((product) => (
              <>
                <tr key={product.id} className="hover:bg-light-sand/70 transition-colors">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleSelect(product.id)}
                      className="p-1 hover:bg-deep-blue-10 rounded transition-colors"
                    >
                      {selectedIds.includes(product.id) ? (
                        <CheckSquare size={18} className="text-brand-petrol" />
                      ) : (
                        <Square size={18} className="text-deep-blue-40" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-soft-purple/20 rounded-lg flex items-center justify-center">
                        <Package size={18} className="text-dark-purple" />
                      </div>
                      <div>
                        <div className="font-medium text-deep-blue-80">
                          {product.name} {product.version}
                        </div>
                        <div className="text-xs text-deep-blue-40 truncate max-w-xs mt-0.5">{product.sourcePath}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium text-deep-blue-80">{product.fileCount}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(product.learnStatus)}`}>
                      {getStatusIcon(product.learnStatus)}
                      {getStatusText(product.learnStatus)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-sm font-semibold ${
                      product.indexStrategy === 'realtime' ? 'text-green' : 'text-brand-petrol'
                    }`}>
                      {product.indexStrategy === 'realtime' ? '实时' : '每天'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-deep-blue-40 flex items-center justify-center gap-1.5">
                      <Clock size={14} />
                      {product.createdAt}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setExpandedProductId(expandedProductId === product.id ? null : product.id)}
                        className="p-2 text-brand-petrol hover:bg-primary-soft rounded-lg transition-all"
                        title="查看详情"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="p-2 text-deep-blue-40 hover:text-brand-petrol hover:bg-primary-soft rounded-lg transition-all"
                        title="配置"
                      >
                        <Settings size={16} />
                      </button>
                      <button
                        onClick={() => handleRemove(product.id)}
                        className="p-2 text-red hover:bg-red-light rounded-lg transition-all"
                        title="移除"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Expanded Details */}
                {expandedProductId === product.id && (() => {
                  const learnedFiles = collectAllowedFiles(product.children);
                  const failedCount = learnedFiles.filter(f => f.status === 'failed').length;
                  const learningCount = learnedFiles.filter(f => f.status === 'learning').length;
                  const learnedCount = learnedFiles.filter(f => f.status === 'learned').length;

                  return (
                    <tr key={`${product.id}-details`}>
                      <td colSpan={7} className="px-6 py-4 bg-light-sand/50">
                        <div className="bg-white rounded-xl border border-deep-blue-10 shadow-soft overflow-hidden">
                          {/* Compact Header & Config Row */}
                          <div className="flex items-center justify-between px-5 py-4 border-b border-deep-blue-10 bg-light-sand/50">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-soft-purple/20 rounded-lg flex items-center justify-center">
                                <Package size={18} className="text-dark-purple" />
                              </div>
                              <div>
                                <h3 className="text-sm font-semibold text-deep-blue-80">{product.name} {product.version}</h3>
                                <p className="text-xs text-deep-blue-40 mt-0.5">来源: {product.sourcePath} · 申请: {product.createdAt}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              {/* Index Strategy Compact */}
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-deep-blue-40">索引:</span>
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => updateIndexStrategy(product.id, 'realtime')}
                                    className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                                      product.indexStrategy === 'realtime'
                                        ? 'bg-brand-petrol text-white'
                                        : 'bg-light-sand text-deep-blue-60 hover:bg-deep-blue-10'
                                    }`}
                                  >
                                    实时
                                  </button>
                                  <button
                                    onClick={() => updateIndexStrategy(product.id, 'daily')}
                                    className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                                      product.indexStrategy === 'daily'
                                        ? 'bg-brand-petrol text-white'
                                        : 'bg-light-sand text-deep-blue-60 hover:bg-deep-blue-10'
                                    }`}
                                  >
                                    每天
                                  </button>
                                </div>
                              </div>
                              {/* Download Permission Compact */}
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-deep-blue-40">允许下载:</span>
                                <Toggle
                                  checked={product.allowDownload}
                                  onChange={(checked) => updateDownloadPermission(product.id, checked)}
                                />
                              </div>
                              {/* Retry Buttons */}
                              <button
                                onClick={() => handleRetryLearning(product.id, 'failed')}
                                className="text-xs px-3 py-1.5 bg-light-sand text-deep-blue-80 rounded-md hover:bg-deep-blue-10 transition-colors flex items-center gap-1 font-medium"
                              >
                                <RefreshCw size={12} />
                                重试失败
                              </button>
                            </div>
                          </div>

                          {/* Tab Navigation */}
                          <div className="flex border-b border-deep-blue-10 bg-white">
                            <button
                              onClick={() => setActiveTab('structure')}
                              className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                                activeTab === 'structure'
                                  ? 'text-brand-petrol border-brand-petrol bg-primary-soft/30'
                                  : 'text-deep-blue-40 border-transparent hover:text-deep-blue-80 hover:bg-light-sand'
                              }`}
                            >
                              <FolderIcon size={14} />
                              数据结构
                              <span className="text-xs text-deep-blue-40">({countFiles(product.children)} 个文件)</span>
                            </button>
                            <button
                              onClick={() => setActiveTab('learning')}
                              className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                                activeTab === 'learning'
                                  ? 'text-brand-petrol border-brand-petrol bg-primary-soft/30'
                                  : 'text-deep-blue-40 border-transparent hover:text-deep-blue-80 hover:bg-light-sand'
                              }`}
                            >
                              <RefreshCw size={14} />
                              学习文件列表
                              <span className="text-xs text-deep-blue-40">({learnedFiles.length} 项)</span>
                              {learningCount > 0 && (
                                <span className="w-1.5 h-1.5 bg-brand-petrol rounded-full animate-pulse" />
                              )}
                              {failedCount > 0 && (
                                <span className="text-xs bg-red-light text-red px-1.5 py-0.5 rounded-full ml-1">
                                  {failedCount} 失败
                                </span>
                              )}
                            </button>
                          </div>

                          {/* Tab Content */}
                          <div className="p-5">
                            {activeTab === 'structure' && (
                              <div className="bg-light-sand rounded-lg overflow-hidden border border-deep-blue-10">
                                <div className="px-4 py-2.5 bg-light-sand border-b border-deep-blue-10 flex items-center justify-between">
                                  <div className="flex items-center gap-2 text-xs text-deep-blue-60">
                                    <Settings size={12} />
                                    <span>点击文件夹展开，通过下拉菜单设置文件权限（允许/拒绝/继承）</span>
                                  </div>
                                  <span className="text-xs text-deep-blue-40">
                                    总计 {countFiles(product.children)} 个文件
                                  </span>
                                </div>
                                <div className="max-h-[380px] overflow-y-auto">
                                  {product.children.map(node => renderTreeNode(node, product.id))}
                                </div>
                              </div>
                            )}

                            {activeTab === 'learning' && (
                              <div>
                                {/* Summary */}
                                <div className="flex items-center gap-4 mb-4">
                                  <div className="flex items-center gap-2 text-xs text-deep-blue-60 bg-light-sand px-3 py-1.5 rounded-lg">
                                    <Check size={12} className="text-green" />
                                    <span>已学习 <strong className="text-deep-blue-80">{learnedCount}</strong></span>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-deep-blue-60 bg-light-sand px-3 py-1.5 rounded-lg">
                                    <RefreshCw size={12} className="text-brand-petrol animate-spin" />
                                    <span>学习中 <strong className="text-deep-blue-80">{learningCount}</strong></span>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-deep-blue-60 bg-light-sand px-3 py-1.5 rounded-lg">
                                    <AlertTriangle size={12} className="text-red" />
                                    <span>失败 <strong className="text-deep-blue-80">{failedCount}</strong></span>
                                  </div>
                                </div>

                                {/* Learning Files Table */}
                                <div className="border border-deep-blue-10 rounded-lg overflow-hidden">
                                  <table className="w-full">
                                    <thead className="bg-light-sand border-b border-deep-blue-10">
                                      <tr>
                                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-deep-blue-60">文件名</th>
                                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-deep-blue-60">所在路径</th>
                                        <th className="px-4 py-2.5 text-center text-xs font-semibold text-deep-blue-60">大小</th>
                                        <th className="px-4 py-2.5 text-center text-xs font-semibold text-deep-blue-60">学习状态</th>
                                        <th className="px-4 py-2.5 text-center text-xs font-semibold text-deep-blue-60">操作</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-deep-blue-10">
                                      {learnedFiles.length === 0 ? (
                                        <tr>
                                          <td colSpan={5} className="px-4 py-8 text-center text-deep-blue-40 text-sm">
                                            暂无选择学习的文件，请在"数据结构"标签中将文件权限设置为"允许"
                                          </td>
                                        </tr>
                                      ) : (
                                        learnedFiles.map((file) => (
                                          <tr key={file.id} className="hover:bg-light-sand/50 transition-colors">
                                            <td className="px-4 py-2.5">
                                              <div className="flex items-center gap-2">
                                                <FileText size={14} className="text-brand-petrol shrink-0" />
                                                <span className="text-sm text-deep-blue-80 font-medium">{file.name}</span>
                                              </div>
                                            </td>
                                            <td className="px-4 py-2.5">
                                              <span className="text-xs text-deep-blue-40">
                                                {file.path || '根目录'}
                                              </span>
                                            </td>
                                            <td className="px-4 py-2.5 text-center">
                                              <span className="text-xs text-deep-blue-40 font-mono">{file.size}</span>
                                            </td>
                                            <td className="px-4 py-2.5 text-center">
                                              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(file.status)}`}>
                                                {getStatusIcon(file.status)}
                                                {getStatusText(file.status)}
                                              </div>
                                            </td>
                                            <td className="px-4 py-2.5 text-center">
                                              {file.status === 'failed' && (
                                                <button
                                                  onClick={() => {
                                                    setProducts(products.map(p => {
                                                      if (p.id === product.id) {
                                                        const updatedChildren = updateFileStatusInTree(p.children, file.id, 'learning');
                                                        return { ...p, children: updatedChildren };
                                                      }
                                                      return p;
                                                    }));
                                                  }}
                                                  className="text-xs px-2.5 py-1 bg-primary-soft text-brand-petrol rounded-md hover:bg-primary-soft transition-colors font-medium"
                                                >
                                                  重试
                                                </button>
                                              )}
                                              {file.status === 'learned' && (
                                                <button
                                                  onClick={() => {
                                                    setProducts(products.map(p => {
                                                      if (p.id === product.id) {
                                                        const updatedChildren = updateFileStatusInTree(p.children, file.id, 'learning');
                                                        return { ...p, children: updatedChildren };
                                                      }
                                                      return p;
                                                    }));
                                                  }}
                                                  className="text-xs px-2.5 py-1 bg-light-sand text-deep-blue-60 rounded-md hover:bg-deep-blue-10 transition-colors font-medium"
                                                >
                                                  重新学习
                                                </button>
                                              )}
                                            </td>
                                          </tr>
                                        ))
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })()}
              </>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="px-6 py-12 text-center text-deep-blue-40">
            <Package size={48} className="mx-auto mb-4 opacity-50" />
            <p>暂无数据产品，请从 SDCC LAKE 申请</p>
          </div>
        )}
      </div>
    </div>
  );
}
