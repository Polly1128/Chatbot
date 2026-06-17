import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  Send,
  Plus,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  FileText,
  Image,
  FolderOpen,
  Sparkles,
  MessageCircle,
  BarChart3,
  X,
  CheckCircle2,
  RefreshCw,
  Copy,
  MoreHorizontal,
  BookOpen,
  History,
  User,
  ExternalLink,
  Shield,
  Zap,
  Cloud,
  PanelLeftClose,
  PanelLeftOpen,
  MapPin,
  Briefcase,
  Heart,
  BookOpen as BookOpenIcon,
  Phone,
  MessageSquare,
  Brain,
  Pencil,
  Trash2,
  Check,
} from 'lucide-react';
import type { AgentSkill } from '../types';

// Mock data
const mockWorkspaces = [
  { 
    id: '1', 
    name: 'Siemens China', 
    isPublic: true, 
    memberCount: 128, 
    avatar: 'SC',
    description: '西门子中国通用知识工作区',
    targetUsers: '西门子中国内部所有用户',
    knowledgeScope: '西门子中国通用知识（包括但不限于休假政策、差旅政策、各分公司地址、公司各标准服务和技术团队联系方式、大禹团队春节值班信息等）',
    status: 'active'
  },
  { 
    id: '2', 
    name: 'SAP', 
    isPublic: true, 
    memberCount: 256, 
    avatar: 'SAP',
    description: 'SAP系统使用工作区',
    targetUsers: '全球使用西门子SAP系统的员工',
    knowledgeScope: 'SAP系统使用相关问题（包括但不限于如何下载WBS的SO列表、如何更改SAP中的小数符号、如何在SAP中设置快速剪切粘贴功能、如何将SAP事务代码添加到SAP的收藏夹中等）',
    status: 'active'
  },
  { 
    id: '3', 
    name: 'AskIT', 
    isPublic: true, 
    memberCount: 192, 
    avatar: 'IT',
    description: 'IT服务支持工作区',
    targetUsers: '西门子中国所有用户',
    knowledgeScope: 'IT相关问题（包括但不限于标准IT服务、寻求人工支持、提交IT申请单、如何申请公司电脑、名下资产查询、名下服务查询、电脑到期日期等）',
    status: 'active'
  },
];

const mockAgents = [
  { id: '1', name: '智能助手', type: 'custom', description: '通用智能问答助手', status: 'online' },
  { id: '2', name: '数据查询专家', type: 'askdata', description: '基于数据库的数据分析助手', status: 'online' },
  { id: '3', name: '知识库助手', type: 'custom', description: '基于知识库的问答助手', status: 'online' },
];

const mockModels = [
  { id: '1', name: 'DeepSeek R1', provider: 'DeepSeek', version: 'latest' },
  { id: '2', name: 'GPT-4 Turbo', provider: 'OpenAI', version: '128k' },
  { id: '3', name: 'Claude 3 Sonnet', provider: 'Anthropic', version: '3.5' },
];

const mockHistory = [
  { id: '1', title: '关于产品定价的咨询', time: '今天 14:30', messages: [] },
  { id: '2', title: '数据分析报告生成', time: '今天 10:15', messages: [] },
  { id: '3', title: 'API接口文档查询', time: '昨天 16:45', messages: [] },
];

const mockMessages: Message[] = [];

// Siemens China AI推荐问题（9个）
const siemensChinaRecommendedQuestions = [
  { id: '1', question: '帮我查询今年的年假余额', category: '休假管理', type: 'recommended' },
  { id: '2', question: '生成差旅申请流程说明', category: '流程咨询', type: 'recommended' },
  { id: '3', question: '查询最近的公司通知', category: '公司信息', type: 'recommended' },
  { id: '4', question: '如何联系技术支持团队', category: '技术支持', type: 'recommended' },
  { id: '5', question: '查询我的培训记录', category: '培训发展', type: 'recommended' },
  { id: '6', question: '帮我查看本月的加班统计', category: '考勤管理', type: 'recommended' },
  { id: '7', question: '如何申请会议室', category: '资源预订', type: 'recommended' },
  { id: '8', question: '查询公司福利政策', category: '薪酬福利', type: 'recommended' },
  { id: '9', question: '如何更新个人信息', category: '个人设置', type: 'recommended' },
];

// SAP AI推荐问题（9个）
const sapRecommendedQuestions = [
  { id: '1', question: '如何下载WBS的SO列表？', category: '数据导出', type: 'recommended' },
  { id: '2', question: '如何更改SAP中的小数符号？', category: '系统设置', type: 'recommended' },
  { id: '3', question: '如何在SAP中设置快速剪切粘贴功能？', category: '效率提升', type: 'recommended' },
  { id: '4', question: '如何将SAP事务代码添加到收藏夹？', category: '个性化设置', type: 'recommended' },
  { id: '5', question: '查询常用SAP事务代码', category: '快捷操作', type: 'recommended' },
  { id: '6', question: '生成SAP操作指南', category: '文档生成', type: 'recommended' },
  { id: '7', question: '解决SAP登录问题', category: '故障排除', type: 'recommended' },
  { id: '8', question: '优化SAP使用效率', category: '效率提升', type: 'recommended' },
  { id: '9', question: '如何查看采购订单状态', category: '采购管理', type: 'recommended' },
];

// AskIT AI推荐问题（9个）
const askitRecommendedQuestions = [
  { id: '1', question: '如何申请公司电脑？', category: '设备申请', type: 'recommended' },
  { id: '2', question: '查询名下资产和服务', category: '资产查询', type: 'recommended' },
  { id: '3', question: '电脑到期日期查询', category: '资产管理', type: 'recommended' },
  { id: '4', question: '提交IT申请单', category: '服务申请', type: 'recommended' },
  { id: '5', question: '寻求人工IT支持', category: '技术支持', type: 'recommended' },
  { id: '6', question: '解决电脑常见问题', category: '故障排除', type: 'recommended' },
  { id: '7', question: '如何重置密码', category: '账户安全', type: 'recommended' },
  { id: '8', question: 'VPN连接问题排查', category: '网络支持', type: 'recommended' },
  { id: '9', question: '软件安装申请流程', category: '软件管理', type: 'recommended' },
];

// 根据当前workspace获取对应的推荐问题
const getWorkspaceRecommendedQuestions = (workspaceId: string) => {
  switch (workspaceId) {
    case '1': return siemensChinaRecommendedQuestions;
    case '2': return sapRecommendedQuestions;
    case '3': return askitRecommendedQuestions;
    default: return siemensChinaRecommendedQuestions;
  }
};

// 推荐文档数据
const mockRecommendedDocs = [
  { id: '1', title: 'SAP 销售模块操作指南', category: '操作手册', updatedAt: '2024-01-10', url: '#' },
  { id: '2', title: '数据分析最佳实践', category: '白皮书', updatedAt: '2024-01-08', url: '#' },
  { id: '3', title: 'API 接口文档 v2.0', category: '技术文档', updatedAt: '2024-01-05', url: '#' },
  { id: '4', title: '系统管理员手册', category: '操作手册', updatedAt: '2024-01-04', url: '#' },
  { id: '5', title: 'AI模型部署指南', category: '技术文档', updatedAt: '2024-01-03', url: '#' },
  { id: '6', title: '数据安全白皮书', category: '白皮书', updatedAt: '2024-01-02', url: '#' },
  { id: '7', title: '业务流程规范', category: '操作手册', updatedAt: '2024-01-01', url: '#' },
  { id: '8', title: '机器学习入门', category: '技术文档', updatedAt: '2023-12-28', url: '#' },
  { id: '9', title: '云服务配置指南', category: '技术文档', updatedAt: '2023-12-25', url: '#' },
  { id: '10', title: '用户培训手册', category: '操作手册', updatedAt: '2023-12-20', url: '#' },
];

// 用户Profile数据
const mockUserProfile = {
  name: '张三',
  avatar: 'ZS',
  role: 'Workspace Owner',
  description: '',
};

// Profile 常量选项
const LOCATION_OPTIONS = [
  { value: 'beijing', label: '北京' },
  { value: 'shanghai', label: '上海' },
  { value: 'shenzhen', label: '深圳' },
  { value: 'guangzhou', label: '广州' },
  { value: 'chengdu', label: '成都' },
  { value: 'nanjing', label: '南京' },
  { value: 'wuhan', label: '武汉' },
  { value: 'hangzhou', label: '杭州' },
  { value: 'xian', label: '西安' },
  { value: 'suzhou', label: '苏州' },
];

const EXPERTISE_OPTIONS = [
  { value: 'it', label: 'IT' },
  { value: 'po', label: 'P&O' },
  { value: 'sales', label: 'Sales' },
  { value: 'finance', label: 'Finance' },
  { value: 'operations', label: 'Operations' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'rd', label: 'R&D' },
  { value: 'legal', label: 'Legal' },
  { value: 'supply-chain', label: 'Supply Chain' },
  { value: 'hr', label: 'HR' },
];

const INTEREST_OPTIONS = [
  { value: 'ai', label: 'AI' },
  { value: 'mendix', label: 'Mendix' },
  { value: 'sap', label: 'SAP' },
  { value: 'digital-transformation', label: '数字化转型' },
  { value: 'machine-learning', label: '机器学习' },
  { value: 'data-analysis', label: '数据分析' },
  { value: 'cloud', label: '云计算' },
  { value: 'iot', label: '物联网' },
  { value: 'cybersecurity', label: '网络安全' },
  { value: 'automation', label: '自动化' },
];

const KNOWLEDGE_OPTIONS = [
  { value: 'legal', label: '法律知识' },
  { value: 'import-export', label: '进出口知识' },
  { value: 'finance', label: '财务知识' },
  { value: 'hr', label: '人力资源知识' },
  { value: 'project-management', label: '项目管理知识' },
  { value: 'compliance', label: '合规知识' },
  { value: 'quality', label: '质量管理知识' },
  { value: 'procurement', label: '采购知识' },
];

// Mock AI 记忆数据
interface MemoryItem {
  id: string;
  content: string;
  category: string;
  createdAt: string;
}

const mockMemories: MemoryItem[] = [
  { id: 'mem-1', content: '用户经常询问SAP操作相关问题，特别是销售订单和采购订单模块', category: '使用偏好', createdAt: '2024-01-15 14:30' },
  { id: 'mem-2', content: '用户偏好使用中文进行交流，技术术语接受英文', category: '语言偏好', createdAt: '2024-01-14 10:20' },
  { id: 'mem-3', content: '用户所在部门为IT部门，主要关注数字化转型相关项目', category: '用户背景', createdAt: '2024-01-13 16:45' },
  { id: 'mem-4', content: '用户倾向于获取简洁的步骤式回答，不喜欢冗长的背景介绍', category: '交互偏好', createdAt: '2024-01-12 09:15' },
  { id: 'mem-5', content: '用户对Mendix低代码平台有浓厚兴趣，正在评估其可行性', category: '兴趣记录', createdAt: '2024-01-11 11:30' },
];

// Agent Skill 数据
const mockSkills: AgentSkill[] = [
  {
    id: 'skill-001',
    name: '销售数据分析',
    description: '按照标准流程分析销售数据，从多维度解读业绩表现',
    icon: 'BarChart3',
    category: 'data-analysis',
    status: 'enabled',
    trigger: {
      keywords: ['销售', '业绩', '收入', '报表', '分析', '季度', '月度', '数据'],
      intents: ['sales_analysis', 'revenue_query'],
    },
    prompt: {
      role: '你是一个专业的销售数据分析助手',
      methodology: ['1. 理解用户需求', '2. 数据验证', '3. 多维度分析', '4. 趋势解读', '5. 建议输出'],
      constraints: ['数据仅展示最近12个月', '金额单位统一使用万元'],
      outputFormat: '## 分析结论\n### 数据概览\n### 详细分析',
    },
    parameters: [],
    usage: { invokedCount: 156, successCount: 142 },
    version: '1.0.0',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
    createdBy: 'admin',
  },
  {
    id: 'skill-002',
    name: '文档总结',
    description: '快速理解并总结长文档的核心内容',
    icon: 'FileText',
    category: 'document-processing',
    status: 'enabled',
    trigger: {
      keywords: ['总结', '摘要', '提炼', '文档', '文章', '报告', '概括'],
      intents: ['document_summary'],
    },
    prompt: {
      role: '你是一个专业的文档分析助手',
      methodology: ['1. 通读全文', '2. 识别核心', '3. 提取要点', '4. 组织输出'],
      constraints: ['总结控制在200字以内', '保留关键数据'],
      outputFormat: '## 文档总结\n### 核心观点\n### 关键要点',
    },
    parameters: [],
    usage: { invokedCount: 89, successCount: 78 },
    version: '1.0.0',
    createdAt: '2024-01-02',
    updatedAt: '2024-01-14',
    createdBy: 'admin',
  },
  {
    id: 'skill-003',
    name: '代码审查',
    description: '按照最佳实践审查代码，发现潜在问题',
    icon: 'Code',
    category: 'dev',
    status: 'enabled',
    trigger: {
      keywords: ['代码', '审查', 'review', '优化', 'bug', '问题', '修复'],
      intents: ['code_review'],
    },
    prompt: {
      role: '你是一个经验丰富的代码审查专家',
      methodology: ['1. 代码理解', '2. 规范检查', '3. 风险识别', '4. 优化建议'],
      constraints: ['指出具体行号', '提供可运行的修改示例'],
      outputFormat: '## 代码审查报告\n### 问题列表\n### 总体评价',
    },
    parameters: [],
    usage: { invokedCount: 45, successCount: 42 },
    version: '1.0.1',
    createdAt: '2024-01-03',
    updatedAt: '2024-01-13',
    createdBy: 'admin',
  },
  {
    id: 'skill-004',
    name: '翻译',
    description: '专业多语言翻译服务',
    icon: 'Globe',
    category: 'other',
    status: 'enabled',
    trigger: {
      keywords: ['翻译', '英文', '中文', '日文', '韩文', '翻译为'],
      intents: ['translation'],
    },
    prompt: {
      role: '你是一个专业的多语言翻译专家',
      methodology: ['1. 理解原文', '2. 准确翻译', '3. 保持语境', '4. 润色优化'],
      constraints: ['保持原文意思不变', '使用地道表达'],
      outputFormat: '## 翻译结果\n原文：\n译文：',
    },
    parameters: [],
    usage: { invokedCount: 234, successCount: 228 },
    version: '1.0.0',
    createdAt: '2024-01-04',
    updatedAt: '2024-01-12',
    createdBy: 'admin',
  },
  {
    id: 'skill-005',
    name: '问题解答',
    description: '专业解答各类问题',
    icon: 'HelpCircle',
    category: 'customer-service',
    status: 'enabled',
    trigger: {
      keywords: ['问题', '咨询', '帮助', '如何', '怎么办', '为什么', '什么是'],
      intents: ['question_answer', 'customer_support'],
    },
    prompt: {
      role: '你是一个热心的问题解答助手',
      methodology: ['1. 理解问题', '2. 查找信息', '3. 给出方案', '4. 确认解答'],
      constraints: ['使用友好亲切的语气', '避免专业术语'],
      outputFormat: '## 问题解答\n### 问题确认\n### 解决方案',
    },
    parameters: [],
    usage: { invokedCount: 512, successCount: 498 },
    version: '1.0.0',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-11',
    createdBy: 'admin',
  },
];

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  attachments?: Array<{ name: string; type: string; size: string }>;
  skillId?: string;
}

export default function ChatBot() {
  const navigate = useNavigate();
  const [selectedWorkspace, setSelectedWorkspace] = useState(mockWorkspaces[0]);
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<typeof mockAgents[0] | null>(null);
  const [selectedModel, setSelectedModel] = useState(mockModels[0]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; type: string; size: string }>>([]);
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [showAgentPanel, setShowAgentPanel] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [showAgentsModal, setShowAgentsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [userProfile, setUserProfile] = useState(mockUserProfile);
  const [profileDescription, setProfileDescription] = useState(mockUserProfile.description);
  // Profile 新增字段 state
  const [profileLocation, setProfileLocation] = useState('');
  const [profileExpertise, setProfileExpertise] = useState<string[]>([]);
  const [profileInterests, setProfileInterests] = useState<string[]>([]);
  const [profileKnowledge, setProfileKnowledge] = useState<string[]>([]);
  const [profilePhone, setProfilePhone] = useState('');
  const [profileMemoryEnabled, setProfileMemoryEnabled] = useState(false);
  const [profileBio, setProfileBio] = useState('');
  // AI 记忆相关 state
  const [aiMemories, setAiMemories] = useState<MemoryItem[]>(mockMemories);
  const [editingMemoryId, setEditingMemoryId] = useState<string | null>(null);
  const [editingMemoryContent, setEditingMemoryContent] = useState('');
  const [isMemoriesLoading, setIsMemoriesLoading] = useState(false);
  // Profile 多选下拉 state
  const [openMultiSelect, setOpenMultiSelect] = useState<string | null>(null);
  const [settingsLanguage, setSettingsLanguage] = useState('zh');
  const [settingsDefaultModel, setSettingsDefaultModel] = useState(mockModels[0]);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const isAdmin = true; // Mock: 当前用户是管理员
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Skill 匹配算法
  const findMatchedSkill = (message: string): AgentSkill | null => {
    const lowerMsg = message.toLowerCase();
    
    const matchedSkills = mockSkills
      .filter(s => s.status === 'enabled')
      .map(skill => {
        const matchedKeywords = skill.trigger.keywords.filter(kw => 
          lowerMsg.includes(kw.toLowerCase())
        );
        return {
          skill,
          matchCount: matchedKeywords.length,
          matchedKeywords,
        };
      })
      .filter(item => item.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount);

    return matchedSkills.length > 0 ? matchedSkills[0].skill : null;
  };

  // 模拟AI回复（支持Skill）
  const simulateReply = (skill: AgentSkill | null = null) => {
    setIsTyping(true);
    
    const skillReplies: Record<string, string[]> = {
      '销售数据分析': [
        `📊 【销售数据分析 Skill 已激活】\n\n好的，我将按照标准流程为您分析销售数据。\n\n**执行步骤：**\n1. 理解您的需求\n2. 验证数据完整性\n3. 多维度分析\n4. 趋势解读\n5. 提供建议\n\n请告诉我您想分析哪个维度的销售数据？`,
        `📊 【销售数据分析 Skill 已激活】\n\n根据您的问题，我将从多个维度分析销售业绩。\n\n**分析维度包括：**\n• 产品类别\n• 销售区域\n• 客户群体\n• 时间周期\n\n请问需要我关注哪些具体维度？`,
      ],
      '文档总结': [
        `📝 【文档总结 Skill 已激活】\n\n好的，我将帮您总结文档内容。请提供需要总结的文档文本，我会：\n\n1. 通读全文理解核心\n2. 提取关键要点\n3. 组织输出清晰结构\n\n期待您的文档！`,
      ],
      '代码审查': [
        `🔍 【代码审查 Skill 已激活】\n\n好的，我将按照最佳实践帮您审查代码。请粘贴需要审查的代码，我会：\n\n1. 分析代码逻辑和结构\n2. 对照编码规范检查\n3. 识别潜在问题和风险\n4. 提供优化建议\n\n请提供代码！`,
      ],
      '翻译': [
        `🌍 【翻译 Skill 已激活】\n\n好的，我将为您提供专业翻译服务。请告诉我：\n\n1. 需要翻译的文本\n2. 目标语言（如：英文、中文、日文等）\n\n期待您的内容！`,
      ],
      '问题解答': [
        `💡 【问题解答 Skill 已激活】\n\n好的，我将帮您解答问题。请详细描述您的问题，我会：\n\n1. 理解您的具体需求\n2. 查找相关信息\n3. 给出清晰的解决方案\n\n请开始提问！`,
      ],
    };

    const replies = skill && skillReplies[skill.name]
      ? skillReplies[skill.name]
      : [
          '好的，我来帮您分析一下这个问题。首先，让我梳理一下您的需求...',
          '根据您的问题，我建议采取以下步骤：\n\n1. 首先确认问题的核心要点\n2. 分析可能的解决方案\n3. 评估每种方案的优缺点\n4. 选择最佳方案并执行\n\n您觉得这个思路怎么样？',
          '这个问题很有意思！让我为您详细解答。首先，我们需要了解背景信息...',
        ];

    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: randomReply,
          timestamp: new Date().toISOString(),
          skillId: skill?.id,
        },
      ]);
      setIsTyping(false);
    }, 2000);
  };

  // 发送消息
  const handleSend = () => {
    if (!inputValue.trim() && uploadedFiles.length === 0) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
      attachments: uploadedFiles.length > 0 ? [...uploadedFiles] : undefined,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    setUploadedFiles([]);

    const matched = findMatchedSkill(inputValue);

    simulateReply(matched);
  };

  // 获取消息关联的 Skill
  const getMessageSkill = (skillId: string | undefined): AgentSkill | undefined => {
    return mockSkills.find(s => s.id === skillId);
  };

  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: Array<{ name: string; type: string; size: string }> = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const size = (file.size / 1024 / 1024).toFixed(2) + ' MB';
      newFiles.push({
        name: file.name,
        type: file.type || 'unknown',
        size,
      });
    }

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  // 删除上传的文件
  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // 复制消息
  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  // 重新生成回复
  const regenerateReply = () => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        setMessages((prev) => prev.slice(0, -1));
        simulateReply();
      }
    }
  };

  // 进入后台管理
  const goToAdmin = () => {
    navigate('/admin');
  };

  // 创建新对话
  const createNewChat = () => {
    setMessages([]);
  };

  // 切换推荐文档展开/折叠（同时折叠发现智能体）
  const toggleRecommendations = () => {
    setShowRecommendations(!showRecommendations);
    setShowAgentPanel(false);
  };

  // 切换发现智能体展开/折叠（同时折叠推荐文档）
  const toggleAgentPanel = () => {
    setShowAgentPanel(!showAgentPanel);
    setShowRecommendations(false);
  };

  // 渲染消息
  const renderMessage = (message: Message, index: number) => {
    const isUser = message.role === 'user';
    const isAssistant = message.role === 'assistant';
    const isLastMessage = index === messages.length - 1;

    return (
      <div
        key={message.id}
        className={`flex gap-3 mb-6 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      >
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            isUser
              ? 'bg-siemens-petrol text-white'
              : isAssistant
              ? 'bg-gradient-to-br from-siemens-petrol to-dark-purple text-white'
              : 'bg-deep-blue-10 text-deep-blue-60'
          }`}
        >
          {isUser ? (
            <MessageCircle size={18} />
          ) : isAssistant ? (
            <Sparkles size={18} />
          ) : (
            <Bot size={18} />
          )}
        </div>

        {/* Message Content */}
        <div
          className={`max-w-[70%] ${
            isUser ? 'items-end' : 'items-start'
          } flex flex-col`}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-deep-blue-80">
              {isUser ? '我' : isAssistant ? selectedAgent?.name : '系统'}
            </span>
            <span className="text-xs text-deep-blue-40">
              {new Date(message.timestamp).toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            {/* Skill 触发标识 - 简洁样式 */}
            {isAssistant && message.skillId && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-soft-purple/20 border border-soft-purple/30 rounded-lg text-dark-purple text-xs font-medium">
                <Zap size={11} className="text-dark-purple" />
                <span>已激活Skill {getMessageSkill(message.skillId)?.name || 'Skill'}</span>
              </span>
            )}
          </div>

          {/* Content */}
          <div
            className={`px-4 py-3 rounded-2xl ${
              isUser
                ? 'bg-primary text-white rounded-br-md'
                : 'bg-light-sand text-deep-blue-80 rounded-bl-md'
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>

            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {message.attachments.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-2 bg-deep-blue-10 rounded-lg"
                  >
                    {file.type.includes('image') ? (
                      <Image size={16} className="text-deep-blue-60" />
                    ) : file.type.includes('pdf') ? (
                      <FileText size={16} className="text-red" />
                    ) : (
                      <FolderOpen size={16} className="text-brand-petrol" />
                    )}
                    <span className="text-xs text-deep-blue-80 flex-1 truncate">
                      {file.name}
                    </span>
                    <span className="text-xs text-deep-blue-40">{file.size}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          {isAssistant && isLastMessage && !isTyping && (
            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={() => copyMessage(message.content)}
                className="flex items-center gap-1 text-xs text-deep-blue-40 hover:text-deep-blue-60 transition-colors"
              >
                <Copy size={14} />
                复制
              </button>
              <button
                onClick={regenerateReply}
                className="flex items-center gap-1 text-xs text-deep-blue-40 hover:text-deep-blue-60 transition-colors"
              >
                <RefreshCw size={14} />
                重新生成
              </button>
              <button className="flex items-center gap-1 text-xs text-deep-blue-40 hover:text-deep-blue-60 transition-colors">
                <MoreHorizontal size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex bg-light-sand">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-deep-blue-10 flex flex-col shadow-sm overflow-hidden transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'w-0 border-0' : 'w-72 border-r border-deep-blue-10'
      }`}>
        <div className={`flex flex-col h-full ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
          {/* Workspace Selector */}
          <div className="p-3 border-b border-deep-blue-10">
            <div
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer border transition-all ${
                showWorkspaceDropdown
                  ? 'bg-primary-soft border-primary-soft'
                  : 'bg-light-sand border-transparent hover:border-deep-blue-20 hover:bg-light-sand'
              }`}
              onClick={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}
            >
              <div className="w-7 h-7 bg-gradient-to-br from-siemens-petrol to-brand-petrol rounded flex items-center justify-center text-white text-sm font-semibold">
                {selectedWorkspace.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-deep-blue-80 truncate">{selectedWorkspace.name}</p>
              </div>
              <ChevronDown
                size={14}
                className={`text-deep-blue-40 transition-transform flex-shrink-0 ${
                  showWorkspaceDropdown ? 'rotate-180' : ''
                }`}
              />
            </div>
          </div>

          {/* Workspace Dropdown */}
        {showWorkspaceDropdown && (
          <div className="mt-3 py-2 bg-light-sand rounded-xl border border-deep-blue-10">
            {mockWorkspaces.map((workspace) => (
              <div
                key={workspace.id}
                className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg transition-colors ${
                  selectedWorkspace.id === workspace.id
                    ? 'bg-primary-soft text-brand-petrol'
                    : 'hover:bg-light-sand text-deep-blue-80'
                }`}
                onClick={() => {
                  setSelectedWorkspace(workspace);
                  setShowWorkspaceDropdown(false);
                }}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-medium ${
                    workspace.isPublic
                      ? 'bg-gradient-to-br from-brand-green to-brand-green'
                      : 'bg-gradient-to-br from-siemens-petrol to-brand-petrol'
                  }`}
                >
                  {workspace.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{workspace.name}</p>
                  <p className="text-xs text-deep-blue-60">
                    {workspace.isPublic ? '公开' : '私有'} · {workspace.memberCount} 成员
                  </p>
                </div>
                {selectedWorkspace.id === workspace.id && (
                  <CheckCircle2 size={16} className="text-brand-petrol" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Quick Actions */}
          <div className="p-3">
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={createNewChat}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-siemens-petrol to-brand-petrol text-white rounded-lg font-medium hover:from-siemens-petrol hover:to-brand-petrol transition-all shadow-sm hover:shadow-md text-xs"
              >
                <Plus size={14} />
                新对话
              </button>
            </div>
          </div>

          {/* Recommended Documents Section - Only for SAP Workspace */}
          {selectedWorkspace.id === '2' && (
            <div className="border-t border-deep-blue-10">
              <button
                onClick={toggleRecommendations}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-light-sand transition-colors"
              >
                <div className="flex items-center gap-2">
                  <BookOpen size={14} className="text-brand-green" />
                  <span className="text-xs font-medium text-deep-blue-80">推荐文档</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDocsModal(true);
                    }}
                    className="text-xs text-brand-petrol hover:underline"
                  >
                    查看更多
                  </button>
                  {showRecommendations ? (
                    <ChevronUp size={14} className="text-deep-blue-40" />
                  ) : (
                    <ChevronDown size={14} className="text-deep-blue-40" />
                  )}
                </div>
              </button>

              {showRecommendations && (
                <div className="px-3 pb-2">
                  <div className="space-y-1">
                    {mockRecommendedDocs.slice(0, 3).map((doc) => (
                      <a
                        key={doc.id}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-brand-green/15 transition-colors group"
                      >
                        <FileText size={12} className="text-deep-blue-40 flex-shrink-0" />
                        <p className="text-xs text-deep-blue-80 group-hover:text-brand-green truncate flex-1">
                          {doc.title}
                        </p>
                        <ChevronRight size={12} className="text-deep-blue-20 group-hover:text-soft-green flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Discover Agents Section */}
          <div className="border-t border-deep-blue-10">
            <button
              onClick={toggleAgentPanel}
              className="w-full flex items-center justify-between px-3 py-2 hover:bg-light-sand transition-colors"
            >
              <div className="flex items-center gap-2">
                <Bot size={14} className="text-dark-purple" />
                <span className="text-xs font-medium text-deep-blue-80">发现智能体</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAgentsModal(true);
                  }}
                  className="text-xs text-brand-petrol hover:underline"
                >
                  查看更多
                </button>
                {showAgentPanel ? (
                  <ChevronUp size={14} className="text-deep-blue-40" />
                ) : (
                  <ChevronDown size={14} className="text-deep-blue-40" />
                )}
              </div>
            </button>

            {showAgentPanel && (
              <div className="px-2 pb-2">
                <div className="space-y-1">
                  {mockAgents.map((agent) => (
                    <div
                      key={agent.id}
                      className={`flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-lg transition-all ${
                        selectedAgent?.id === agent.id
                          ? 'bg-soft-purple/20 border border-soft-purple/30'
                          : 'hover:bg-light-sand'
                      }`}
                      onClick={() => setSelectedAgent(selectedAgent?.id === agent.id ? null : agent)}
                    >
                      <div
                        className={`w-6 h-6 rounded flex items-center justify-center ${
                          agent.type === 'askdata'
                            ? 'bg-brand-green/20 text-brand-green'
                            : 'bg-primary-soft text-brand-petrol'
                        }`}
                      >
                        <Bot size={12} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-deep-blue-80 truncate">
                          {agent.name}
                        </p>
                      </div>
                      {selectedAgent?.id === agent.id && (
                        <CheckCircle2 size={12} className="text-dark-purple" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* History Section - Fixed at bottom */}
        <div className="border-t border-deep-blue-10 bg-white" style={{height: '200px'}}>
          <div className="flex items-center justify-between px-3 py-2 border-b border-deep-blue-10">
            <div className="flex items-center gap-2">
              <History size={14} className="text-deep-blue-60" />
              <span className="text-xs font-medium text-deep-blue-80">历史对话</span>
            </div>
          </div>

          <div className="px-2 py-1 overflow-y-auto" style={{height: 'calc(200px - 40px)'}}>
            {mockHistory.map((chat) => (
              <div
                key={chat.id}
                className="flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-lg hover:bg-light-sand transition-colors"
              >
                <MessageCircle size={12} className="text-deep-blue-40 flex-shrink-0" />
                <p className="text-xs text-deep-blue-80 truncate flex-1">
                  {chat.title}
                </p>
                <span className="text-xs text-deep-blue-40 flex-shrink-0">
                  {chat.time}
                </span>
              </div>
            ))}
          </div>
        </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-light-sand">
        {/* Top Bar */}
        <header className="h-12 bg-white border-b border-deep-blue-10 px-5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            {/* Collapse/Expand Sidebar Button */}
            {!sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="w-8 h-8 flex items-center justify-center text-deep-blue-60 hover:bg-light-sand rounded-lg transition-colors"
              >
                <PanelLeftClose size={18} />
              </button>
            )}

            {/* Workspace Info */}
            <div className="flex items-center gap-2">
              {sidebarCollapsed && (
                <button
                  onClick={() => setSidebarCollapsed(false)}
                  className="w-8 h-8 flex items-center justify-center text-deep-blue-60 hover:bg-light-sand rounded-lg transition-colors"
                >
                  <PanelLeftOpen size={18} />
                </button>
              )}
              <div className="w-6 h-6 bg-gradient-to-br from-siemens-petrol to-brand-petrol rounded flex items-center justify-center text-white">
                <Bot size={12} />
              </div>
              <h1 className="text-sm font-medium text-deep-blue-80">{selectedWorkspace.name}</h1>
            </div>
          </div>

          {/* Right Side - Model Selector */}
          <div className="flex items-center gap-2.5">
            {/* Model Selector */}
            <div className="relative">
              <button
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="flex items-center gap-2 px-2.5 py-1.5 bg-light-sand rounded-lg hover:bg-deep-blue-10 transition-colors"
              >
                <Sparkles size={12} className="text-yellow" />
                <span className="text-xs text-deep-blue-80">
                  {selectedModel.name}
                </span>
                <ChevronDown size={12} className="text-deep-blue-40" />
              </button>

              {showModelDropdown && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-deep-blue-10 py-2 z-50">
                  {mockModels.map((model) => (
                    <div
                      key={model.id}
                      className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-light-sand transition-colors ${
                        selectedModel.id === model.id
                          ? 'bg-primary-soft'
                          : ''
                      }`}
                      onClick={() => {
                        setSelectedModel(model);
                        setShowModelDropdown(false);
                      }}
                    >
                      <div className="w-8 h-8 bg-light-sand rounded-lg flex items-center justify-center">
                        <Sparkles size={16} className="text-deep-blue-60" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-deep-blue-80">
                          {model.name}
                        </p>
                        <p className="text-xs text-deep-blue-60">
                          {model.provider} · {model.version}
                        </p>
                      </div>
                      {selectedModel.id === model.id && (
                        <CheckCircle2
                          size={16}
                          className="ml-auto text-brand-petrol"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Agent Badge */}
            {selectedAgent && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-soft-purple/20 rounded-lg border border-soft-purple/30">
                <Bot size={12} className="text-dark-purple" />
                <span className="text-xs text-dark-purple font-medium">
                  {selectedAgent.name}
                </span>
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="text-soft-purple hover:text-dark-purple transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            )}

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2 px-1.5 py-1 hover:bg-light-sand rounded-lg transition-colors"
              >
                <div className="w-7 h-7 bg-light-sand rounded-lg flex items-center justify-center">
                  <User size={14} className="text-deep-blue-60" />
                </div>
                <span className="text-xs text-deep-blue-80">Zhang, San</span>
                <ChevronDown size={12} className="text-deep-blue-40" />
              </button>
              
              {/* Dropdown Menu */}
              {showProfileDropdown && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-deep-blue-10 py-2 z-50">
                  <button
                    onClick={() => {
                      setShowProfileModal(true);
                      setShowProfileDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-light-sand transition-colors text-left"
                  >
                    <User size={16} className="text-deep-blue-60" />
                    <span className="text-sm text-deep-blue-80">个人Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowSettingsModal(true);
                      setShowProfileDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-light-sand transition-colors text-left"
                  >
                    <Settings size={16} className="text-deep-blue-60" />
                    <span className="text-sm text-deep-blue-80">设置</span>
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        goToAdmin();
                        setShowProfileDropdown(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-light-sand transition-colors text-left"
                    >
                      <BarChart3 size={16} className="text-deep-blue-60" />
                      <span className="text-sm text-deep-blue-80">管理中心</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-light-sand transition-colors text-left text-red"
                  >
                    <LogOut size={16} />
                    <span className="text-sm">退出登录</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-light-sand to-white">
          {/* Empty State with FAQs */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <div className="w-14 h-14 bg-gradient-to-br from-siemens-petrol to-brand-petrol rounded-full flex items-center justify-center text-white mb-4 shadow-lg">
                <Sparkles size={24} />
              </div>
              <h2 className="text-lg font-semibold text-deep-blue-80 mb-2">
                {selectedWorkspace.name}
              </h2>
              <p className="text-xs text-deep-blue-60 mb-6 text-center max-w-2xl">
                {selectedWorkspace.description}
              </p>
              
              {/* Recommended Questions - 2 Rows */}
              <div className="w-full max-w-3xl">
                {/* Get current workspace recommended questions */}
                {(() => {
                  const currentQuestions = getWorkspaceRecommendedQuestions(selectedWorkspace?.id || '1');
                  const visibleQuestions = currentQuestions.slice(0, 6);
                  
                  return (
                    <div className="flex flex-col gap-2 items-center">
                      <div className="flex justify-center gap-2 flex-wrap">
                        {visibleQuestions.slice(0, 3).map((question) => (
                          <button
                            key={question.id}
                            onClick={() => setInputValue(question.question)}
                            className="p-2.5 bg-white rounded-lg border border-deep-blue-10 hover:border-soft-purple/50 hover:shadow-sm transition-all text-left group w-fit min-w-[120px]"
                          >
                            <p className="text-sm text-deep-blue-80 group-hover:text-dark-purple whitespace-nowrap">
                              {question.question}
                            </p>
                          </button>
                        ))}
                      </div>
                      {visibleQuestions.length > 3 && (
                        <div className="flex justify-center gap-2 flex-wrap">
                          {visibleQuestions.slice(3, 6).map((question) => (
                            <button
                              key={question.id}
                              onClick={() => setInputValue(question.question)}
                              className="p-2.5 bg-white rounded-lg border border-deep-blue-10 hover:border-soft-purple/50 hover:shadow-sm transition-all text-left group w-fit min-w-[120px]"
                            >
                              <p className="text-sm text-deep-blue-80 group-hover:text-dark-purple whitespace-nowrap">
                                {question.question}
                              </p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
          
          {messages.map((message, index) => renderMessage(message, index))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-siemens-petrol to-dark-purple rounded-full flex items-center justify-center text-white">
                <Sparkles size={18} />
              </div>
              <div className="bg-light-sand rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-deep-blue-40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-deep-blue-40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-deep-blue-40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <footer className="p-4 bg-white border-t border-deep-blue-10">
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-light-sand border border-deep-blue-10 rounded-xl overflow-hidden focus-within:border-brand-petrol focus-within:ring-2 focus-within:ring-primary-soft transition-all">
              {/* Uploaded Files Preview - Compact Tags */}
              {uploadedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 px-3 pt-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-md border border-deep-blue-10 text-xs"
                    >
                      {file.type.includes('image') ? (
                        <Image size={12} className="text-deep-blue-60" />
                      ) : file.type.includes('pdf') ? (
                        <FileText size={12} className="text-red" />
                      ) : (
                        <FolderOpen size={12} className="text-brand-petrol" />
                      )}
                      <span className="text-deep-blue-80 max-w-24 truncate">{file.name}</span>
                      <span className="text-deep-blue-40">{file.size}</span>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-deep-blue-40 hover:text-red transition-colors ml-1"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setUploadedFiles([])}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-deep-blue-40 hover:text-red transition-colors"
                  >
                    <X size={10} />
                    清空
                  </button>
                </div>
              )}
              
              {/* Textarea */}
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="输入您的问题..."
                className="w-full px-4 py-3 pr-28 bg-transparent text-sm resize-none focus:outline-none"
                rows={3}
              />
              
              {/* Bottom Toolbar */}
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-2 bg-light-sand border-t border-deep-blue-10">
                <div className="flex items-center gap-1">
                  {/* Attachment Button */}
                  <label className="w-8 h-8 flex items-center justify-center text-deep-blue-40 hover:text-deep-blue-60 hover:bg-deep-blue-10 rounded-lg transition-colors cursor-pointer">
                    <Plus size={18} />
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                  
                  {/* Web Search Toggle */}
                  <button
                    onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                      webSearchEnabled 
                        ? 'text-brand-petrol bg-primary-soft hover:bg-primary-soft' 
                        : 'text-deep-blue-40 hover:text-deep-blue-60 hover:bg-deep-blue-10'
                    }`}
                    title="联网搜索"
                  >
                    <Cloud size={16} />
                  </button>
                </div>
                
                {/* Send Button */}
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() && uploadedFiles.length === 0}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                    inputValue.trim() || uploadedFiles.length > 0
                      ? 'bg-siemens-petrol text-white hover:bg-siemens-petrol shadow-md'
                      : 'bg-deep-blue-10 text-deep-blue-40 cursor-not-allowed'
                  }`}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
            
            {/* Hint Text */}
            <div className="mt-2 text-xs text-deep-blue-40 text-center">
              Shift + Enter 换行
            </div>
          </div>
        </footer>
      </main>

      {/* User Profile Modal - Enhanced */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowProfileModal(false)}>
          <div
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] shadow-2xl flex flex-col animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-deep-blue-10 bg-gradient-to-r from-primary-soft/50 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-dark-purple to-soft-purple rounded-full flex items-center justify-center text-white font-semibold shadow-soft">
                  {userProfile.avatar}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-deep-blue-80">{userProfile.name}</h3>
                  <p className="text-xs text-deep-blue-40">{userProfile.role}</p>
                </div>
              </div>
              <button onClick={() => setShowProfileModal(false)} className="p-1.5 text-deep-blue-40 hover:text-deep-blue-80 hover:bg-light-sand rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              {/* 位置 - 单选下拉 */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-deep-blue-60">
                  <MapPin size={16} className="text-brand-petrol" />
                  位置
                </label>
                <select
                  value={profileLocation}
                  onChange={e => setProfileLocation(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-deep-blue-20 rounded-lg text-sm text-deep-blue-80 hover:border-deep-blue-40 focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-brand-petrol transition-all appearance-none cursor-pointer"
                >
                  <option value="">请选择城市</option>
                  {LOCATION_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* 专业领域 - 多选下拉 */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-deep-blue-60">
                  <Briefcase size={16} className="text-brand-petrol" />
                  专业领域
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenMultiSelect(openMultiSelect === 'expertise' ? null : 'expertise')}
                    className="w-full px-4 py-2.5 bg-white border border-deep-blue-20 rounded-lg text-left flex items-center justify-between hover:border-deep-blue-40 focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-brand-petrol transition-all"
                  >
                    <span className="text-deep-blue-40 text-sm truncate">
                      {profileExpertise.length > 0 ? `已选择 ${profileExpertise.length} 项` : '请选择专业领域'}
                    </span>
                    <ChevronDown size={16} className={`text-deep-blue-40 transition-transform ${openMultiSelect === 'expertise' ? 'rotate-180' : ''}`} />
                  </button>
                  {openMultiSelect === 'expertise' && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-deep-blue-20 rounded-lg shadow-card overflow-hidden">
                      <div className="max-h-48 overflow-y-auto p-1">
                        {EXPERTISE_OPTIONS.map(option => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setProfileExpertise(prev =>
                                prev.includes(option.value)
                                  ? prev.filter(v => v !== option.value)
                                  : [...prev, option.value]
                              );
                            }}
                            className={`w-full px-3 py-2 text-left text-sm rounded-md flex items-center gap-2 transition-colors ${
                              profileExpertise.includes(option.value)
                                ? 'bg-primary-soft text-brand-petrol font-medium'
                                : 'text-deep-blue-60 hover:bg-light-sand'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                              profileExpertise.includes(option.value)
                                ? 'bg-brand-petrol border-brand-petrol'
                                : 'border-deep-blue-20'
                            }`}>
                              {profileExpertise.includes(option.value) && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </span>
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {profileExpertise.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {profileExpertise.map(value => {
                      const opt = EXPERTISE_OPTIONS.find(o => o.value === value);
                      return (
                        <span key={value} className="inline-flex items-center gap-1 px-2.5 py-1 bg-soft-yellow/40 text-dark-yellow rounded-full text-xs font-medium">
                          {opt?.label || value}
                          <button onClick={() => setProfileExpertise(prev => prev.filter(v => v !== value))} className="hover:opacity-70">
                            <X size={12} />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 兴趣 - 多选下拉 */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-deep-blue-60">
                  <Heart size={16} className="text-brand-petrol" />
                  兴趣
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenMultiSelect(openMultiSelect === 'interests' ? null : 'interests')}
                    className="w-full px-4 py-2.5 bg-white border border-deep-blue-20 rounded-lg text-left flex items-center justify-between hover:border-deep-blue-40 focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-brand-petrol transition-all"
                  >
                    <span className="text-deep-blue-40 text-sm truncate">
                      {profileInterests.length > 0 ? `已选择 ${profileInterests.length} 项` : '请选择兴趣方向'}
                    </span>
                    <ChevronDown size={16} className={`text-deep-blue-40 transition-transform ${openMultiSelect === 'interests' ? 'rotate-180' : ''}`} />
                  </button>
                  {openMultiSelect === 'interests' && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-deep-blue-20 rounded-lg shadow-card overflow-hidden">
                      <div className="max-h-48 overflow-y-auto p-1">
                        {INTEREST_OPTIONS.map(option => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setProfileInterests(prev =>
                                prev.includes(option.value)
                                  ? prev.filter(v => v !== option.value)
                                  : [...prev, option.value]
                              );
                            }}
                            className={`w-full px-3 py-2 text-left text-sm rounded-md flex items-center gap-2 transition-colors ${
                              profileInterests.includes(option.value)
                                ? 'bg-primary-soft text-brand-petrol font-medium'
                                : 'text-deep-blue-60 hover:bg-light-sand'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                              profileInterests.includes(option.value)
                                ? 'bg-brand-petrol border-brand-petrol'
                                : 'border-deep-blue-20'
                            }`}>
                              {profileInterests.includes(option.value) && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </span>
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {profileInterests.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {profileInterests.map(value => {
                      const opt = INTEREST_OPTIONS.find(o => o.value === value);
                      return (
                        <span key={value} className="inline-flex items-center gap-1 px-2.5 py-1 bg-soft-purple/30 text-dark-purple rounded-full text-xs font-medium">
                          {opt?.label || value}
                          <button onClick={() => setProfileInterests(prev => prev.filter(v => v !== value))} className="hover:opacity-70">
                            <X size={12} />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 专业知识 - 多选下拉 */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-deep-blue-60">
                  <BookOpenIcon size={16} className="text-brand-petrol" />
                  专业知识
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenMultiSelect(openMultiSelect === 'knowledge' ? null : 'knowledge')}
                    className="w-full px-4 py-2.5 bg-white border border-deep-blue-20 rounded-lg text-left flex items-center justify-between hover:border-deep-blue-40 focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-brand-petrol transition-all"
                  >
                    <span className="text-deep-blue-40 text-sm truncate">
                      {profileKnowledge.length > 0 ? `已选择 ${profileKnowledge.length} 项` : '请选择专业知识领域'}
                    </span>
                    <ChevronDown size={16} className={`text-deep-blue-40 transition-transform ${openMultiSelect === 'knowledge' ? 'rotate-180' : ''}`} />
                  </button>
                  {openMultiSelect === 'knowledge' && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-deep-blue-20 rounded-lg shadow-card overflow-hidden">
                      <div className="max-h-48 overflow-y-auto p-1">
                        {KNOWLEDGE_OPTIONS.map(option => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setProfileKnowledge(prev =>
                                prev.includes(option.value)
                                  ? prev.filter(v => v !== option.value)
                                  : [...prev, option.value]
                              );
                            }}
                            className={`w-full px-3 py-2 text-left text-sm rounded-md flex items-center gap-2 transition-colors ${
                              profileKnowledge.includes(option.value)
                                ? 'bg-primary-soft text-brand-petrol font-medium'
                                : 'text-deep-blue-60 hover:bg-light-sand'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                              profileKnowledge.includes(option.value)
                                ? 'bg-brand-petrol border-brand-petrol'
                                : 'border-deep-blue-20'
                            }`}>
                              {profileKnowledge.includes(option.value) && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </span>
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {profileKnowledge.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {profileKnowledge.map(value => {
                      const opt = KNOWLEDGE_OPTIONS.find(o => o.value === value);
                      return (
                        <span key={value} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-soft text-brand-petrol rounded-full text-xs font-medium">
                          {opt?.label || value}
                          <button onClick={() => setProfileKnowledge(prev => prev.filter(v => v !== value))} className="hover:opacity-70">
                            <X size={12} />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 电话号码 */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-deep-blue-60">
                  <Phone size={16} className="text-brand-petrol" />
                  电话号码
                </label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={e => setProfilePhone(e.target.value)}
                  placeholder="请输入联系电话"
                  className="w-full px-4 py-2.5 bg-white border border-deep-blue-20 rounded-lg text-sm text-deep-blue-80 placeholder-deep-blue-40 hover:border-deep-blue-40 focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-brand-petrol transition-all"
                />
              </div>

              {/* 对话记忆开关 */}
              <div className="bg-light-sand/50 rounded-lg border border-deep-blue-10 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} className="text-brand-petrol" />
                    <div>
                      <span className="text-sm font-medium text-deep-blue-80">对话记忆</span>
                      <p className="text-xs text-deep-blue-40 mt-0.5">开启后会话将被记录并自动存储，为后续对话提供记忆功能</p>
                    </div>
                  </div>
                  <button
                    role="switch"
                    aria-checked={profileMemoryEnabled}
                    onClick={() => setProfileMemoryEnabled(!profileMemoryEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      profileMemoryEnabled
                        ? 'bg-brand-petrol cursor-pointer shadow-sm'
                        : 'bg-deep-blue-20 cursor-pointer'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                      profileMemoryEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>

              {/* 个人简介 */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-deep-blue-60">
                  <User size={16} className="text-brand-petrol" />
                  个人简介
                </label>
                <textarea
                  value={profileBio}
                  onChange={e => setProfileBio(e.target.value)}
                  placeholder="请输入个人简介，帮助AI更好地了解您的背景和需求，提供更贴合的个性化回答..."
                  rows={4}
                  className="w-full px-4 py-2.5 bg-white border border-deep-blue-20 rounded-lg text-sm text-deep-blue-80 placeholder-deep-blue-40 hover:border-deep-blue-40 focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-brand-petrol transition-all resize-none"
                />
                <p className="text-xs text-deep-blue-40 text-right">{profileBio.length}/500</p>
              </div>

              {/* AI 记忆管理区域 */}
              <div className="border-t border-deep-blue-10 pt-5 mt-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Brain size={16} className="text-brand-petrol" />
                    <h4 className="text-sm font-semibold text-deep-blue-80">AI 记忆管理</h4>
                    <span className="text-xs text-deep-blue-40">({aiMemories.length} 条)</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsMemoriesLoading(true);
                      setTimeout(() => {
                        setAiMemories([...mockMemories]);
                        setIsMemoriesLoading(false);
                      }, 1000);
                    }}
                    disabled={isMemoriesLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-brand-petrol hover:bg-primary-soft rounded-lg transition-colors disabled:opacity-50"
                  >
                    <RefreshCw size={12} className={isMemoriesLoading ? 'animate-spin' : ''} />
                    刷新
                  </button>
                </div>

                {isMemoriesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex items-center gap-2 text-deep-blue-40">
                      <RefreshCw size={16} className="animate-spin" />
                      <span className="text-sm">正在同步记忆数据...</span>
                    </div>
                  </div>
                ) : aiMemories.length === 0 ? (
                  <div className="text-center py-8">
                    <Brain size={24} className="text-deep-blue-20 mx-auto mb-2" />
                    <p className="text-sm text-deep-blue-40">暂无AI记忆数据</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {aiMemories.map(memory => (
                      <div
                        key={memory.id}
                        className="group p-3 bg-light-sand/50 rounded-lg border border-deep-blue-10 hover:border-deep-blue-20 transition-all"
                      >
                        {editingMemoryId === memory.id ? (
                          /* 编辑模式 */
                          <div className="space-y-2">
                            <textarea
                              value={editingMemoryContent}
                              onChange={e => setEditingMemoryContent(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-brand-petrol rounded-lg text-sm text-deep-blue-80 focus:outline-none focus:ring-2 focus:ring-brand-petrol resize-none"
                              rows={3}
                              autoFocus
                            />
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setEditingMemoryId(null)}
                                className="px-3 py-1 text-xs text-deep-blue-60 hover:bg-light-sand rounded-md transition-colors"
                              >
                                取消
                              </button>
                              <button
                                onClick={() => {
                                  setAiMemories(prev =>
                                    prev.map(m =>
                                      m.id === editingMemoryId
                                        ? { ...m, content: editingMemoryContent }
                                        : m
                                    )
                                  );
                                  setEditingMemoryId(null);
                                }}
                                className="flex items-center gap-1 px-3 py-1 text-xs bg-brand-petrol text-white rounded-md hover:bg-brand-petrol-dark transition-colors"
                              >
                                <Check size={12} />
                                保存
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* 展示模式 */
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm text-deep-blue-80 leading-relaxed flex-1">
                                {memory.content}
                              </p>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                <button
                                  onClick={() => {
                                    setEditingMemoryId(memory.id);
                                    setEditingMemoryContent(memory.content);
                                  }}
                                  className="p-1 text-deep-blue-40 hover:text-brand-petrol hover:bg-primary-soft rounded transition-colors"
                                  title="编辑"
                                >
                                  <Pencil size={13} />
                                </button>
                                <button
                                  onClick={() => {
                                    setAiMemories(prev => prev.filter(m => m.id !== memory.id));
                                  }}
                                  className="p-1 text-deep-blue-40 hover:text-red hover:bg-red-light rounded transition-colors"
                                  title="删除"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="inline-flex items-center px-2 py-0.5 bg-primary-soft text-brand-petrol rounded text-xs font-medium">
                                {memory.category}
                              </span>
                              <span className="text-xs text-deep-blue-40">
                                {memory.createdAt}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-deep-blue-10 bg-light-sand/30">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 text-sm text-deep-blue-60 hover:bg-light-sand rounded-lg border border-deep-blue-10 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setUserProfile({ ...userProfile, description: profileBio });
                  setShowProfileModal(false);
                }}
                className="px-5 py-2 text-sm font-medium text-white bg-brand-petrol hover:bg-brand-petrol-dark rounded-lg transition-colors shadow-soft"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Documents List Modal */}
      {showDocsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDocsModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[80vh] shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-deep-blue-10">
              <h3 className="text-lg font-semibold text-deep-blue-80">推荐文档</h3>
              <button onClick={() => setShowDocsModal(false)} className="text-deep-blue-40 hover:text-deep-blue-60">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mockRecommendedDocs.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-4 bg-light-sand rounded-xl hover:bg-brand-green/15 transition-colors group"
                  >
                    <FileText size={20} className="text-deep-blue-40 group-hover:text-brand-green" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-deep-blue-80 group-hover:text-brand-green">
                        {doc.title}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-brand-green/20 text-brand-green rounded">
                          {doc.category}
                        </span>
                        <span className="text-xs text-deep-blue-40">{doc.updatedAt}</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-deep-blue-20 group-hover:text-soft-green" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Agents List Modal */}
      {showAgentsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAgentsModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[80vh] shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-deep-blue-10">
              <h3 className="text-lg font-semibold text-deep-blue-80">发现智能体</h3>
              <button onClick={() => setShowAgentsModal(false)} className="text-deep-blue-40 hover:text-deep-blue-60">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mockAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className={`flex items-start gap-3 p-4 rounded-xl transition-colors cursor-pointer group ${
                      selectedAgent?.id === agent.id
                        ? 'bg-soft-purple/20 border border-soft-purple/30'
                        : 'bg-light-sand hover:bg-soft-purple/20'
                    }`}
                    onClick={() => {
                      setSelectedAgent(selectedAgent?.id === agent.id ? null : agent);
                      setShowAgentsModal(false);
                    }}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        agent.type === 'askdata'
                          ? 'bg-brand-green/20 text-brand-green'
                          : 'bg-primary-soft text-brand-petrol'
                      }`}
                    >
                      <Bot size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-deep-blue-80 group-hover:text-dark-purple">
                          {agent.name}
                        </p>
                        {selectedAgent?.id === agent.id && (
                          <CheckCircle2 size={14} className="text-dark-purple" />
                        )}
                      </div>
                      <p className="text-xs text-deep-blue-60 mt-1">
                        {agent.description}
                      </p>
                      <span className={`inline-block text-xs px-2 py-0.5 mt-2 rounded ${
                        agent.type === 'askdata'
                          ? 'bg-brand-green/20 text-brand-green'
                          : 'bg-primary-soft text-brand-petrol'
                      }`}>
                        {agent.type === 'askdata' ? 'AskData Agent' : 'Agent'}
                      </span>
                    </div>
                    <ChevronRight size={16} className="text-deep-blue-20 group-hover:text-soft-purple" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowSettingsModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-deep-blue-10">
              <h3 className="text-lg font-semibold text-deep-blue-80">设置</h3>
              <button onClick={() => setShowSettingsModal(false)} className="text-deep-blue-40 hover:text-deep-blue-60">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* 默认大语言模型 */}
              <div>
                <label className="block text-sm font-medium text-deep-blue-80 mb-2">默认大语言模型</label>
                <div className="relative">
                  <select
                    value={settingsDefaultModel.id}
                    onChange={(e) => {
                      const model = mockModels.find(m => m.id === e.target.value);
                      if (model) setSettingsDefaultModel(model);
                    }}
                    className="w-full px-3 py-2.5 bg-light-sand border border-deep-blue-10 rounded-lg text-sm text-deep-blue-80 focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent appearance-none cursor-pointer"
                  >
                    {mockModels.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name} - {model.provider} ({model.version})
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-deep-blue-40 pointer-events-none" />
                </div>
              </div>

              {/* 语言选择 */}
              <div>
                <label className="block text-sm font-medium text-deep-blue-80 mb-2">语言选择</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSettingsLanguage('zh')}
                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      settingsLanguage === 'zh'
                        ? 'bg-siemens-petrol text-white shadow-md'
                        : 'bg-light-sand text-deep-blue-80 hover:bg-light-sand border border-deep-blue-10'
                    }`}
                  >
                    中文
                  </button>
                  <button
                    onClick={() => setSettingsLanguage('en')}
                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      settingsLanguage === 'en'
                        ? 'bg-siemens-petrol text-white shadow-md'
                        : 'bg-light-sand text-deep-blue-80 hover:bg-light-sand border border-deep-blue-10'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              {/* 法律文档 */}
              <div className="space-y-3 pt-4 border-t border-deep-blue-10">
                <a
                  href="/terms-of-service"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-light-sand rounded-lg hover:bg-light-sand transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-deep-blue-60" />
                    <span className="text-sm text-deep-blue-80">使用条款</span>
                  </div>
                  <ExternalLink size={16} className="text-deep-blue-40 group-hover:text-brand-petrol" />
                </a>
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-light-sand rounded-lg hover:bg-light-sand transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Shield size={18} className="text-deep-blue-60" />
                    <span className="text-sm text-deep-blue-80">数据隐私协议</span>
                  </div>
                  <ExternalLink size={16} className="text-deep-blue-40 group-hover:text-brand-petrol" />
                </a>
              </div>
            </div>
            <div className="flex gap-3 p-4 border-t border-deep-blue-10">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="flex-1 px-4 py-2.5 bg-light-sand text-deep-blue-80 rounded-lg text-sm font-medium hover:bg-deep-blue-10 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  // 保存设置逻辑
                  setSelectedModel(settingsDefaultModel);
                  setShowSettingsModal(false);
                }}
                className="flex-1 px-4 py-2.5 bg-siemens-petrol text-white rounded-lg text-sm font-medium hover:bg-siemens-petrol transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
