import { useState } from 'react';
import {
  Sparkles,
  Plus,
  Search,
  BarChart3,
  Edit2,
  Trash2,
  ChevronDown,
  X,
  Bot,
  FileText,
  Database,
  Settings,
  Users,
  Code,
  Globe,
  Briefcase,
  MoreHorizontal,
} from 'lucide-react';
import Toggle from '../components/Toggle';
import type { AgentSkill, SkillCategory } from '../types';

// ============================================
// Mock 数据
// ============================================

const mockSkills: AgentSkill[] = [
  {
    id: 'skill-001',
    name: '销售数据分析',
    description: '按照标准流程分析销售数据，从多维度解读业绩表现，生成结构化分析报告',
    icon: 'BarChart3',
    category: 'data-analysis',
    status: 'enabled',
    trigger: {
      keywords: ['销售', '业绩', '收入', '报表', '分析', '季度', '月度'],
      intents: ['sales_analysis', 'revenue_query'],
    },
    prompt: {
      role: '你是一个专业的销售数据分析助手，擅长从数据中提取洞察并给出建议。',
      methodology: [
        '1. 理解用户需求：明确分析目的、数据范围、时间周期',
        '2. 数据验证：检查数据完整性，识别异常值',
        '3. 多维度分析：从产品、地区、客户、时间等维度展开',
        '4. 趋势解读：识别增长/下降趋势，分析原因',
        '5. 建议输出：基于分析结果给出可落地的建议',
      ],
      constraints: [
        '数据仅展示最近12个月',
        '金额单位统一使用"万元"',
        '涉及隐私的客户信息需要脱敏',
      ],
      outputFormat: `## 分析结论

### 数据概览
[核心指标卡片]

### 详细分析
[Markdown表格]

### 趋势解读
[文字描述]

### 改进建议
[Bullet Points]`,
    },
    parameters: [],
    usage: { invokedCount: 156, successCount: 142, lastInvokedAt: '2024-01-15 10:30' },
    version: '1.0.0',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
    createdBy: 'admin',
  },
  {
    id: 'skill-002',
    name: '文档总结',
    description: '快速理解并总结长文档的核心内容，提取关键信息和要点',
    icon: 'FileText',
    category: 'document-processing',
    status: 'enabled',
    trigger: {
      keywords: ['总结', '摘要', '提炼', '文档', '文章', '报告'],
      intents: ['document_summary'],
    },
    prompt: {
      role: '你是一个专业的文档分析助手，擅长快速理解并提炼文档核心内容。',
      methodology: [
        '1. 通读全文：快速浏览文档结构',
        '2. 识别核心：找出文档的主要目的和结论',
        '3. 提取要点：列出关键信息和数据',
        '4. 组织输出：按逻辑分组呈现',
      ],
      constraints: [
        '总结控制在200字以内',
        '保留关键数据和结论',
        '使用简洁易懂的语言',
      ],
      outputFormat: `## 文档总结

### 核心观点
[1-2句话概括]

### 关键要点
- 要点1
- 要点2
- 要点3

### 重要数据
[如有]`,
    },
    parameters: [],
    usage: { invokedCount: 89, successCount: 78, lastInvokedAt: '2024-01-14 15:20' },
    version: '1.0.0',
    createdAt: '2024-01-02',
    updatedAt: '2024-01-14',
    createdBy: 'admin',
  },
  {
    id: 'skill-003',
    name: '代码审查',
    description: '按照最佳实践审查代码，发现潜在问题并提供改进建议',
    icon: 'Code',
    category: 'dev',
    status: 'enabled',
    trigger: {
      keywords: ['代码', '审查', 'review', '优化', 'bug', '问题'],
      intents: ['code_review'],
    },
    prompt: {
      role: '你是一个经验丰富的代码审查专家，熟悉各种编程最佳实践。',
      methodology: [
        '1. 代码理解：分析代码逻辑和结构',
        '2. 规范检查：对照编码规范',
        '3. 风险识别：发现潜在的bug和安全问题',
        '4. 优化建议：提出性能和改进建议',
      ],
      constraints: [
        '指出具体行号',
        '提供可运行的修改示例',
        '区分必须修复和建议优化',
      ],
      outputFormat: `## 代码审查报告

### 问题列表
| 级别 | 位置 | 描述 | 建议 |

### 总体评价
[评分和总结]`,
    },
    parameters: [],
    usage: { invokedCount: 45, successCount: 42, lastInvokedAt: '2024-01-13 09:15' },
    version: '1.0.1',
    createdAt: '2024-01-03',
    updatedAt: '2024-01-13',
    createdBy: 'admin',
  },
  {
    id: 'skill-004',
    name: '客户问题解答',
    description: '快速响应客户咨询，提供准确的问题解答和服务引导',
    icon: 'Users',
    category: 'customer-service',
    status: 'disabled',
    trigger: {
      keywords: ['问题', '咨询', '帮助', '如何使用', '怎么办'],
      intents: ['customer_support'],
    },
    prompt: {
      role: '你是一个热心的客服助手，善于理解客户问题并提供清晰解答。',
      methodology: [
        '1. 理解问题：确认客户的具体需求',
        '2. 查找信息：匹配相关的知识库',
        '3. 给出方案：提供具体的解决步骤',
        '4. 确认满意度：询问是否解决',
      ],
      constraints: [
        '使用友好亲切的语气',
        '复杂问题引导至人工服务',
        '避免专业术语',
      ],
      outputFormat: `## 问题解答

### 问题确认
[客户的问题]

### 解决方案
[具体步骤]

### 是否还有其他问题？
[主动询问]`,
    },
    parameters: [],
    usage: { invokedCount: 234, successCount: 210, lastInvokedAt: '2024-01-10 16:45' },
    version: '1.0.0',
    createdAt: '2024-01-04',
    updatedAt: '2024-01-10',
    createdBy: 'admin',
  },
];

// ============================================
// 类型和常量
// ============================================

type FilterCategory = 'all' | SkillCategory;
type FilterStatus = 'all' | 'enabled' | 'disabled';

const categoryOptions: { value: SkillCategory | 'all'; label: string; icon: React.ReactNode }[] = [
  { value: 'all', label: '全部分类', icon: <Sparkles size={14} /> },
  { value: 'data-analysis', label: '数据分析', icon: <BarChart3 size={14} /> },
  { value: 'document-processing', label: '文档处理', icon: <FileText size={14} /> },
  { value: 'customer-service', label: '客服', icon: <Users size={14} /> },
  { value: 'operation', label: '运维', icon: <Settings size={14} /> },
  { value: 'hr', label: '人力资源', icon: <Users size={14} /> },
  { value: 'finance', label: '财务', icon: <Briefcase size={14} /> },
  { value: 'dev', label: '开发', icon: <Code size={14} /> },
  { value: 'other', label: '其他', icon: <MoreHorizontal size={14} /> },
];

const iconOptions = [
  { value: 'BarChart3', icon: <BarChart3 size={16} /> },
  { value: 'FileText', icon: <FileText size={16} /> },
  { value: 'Database', icon: <Database size={16} /> },
  { value: 'Code', icon: <Code size={16} /> },
  { value: 'Users', icon: <Users size={16} /> },
  { value: 'Globe', icon: <Globe size={16} /> },
  { value: 'Bot', icon: <Bot size={16} /> },
  { value: 'Settings', icon: <Settings size={16} /> },
];

// ============================================
// 组件
// ============================================

export default function SkillManagement() {
  // State
  const [skills, setSkills] = useState<AgentSkill[]>(mockSkills);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<AgentSkill | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // 筛选后的技能列表
  const filteredSkills = skills.filter(skill => {
    const matchSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = filterCategory === 'all' || skill.category === filterCategory;
    const matchStatus = filterStatus === 'all' || skill.status === filterStatus;
    return matchSearch && matchCategory && matchStatus;
  });

  // 处理 Skill 操作
  const handleToggleSkillStatus = (skillId: string) => {
    setSkills(prev => prev.map(skill => {
      if (skill.id === skillId) {
        return {
          ...skill,
          status: skill.status === 'enabled' ? 'disabled' : 'enabled',
          updatedAt: new Date().toISOString().split('T')[0],
        };
      }
      return skill;
    }));
  };

  const handleEditSkill = (skill: AgentSkill) => {
    setEditingSkill(skill);
    setShowModal(true);
  };

  const handleDeleteSkill = (skillId: string) => {
    if (confirm('确定要删除这个 Skill 吗？')) {
      setSkills(prev => prev.filter(s => s.id !== skillId));
    }
  };

  const handleCreateSkill = () => {
    setEditingSkill(null);
    setShowModal(true);
  };

  const handleSelectAll = () => {
    if (selectedSkills.length === filteredSkills.length) {
      setSelectedSkills([]);
    } else {
      setSelectedSkills(filteredSkills.map(s => s.id));
    }
  };

  const handleSelectSkill = (skillId: string) => {
    setSelectedSkills(prev => {
      if (prev.includes(skillId)) {
        return prev.filter(id => id !== skillId);
      }
      return [...prev, skillId];
    });
  };

  const handleBatchDelete = () => {
    if (selectedSkills.length === 0) return;
    if (confirm(`确定要删除选中的 ${selectedSkills.length} 个 Skill 吗？`)) {
      setSkills(prev => prev.filter(s => !selectedSkills.includes(s.id)));
      setSelectedSkills([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-petrol-soft rounded-xl flex items-center justify-center shadow-soft">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-deep-blue-80 tracking-tight">Agent Skill 管理</h1>
            <p className="text-sm text-deep-blue-40">配置 AI Agent 的技能和方法论</p>
          </div>
        </div>
        <button
          onClick={handleCreateSkill}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-petrol text-white rounded-lg hover:bg-brand-petrol active:bg-brand-petrol-dark transition-all shadow-soft hover:shadow-soft font-medium"
        >
          <Plus size={18} />
          新建 Skill
        </button>
      </div>

      {/* 筛选栏 */}
      <div className="bg-white rounded-xl p-4 shadow-soft border border-deep-blue-10">
        <div className="flex flex-wrap items-center gap-4">
          {/* 分类筛选 */}
          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as FilterCategory)}
              className="appearance-none pl-3 pr-8 py-2.5 bg-light-sand border border-deep-blue-10 rounded-lg text-sm text-deep-blue-80 focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent cursor-pointer"
            >
              {categoryOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-deep-blue-40 pointer-events-none" />
          </div>

          {/* 状态筛选 */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              className="appearance-none pl-3 pr-8 py-2.5 bg-light-sand border border-deep-blue-10 rounded-lg text-sm text-deep-blue-80 focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent cursor-pointer"
            >
              <option value="all">全部状态</option>
              <option value="enabled">已启用</option>
              <option value="disabled">已禁用</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-deep-blue-40 pointer-events-none" />
          </div>

          {/* 搜索框 */}
          <div className="flex-1 min-w-[200px] relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-deep-blue-40" />
            <input
              type="text"
              placeholder="搜索 Skill 名称或描述..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-light-sand border border-deep-blue-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent"
            />
          </div>

          {/* 批量操作 */}
          {selectedSkills.length > 0 && (
            <button
              onClick={handleBatchDelete}
              className="flex items-center gap-2 px-4 py-2.5 text-red hover:bg-red-light rounded-lg transition-colors font-medium"
            >
              <Trash2 size={16} />
              批量删除 ({selectedSkills.length})
            </button>
          )}
        </div>
      </div>

      {/* Skill 列表 */}
      <div className="bg-white rounded-xl shadow-soft border border-deep-blue-10 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-light-sand border-b border-deep-blue-10">
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedSkills.length === filteredSkills.length && filteredSkills.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-deep-blue-20 text-primary focus:ring-primary/20"
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-deep-blue-60">Skill</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-deep-blue-60">分类</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-deep-blue-60">状态</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-deep-blue-60">触发词</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-deep-blue-60">更新时间</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-deep-blue-60">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredSkills.map(skill => (
              <tr key={skill.id} className="border-b border-light-sand hover:bg-light-sand/50 transition-colors">
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedSkills.includes(skill.id)}
                    onChange={() => handleSelectSkill(skill.id)}
                    className="rounded border-deep-blue-20 text-primary focus:ring-primary/20"
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      skill.category === 'data-analysis' ? 'bg-primary-soft text-brand-petrol' :
                      skill.category === 'document-processing' ? 'bg-brand-green/20 text-green' :
                      skill.category === 'dev' ? 'bg-soft-purple/20 text-dark-purple' :
                      skill.category === 'customer-service' ? 'bg-soft-yellow/30 text-dark-orange' :
                      'bg-light-sand text-deep-blue-40'
                    }`}>
                      {skill.icon === 'BarChart3' && <BarChart3 size={18} />}
                      {skill.icon === 'FileText' && <FileText size={18} />}
                      {skill.icon === 'Code' && <Code size={18} />}
                      {skill.icon === 'Users' && <Users size={18} />}
                      {skill.icon === 'Database' && <Database size={18} />}
                      {skill.icon === 'Bot' && <Bot size={18} />}
                      {skill.icon === 'Settings' && <Settings size={18} />}
                      {skill.icon === 'Globe' && <Globe size={18} />}
                    </div>
                    <div>
                      <p className="font-medium text-deep-blue-80">{skill.name}</p>
                      <p className="text-xs text-deep-blue-40 max-w-xs truncate">{skill.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                    skill.category === 'data-analysis' ? 'bg-primary-soft text-brand-petrol' :
                    skill.category === 'document-processing' ? 'bg-brand-green/20 text-green' :
                    skill.category === 'dev' ? 'bg-soft-purple/20 text-dark-purple' :
                    skill.category === 'customer-service' ? 'bg-soft-yellow/30 text-dark-orange' :
                    skill.category === 'hr' ? 'bg-soft-purple/20 text-dark-purple' :
                    skill.category === 'finance' ? 'bg-primary-soft text-brand-petrol-dark' :
                    skill.category === 'operation' ? 'bg-light-sand text-deep-blue-60' :
                    'bg-light-sand text-deep-blue-60'
                  }`}>
                    {categoryOptions.find(c => c.value === skill.category)?.label || '其他'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <Toggle
                    checked={skill.status === 'enabled'}
                    onChange={() => handleToggleSkillStatus(skill.id)}
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {skill.trigger.keywords.slice(0, 3).map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 bg-light-sand text-deep-blue-60 rounded text-xs">
                        {kw}
                      </span>
                    ))}
                    {skill.trigger.keywords.length > 3 && (
                      <span className="px-2 py-0.5 bg-light-sand text-deep-blue-40 rounded text-xs">
                        +{skill.trigger.keywords.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm text-deep-blue-60">{skill.updatedAt}</p>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleEditSkill(skill)}
                      className="p-2 text-deep-blue-40 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                      title="编辑"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="p-2 text-deep-blue-40 hover:text-red hover:bg-red-light rounded-lg transition-colors"
                      title="删除"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredSkills.length === 0 && (
          <div className="py-12 text-center">
            <Sparkles size={48} className="mx-auto text-deep-blue-20 mb-4" />
            <p className="text-deep-blue-40">暂无匹配的 Skill</p>
            <button
              onClick={handleCreateSkill}
              className="mt-4 text-primary hover:underline"
            >
              创建第一个 Skill
            </button>
          </div>
        )}
      </div>

      {/* 新建/编辑弹窗 */}
      {showModal && (
        <SkillEditorModal
          skill={editingSkill}
          onClose={() => {
            setShowModal(false);
            setEditingSkill(null);
          }}
          onSave={(savedSkill) => {
            if (editingSkill) {
              setSkills(prev => prev.map(s => s.id === savedSkill.id ? savedSkill : s));
            } else {
              setSkills(prev => [...prev, savedSkill]);
            }
            setShowModal(false);
            setEditingSkill(null);
          }}
        />
      )}
    </div>
  );
}

// ============================================
// Skill 编辑弹窗组件
// ============================================

interface SkillEditorModalProps {
  skill: AgentSkill | null;
  onClose: () => void;
  onSave: (skill: AgentSkill) => void;
}

function SkillEditorModal({ skill, onClose, onSave }: SkillEditorModalProps) {
  const isEditing = !!skill;
  const [formData, setFormData] = useState<Partial<AgentSkill>>(
    skill || {
      name: '',
      description: '',
      icon: 'BarChart3',
      category: 'data-analysis',
      status: 'enabled',
      trigger: { keywords: [], intents: [] },
      prompt: {
        role: '',
        methodology: [],
        constraints: [],
        outputFormat: '',
      },
      parameters: [],
    }
  );

  const [newKeyword, setNewKeyword] = useState('');
  const [newIntent, setNewIntent] = useState('');
  const [newMethodology, setNewMethodology] = useState('');
  const [newConstraint, setNewConstraint] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = new Date().toISOString().split('T')[0];
    const savedSkill: AgentSkill = {
      id: skill?.id || `skill-${Date.now()}`,
      name: formData.name || '',
      description: formData.description || '',
      icon: formData.icon || 'BarChart3',
      category: formData.category || 'data-analysis',
      status: formData.status || 'enabled',
      trigger: formData.trigger || { keywords: [], intents: [] },
      prompt: formData.prompt || { role: '', methodology: [], constraints: [], outputFormat: '' },
      parameters: formData.parameters || [],
      usage: skill?.usage || { invokedCount: 0, successCount: 0 },
      version: skill?.version || '1.0.0',
      createdAt: skill?.createdAt || now,
      updatedAt: now,
      createdBy: skill?.createdBy || 'admin',
    };
    
    onSave(savedSkill);
  };

  const addKeyword = () => {
    if (newKeyword.trim()) {
      setFormData(prev => ({
        ...prev,
        trigger: {
          ...prev.trigger!,
          keywords: [...(prev.trigger?.keywords || []), newKeyword.trim()],
        },
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    setFormData(prev => ({
      ...prev,
      trigger: {
        ...prev.trigger!,
        keywords: (prev.trigger?.keywords || []).filter((_, i) => i !== index),
      },
    }));
  };

  const addIntent = () => {
    if (newIntent.trim()) {
      setFormData(prev => ({
        ...prev,
        trigger: {
          ...prev.trigger!,
          intents: [...(prev.trigger?.intents || []), newIntent.trim()],
        },
      }));
      setNewIntent('');
    }
  };

  const removeIntent = (index: number) => {
    setFormData(prev => ({
      ...prev,
      trigger: {
        ...prev.trigger!,
        intents: (prev.trigger?.intents || []).filter((_, i) => i !== index),
      },
    }));
  };

  const addMethodology = () => {
    if (newMethodology.trim()) {
      setFormData(prev => ({
        ...prev,
        prompt: {
          ...prev.prompt!,
          methodology: [...(prev.prompt?.methodology || []), newMethodology.trim()],
        },
      }));
      setNewMethodology('');
    }
  };

  const removeMethodology = (index: number) => {
    setFormData(prev => ({
      ...prev,
      prompt: {
        ...prev.prompt!,
        methodology: (prev.prompt?.methodology || []).filter((_, i) => i !== index),
      },
    }));
  };

  const addConstraint = () => {
    if (newConstraint.trim()) {
      setFormData(prev => ({
        ...prev,
        prompt: {
          ...prev.prompt!,
          constraints: [...(prev.prompt?.constraints || []), newConstraint.trim()],
        },
      }));
      setNewConstraint('');
    }
  };

  const removeConstraint = (index: number) => {
    setFormData(prev => ({
      ...prev,
      prompt: {
        ...prev.prompt!,
        constraints: (prev.prompt?.constraints || []).filter((_, i) => i !== index),
      },
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-xl">
        {/* 弹窗头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-deep-blue-10">
          <h2 className="text-lg font-semibold text-deep-blue-80">
            {isEditing ? '编辑 Skill' : '新建 Skill'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-deep-blue-40 hover:text-deep-blue-60 hover:bg-light-sand rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 弹窗内容 */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-8">
            {/* 基本信息 */}
            <div>
              <h3 className="text-sm font-medium text-deep-blue-80 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-primary/10 text-primary rounded-md flex items-center justify-center text-xs">1</span>
                基本信息
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-deep-blue-60 mb-1.5">Skill 名称 *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-deep-blue-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="例如：销售数据分析"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-deep-blue-60 mb-1.5">分类 *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as SkillCategory }))}
                    className="w-full px-3 py-2 border border-deep-blue-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {categoryOptions.filter(c => c.value !== 'all').map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-deep-blue-60 mb-1.5">图标</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                    className="w-full px-3 py-2 border border-deep-blue-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {iconOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.value}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-deep-blue-60 mb-1.5">状态</label>
                  <div className="flex items-center gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={formData.status === 'enabled'}
                        onChange={() => setFormData(prev => ({ ...prev, status: 'enabled' }))}
                        className="text-primary focus:ring-primary/20"
                      />
                      <span className="text-sm text-deep-blue-80">启用</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={formData.status === 'disabled'}
                        onChange={() => setFormData(prev => ({ ...prev, status: 'disabled' }))}
                        className="text-primary focus:ring-primary/20"
                      />
                      <span className="text-sm text-deep-blue-80">禁用</span>
                    </label>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-deep-blue-60 mb-1.5">描述</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-deep-blue-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    placeholder="简要描述这个 Skill 的功能..."
                  />
                </div>
              </div>
            </div>

            {/* 触发条件 */}
            <div>
              <h3 className="text-sm font-medium text-deep-blue-80 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-primary/10 text-primary rounded-md flex items-center justify-center text-xs">2</span>
                触发条件
                <span className="text-xs text-deep-blue-40 font-normal">（当用户问题匹配以下条件时激活此 Skill）</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-deep-blue-60 mb-1.5">关键词</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.trigger?.keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-soft-purple/20 text-dark-purple rounded-md text-xs"
                      >
                        {kw}
                        <button type="button" onClick={() => removeKeyword(i)} className="hover:text-dark-purple">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                      className="flex-1 px-3 py-2 border border-deep-blue-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="输入关键词后按回车添加"
                    />
                    <button
                      type="button"
                      onClick={addKeyword}
                      className="px-3 py-2 bg-light-sand text-deep-blue-60 rounded-lg text-sm hover:bg-deep-blue-10 transition-colors"
                    >
                      添加
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-deep-blue-60 mb-1.5">意图标识</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.trigger?.intents.map((intent, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-primary-soft text-brand-petrol rounded-md text-xs"
                      >
                        {intent}
                        <button type="button" onClick={() => removeIntent(i)} className="hover:text-brand-petrol-dark">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newIntent}
                      onChange={(e) => setNewIntent(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIntent())}
                      className="flex-1 px-3 py-2 border border-deep-blue-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="输入意图标识后按回车添加"
                    />
                    <button
                      type="button"
                      onClick={addIntent}
                      className="px-3 py-2 bg-light-sand text-deep-blue-60 rounded-lg text-sm hover:bg-deep-blue-10 transition-colors"
                    >
                      添加
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Prompt 配置 */}
            <div>
              <h3 className="text-sm font-medium text-deep-blue-80 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-primary/10 text-primary rounded-md flex items-center justify-center text-xs">3</span>
                Prompt 配置
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-deep-blue-60 mb-1.5">角色定义</label>
                  <textarea
                    value={formData.prompt?.role}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      prompt: { ...prev.prompt!, role: e.target.value }
                    }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-deep-blue-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    placeholder="定义 AI 在执行此 Skill 时的角色定位..."
                  />
                </div>

                <div>
                  <label className="block text-sm text-deep-blue-60 mb-1.5">执行方法论</label>
                  <div className="space-y-2 mb-2">
                    {formData.prompt?.methodology.map((step, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-xs text-deep-blue-40 w-6">{i + 1}.</span>
                        <span className="flex-1 text-sm text-deep-blue-80">{step}</span>
                        <button
                          type="button"
                          onClick={() => removeMethodology(i)}
                          className="p-1 text-deep-blue-40 hover:text-red"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMethodology}
                      onChange={(e) => setNewMethodology(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMethodology())}
                      className="flex-1 px-3 py-2 border border-deep-blue-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="输入执行步骤后按回车添加"
                    />
                    <button
                      type="button"
                      onClick={addMethodology}
                      className="px-3 py-2 bg-light-sand text-deep-blue-60 rounded-lg text-sm hover:bg-deep-blue-10 transition-colors"
                    >
                      添加
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-deep-blue-60 mb-1.5">约束规则</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.prompt?.constraints.map((constraint, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-soft-yellow/30 text-dark-orange rounded-md text-xs"
                      >
                        {constraint}
                        <button type="button" onClick={() => removeConstraint(i)} className="hover:text-dark-orange">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newConstraint}
                      onChange={(e) => setNewConstraint(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addConstraint())}
                      className="flex-1 px-3 py-2 border border-deep-blue-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="输入约束条件后按回车添加"
                    />
                    <button
                      type="button"
                      onClick={addConstraint}
                      className="px-3 py-2 bg-light-sand text-deep-blue-60 rounded-lg text-sm hover:bg-deep-blue-10 transition-colors"
                    >
                      添加
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-deep-blue-60 mb-1.5">输出格式</label>
                  <textarea
                    value={formData.prompt?.outputFormat}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      prompt: { ...prev.prompt!, outputFormat: e.target.value }
                    }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-deep-blue-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none font-mono"
                    placeholder="定义 Skill 执行后的输出格式要求..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 弹窗底部 */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-deep-blue-10 bg-light-sand">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-deep-blue-60 hover:bg-light-sand rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              {isEditing ? '保存修改' : '创建 Skill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
