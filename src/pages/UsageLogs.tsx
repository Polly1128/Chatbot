import { useState } from 'react';
import { FileText, Calendar, Filter, Search, Copy, X, ChevronDown, ChevronUp, Brain, Globe, Database, Bot, DollarSign, MessageSquare, CheckCircle, XCircle, Clock, BarChart3, ExternalLink } from 'lucide-react';

export interface LogEntry {
  id: string;
  chatId: string;
  timestamp: string;
  user: {
    name: string;
    email: string;
    department: string;
  };
  channel: 'web' | 'api';
  model: string;
  webSearchEnabled: boolean;
  question: string;
  answer: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  relatedData: {
    knowledgeBase?: string;
    agent?: string;
    askDataTriggered: boolean;
    askDataTables?: number;
  };
}

// Mock data
const initialLogs: LogEntry[] = [
  {
    id: 'log-1',
    chatId: 'chat_8f7a6b5c4d3e2f1a',
    timestamp: '2024-01-31 14:23:45',
    user: {
      name: '张三',
      email: 'zhangsan@company.com',
      department: '销售部 / Sales.DE',
    },
    channel: 'web',
    model: 'DeepSeek R1',
    webSearchEnabled: true,
    question: '如何查看华东区2023年第四季度的销售业绩汇总？',
    answer: '根据您的请求，华东区2023年Q4销售业绩汇总如下：\n\n| 指标 | 数值 |\n|------|------|\n| 总收入 | ¥3,250万 |\n| 目标完成率 | 108% |\n| 新增客户 | 156家 |\n\n数据来源: 销售数据库 / 季度报表',
    inputTokens: 1250,
    outputTokens: 890,
    cost: 0.045,
    relatedData: {
      knowledgeBase: '销售知识库 v2.1 » sales_manual_2024.pdf',
      agent: '销售报表助手',
      askDataTriggered: true,
      askDataTables: 3,
    },
  },
  {
    id: 'log-2',
    chatId: 'chat_7e6d5c4b3a2f1e9d',
    timestamp: '2024-01-31 14:20:12',
    user: {
      name: '李四',
      email: 'lisi@company.com',
      department: '市场部 / Marketing.MK',
    },
    channel: 'web',
    model: 'GPT-4o',
    webSearchEnabled: false,
    question: '竞品分析报告在哪里可以找到？',
    answer: '竞品分析报告可以在以下位置找到：\n\n1. 知识库 » 市场分析 » 2024竞品分析.pdf\n2. 数据产品 » 市场洞察 » 竞品数据\n\n建议优先查看知识库中的报告，包含最新的市场动态和竞争分析。',
    inputTokens: 890,
    outputTokens: 650,
    cost: 0.032,
    relatedData: {
      knowledgeBase: '市场知识库 v1.5 » 2024竞品分析.pdf',
      askDataTriggered: false,
    },
  },
  {
    id: 'log-3',
    chatId: 'chat_6c5b4a3d2e1f0c9b',
    timestamp: '2024-01-31 13:55:30',
    user: {
      name: '王五',
      email: 'wangwu@company.com',
      department: '销售部 / Sales.DE',
    },
    channel: 'api',
    model: 'DeepSeek R1',
    webSearchEnabled: true,
    question: '客户续费率是多少？',
    answer: '根据最新数据统计：\n\n- 整体客户续费率: 85%\n- 企业客户续费率: 92%\n- 个人客户续费率: 78%\n\n续费率较去年同期提升了5个百分点，主要得益于产品功能的持续优化和客户服务的改进。',
    inputTokens: 560,
    outputTokens: 420,
    cost: 0.018,
    relatedData: {
      agent: '客户查询助手',
      askDataTriggered: true,
      askDataTables: 2,
    },
  },
  {
    id: 'log-4',
    chatId: 'chat_5b4a3c2d1e0f9a8b',
    timestamp: '2024-01-31 11:30:45',
    user: {
      name: '赵六',
      email: 'zhaoliu@company.com',
      department: '技术部 / Tech.TD',
    },
    channel: 'web',
    model: 'Claude 3.5',
    webSearchEnabled: false,
    question: '如何配置新的数据源连接？',
    answer: '配置数据源连接的步骤如下：\n\n1. 进入「智能体集成」→「AskData配置」\n2. 在「数据源配置」部分选择数据源类型（Snowflake/PostgreSQL）\n3. 填写连接信息\n4. 点击「测试连接」验证配置\n5. 保存配置\n\n详细配置说明请参考文档：AskData配置指南.pdf',
    inputTokens: 780,
    outputTokens: 920,
    cost: 0.041,
    relatedData: {
      knowledgeBase: '技术文档 v3.0 » AskData配置指南.pdf',
      askDataTriggered: false,
    },
  },
  {
    id: 'log-5',
    chatId: 'chat_4a3b2c1d0e9f8a7b',
    timestamp: '2024-01-31 10:15:20',
    user: {
      name: '钱七',
      email: 'qianqi@company.com',
      department: '财务部 / Finance.FD',
    },
    channel: 'api',
    model: 'GPT-4o',
    webSearchEnabled: true,
    question: '本月的预算执行情况如何？',
    answer: '本月预算执行情况：\n\n| 部门 | 预算 | 实际 | 执行率 |\n|------|------|------|--------|\n| 销售部 | ¥500万 | ¥520万 | 104% |\n| 市场部 | ¥300万 | ¥280万 | 93% |\n| 技术部 | ¥400万 | ¥410万 | 102.5% |\n\n整体预算执行率: 99.8%\n\n注：销售部超支主要由于Q4营销活动增加。',
    inputTokens: 1100,
    outputTokens: 780,
    cost: 0.038,
    relatedData: {
      agent: '财务分析助手',
      askDataTriggered: true,
      askDataTables: 4,
    },
  },
];

export default function UsageLogs() {
  const [logs] = useState<LogEntry[]>(initialLogs);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [dateRange, setDateRange] = useState({ start: '2024-01-01', end: '2024-01-31' });
  const [webSearchFilter, setWebSearchFilter] = useState<'all' | 'enabled' | 'disabled'>('all');
  const [costRange, setCostRange] = useState({ min: '', max: '' });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchUser, setSearchUser] = useState('');

  // Calculate statistics
  const stats = {
    totalQuestions: logs.length,
    totalInputTokens: logs.reduce((sum, log) => sum + log.inputTokens, 0),
    totalOutputTokens: logs.reduce((sum, log) => sum + log.outputTokens, 0),
    totalCost: logs.reduce((sum, log) => sum + log.cost, 0),
    mostUsedModel: 'DeepSeek R1',
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedIds.length === logs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(logs.map(log => log.id));
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

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('已复制到剪贴板');
  };

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  // Format cost
  const formatCost = (cost: number) => {
    return `¥${cost.toFixed(3)}`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-petrol-soft rounded-xl flex items-center justify-center shadow-soft">
              <FileText size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-deep-blue-80 tracking-tight">使用日志</h1>
              <p className="text-sm text-deep-blue-40">管理和查看用户交互记录</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-deep-blue-10 text-deep-blue-80 rounded-lg hover:bg-light-sand transition-all shadow-soft font-medium"
            >
              <Filter size={18} />
              筛选
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-petrol text-white rounded-lg hover:bg-brand-petrol active:bg-brand-petrol-dark transition-all shadow-soft font-medium">
              <FileText size={18} />
              导出
            </button>
          </div>
        </div>

        {/* PowerBI Analytics Banner */}
        <div className="bg-gradient-to-r from-primary-soft via-light-sand to-brand-green/15 rounded-xl border border-primary-soft shadow-soft p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-lg shadow-soft flex items-center justify-center shrink-0">
              <BarChart3 className="text-brand-petrol" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-deep-blue-80 mb-1">使用数据分析报告</h3>
              <p className="text-sm text-deep-blue-60 whitespace-nowrap">
                使用统计、性能指标和分析数据已整合至 PowerBI，请点击右侧按钮前往查看详细分析报告
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href="https://app.powerbi.com/groups/me/workspaces"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-petrol text-white rounded-lg text-sm font-medium hover:bg-brand-petrol-dark active:bg-brand-petrol-dark transition-colors shadow-soft"
              >
                <ExternalLink size={14} />
                打开 PowerBI Workspace
              </a>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white text-deep-blue-80 rounded-lg text-sm font-medium border border-deep-blue-20">
                <FileText size={14} />
                下方为原始日志
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-deep-blue-10 shadow-soft p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-semibold text-deep-blue-80 mb-2 flex items-center gap-2">
                <Calendar size={16} className="text-deep-blue-40" />
                日期范围
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="flex-1 px-3 py-2.5 border border-deep-blue-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent transition-all"
                />
                <span className="text-deep-blue-40">-</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="flex-1 px-3 py-2.5 border border-deep-blue-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Channel Filter */}
            <div>
              <label className="block text-sm font-semibold text-deep-blue-80 mb-2">渠道</label>
              <select className="w-full px-3 py-2.5 border border-deep-blue-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent transition-all bg-white">
                <option value="all">全部</option>
                <option value="web">小禹前端网页</option>
                <option value="api">API 调用</option>
              </select>
            </div>

            {/* Model Filter */}
            <div>
              <label className="block text-sm font-semibold text-deep-blue-80 mb-2 flex items-center gap-2">
                <Brain size={16} className="text-deep-blue-40" />
                大语言模型
              </label>
              <select className="w-full px-3 py-2.5 border border-deep-blue-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent transition-all bg-white">
                <option value="all">全部</option>
                <option value="deepseek">DeepSeek R1</option>
                <option value="gpt4o">GPT-4o</option>
                <option value="claude">Claude 3.5</option>
              </select>
            </div>

            {/* Department Filter */}
            <div>
              <label className="block text-sm font-semibold text-deep-blue-80 mb-2">部门</label>
              <select className="w-full px-3 py-2.5 border border-deep-blue-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent transition-all bg-white">
                <option value="all">全部</option>
                <option value="sales">销售部</option>
                <option value="marketing">市场部</option>
                <option value="tech">技术部</option>
                <option value="finance">财务部</option>
              </select>
            </div>

            {/* Web Search Filter */}
            <div>
              <label className="block text-sm font-semibold text-deep-blue-80 mb-2 flex items-center gap-2">
                <Globe size={16} className="text-deep-blue-40" />
                Web Search
              </label>
              <div className="flex gap-2">
                {(['all', 'enabled', 'disabled'] as const).map((option) => (
                  <label
                    key={option}
                    className={`flex-1 px-3 py-2.5 border-2 rounded-lg cursor-pointer text-center text-sm font-medium transition-all ${
                      webSearchFilter === option
                        ? 'bg-primary-soft border-brand-petrol text-brand-petrol-dark'
                        : 'border-deep-blue-10 text-deep-blue-60 hover:bg-light-sand'
                    }`}
                  >
                    <input
                      type="radio"
                      name="webSearch"
                      checked={webSearchFilter === option}
                      onChange={() => setWebSearchFilter(option)}
                      className="sr-only"
                    />
                    {option === 'all' ? '全部' : option === 'enabled' ? '开启' : '关闭'}
                  </label>
                ))}
              </div>
            </div>

            {/* Cost Range */}
            <div>
              <label className="block text-sm font-semibold text-deep-blue-80 mb-2 flex items-center gap-2">
                <DollarSign size={16} className="text-deep-blue-40" />
                费用范围
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="Min"
                  value={costRange.min}
                  onChange={(e) => setCostRange({ ...costRange, min: e.target.value })}
                  className="flex-1 px-3 py-2.5 border border-deep-blue-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent transition-all"
                />
                <span className="text-deep-blue-40">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={costRange.max}
                  onChange={(e) => setCostRange({ ...costRange, max: e.target.value })}
                  className="flex-1 px-3 py-2.5 border border-deep-blue-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Search by Keyword */}
            <div>
              <label className="block text-sm font-semibold text-deep-blue-80 mb-2 flex items-center gap-2">
                <Search size={16} className="text-deep-blue-40" />
                问题关键词
              </label>
              <input
                type="text"
                placeholder="搜索问题内容..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full px-3 py-2.5 border border-deep-blue-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent transition-all"
              />
            </div>

            {/* Search by User */}
            <div>
              <label className="block text-sm font-semibold text-deep-blue-80 mb-2">用户</label>
              <input
                type="text"
                placeholder="按用户名或邮箱搜索..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="w-full px-3 py-2.5 border border-deep-blue-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowFilters(false)}
              className="px-4 py-2.5 text-deep-blue-60 font-medium rounded-lg hover:bg-light-sand transition-colors"
            >
              关闭
            </button>
            <button className="px-4 py-2.5 bg-brand-petrol text-white font-medium rounded-lg hover:bg-brand-petrol active:bg-brand-petrol-dark transition-all shadow-soft">
              应用筛选
            </button>
          </div>
        </div>
      )}

      {/* Logs List */}
      <div className="bg-white rounded-xl border border-deep-blue-10 shadow-soft overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-deep-blue-10 bg-light-sand/50">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-deep-blue-40" />
            <input
              type="text"
              placeholder="搜索: 问题内容..."
              className="w-full pl-10 pr-4 py-2.5 border border-deep-blue-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent transition-all bg-white"
            />
          </div>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead className="bg-light-sand border-b border-deep-blue-10">
            <tr>
              <th className="px-6 py-4 w-12">
                <button
                  onClick={toggleSelectAll}
                  className="p-1 hover:bg-deep-blue-10 rounded transition-colors"
                >
                  {selectedIds.length === logs.length ? (
                    <CheckCircle size={18} className="text-brand-petrol" />
                  ) : (
                    <XCircle size={18} className="text-deep-blue-40" />
                  )}
                </button>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-deep-blue-40 uppercase tracking-wider">时间</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-deep-blue-40 uppercase tracking-wider">用户</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-deep-blue-40 uppercase tracking-wider">部门</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-deep-blue-40 uppercase tracking-wider">问题摘要</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-deep-blue-10">
            {logs.map((log) => (
              <>
                <tr
                  key={log.id}
                  className="hover:bg-light-sand/70 transition-colors cursor-pointer"
                  onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                >
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => toggleSelect(log.id)}
                      className="p-1 hover:bg-deep-blue-10 rounded transition-colors"
                    >
                      {selectedIds.includes(log.id) ? (
                        <CheckCircle size={18} className="text-brand-petrol" />
                      ) : (
                        <XCircle size={18} className="text-deep-blue-40" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-deep-blue-60">
                      <Clock size={14} className="text-deep-blue-40" />
                      {log.timestamp}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-deep-blue-80">{log.user.name}</div>
                    <div className="text-xs text-deep-blue-40">{log.user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-deep-blue-60">{log.user.department}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-deep-blue-80 truncate max-w-md">
                        {log.question}
                      </span>
                      {expandedId === log.id ? (
                        <ChevronUp size={16} className="text-deep-blue-40 flex-shrink-0" />
                      ) : (
                        <ChevronDown size={16} className="text-deep-blue-40 flex-shrink-0" />
                      )}
                    </div>
                  </td>
                </tr>

                {/* Expanded Details */}
                {expandedId === log.id && (
                  <tr key={`${log.id}-details`}>
                    <td colSpan={5} className="px-6 py-4 bg-light-sand/50">
                      <div className="bg-white rounded-xl border border-deep-blue-10 shadow-soft p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-lg font-bold text-deep-blue-80 flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary-soft rounded-lg flex items-center justify-center">
                              <MessageSquare size={18} className="text-brand-petrol" />
                            </div>
                            对话详情
                          </h3>
                          <button
                            onClick={() => setExpandedId(null)}
                            className="p-2 hover:bg-light-sand rounded-lg transition-colors text-deep-blue-40"
                          >
                            <X size={20} />
                          </button>
                        </div>

                        {/* Basic Information */}
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-deep-blue-80 mb-3">基本信息</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-deep-blue-40 w-24">Chat ID:</span>
                              <code className="bg-light-sand px-2 py-1 rounded text-xs font-mono text-deep-blue-80">
                                {log.chatId}
                              </code>
                              <button
                                onClick={() => copyToClipboard(log.chatId)}
                                className="text-brand-petrol hover:text-brand-petrol transition-colors"
                              >
                                <Copy size={14} />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-deep-blue-40 w-24">提问时间:</span>
                              <span className="text-deep-blue-80">{log.timestamp}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-deep-blue-40 w-24">用户:</span>
                              <span className="text-deep-blue-80">
                                {log.user.name} ({log.user.email})
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-deep-blue-40 w-24">部门:</span>
                              <span className="text-deep-blue-80">{log.user.department}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-deep-blue-40 w-24">渠道:</span>
                              <span className="text-deep-blue-80 flex items-center gap-1">
                                {log.channel === 'web' ? (
                                  <>
                                    <Globe size={14} />
                                    小禹前端网页
                                  </>
                                ) : (
                                  <>
                                    <Database size={14} />
                                    API 调用
                                  </>
                                )}
                              </span>
                              <span className="bg-primary-soft text-brand-petrol-dark px-2 py-0.5 rounded text-xs font-medium">
                                {log.channel === 'web' ? '前端' : 'API'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-deep-blue-40 w-24">大语言模型:</span>
                              <span className="text-deep-blue-80 flex items-center gap-1">
                                <Brain size={14} />
                                {log.model}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-deep-blue-40 w-24">Web Search:</span>
                              <span className="text-deep-blue-80 flex items-center gap-1">
                                {log.webSearchEnabled ? (
                                  <>
                                    <CheckCircle size={14} className="text-green" />
                                    已开启
                                  </>
                                ) : (
                                  <>
                                    <XCircle size={14} className="text-deep-blue-40" />
                                    已关闭
                                  </>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Question */}
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-deep-blue-80 mb-3 flex items-center gap-2">
                            <MessageSquare size={16} className="text-deep-blue-40" />
                            提问内容
                          </h4>
                          <div className="bg-light-sand rounded-xl p-4 border border-deep-blue-10">
                            <p className="text-deep-blue-80 whitespace-pre-wrap">{log.question}</p>
                          </div>
                        </div>

                        {/* Answer */}
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-deep-blue-80 mb-3 flex items-center gap-2">
                            <Bot size={16} className="text-deep-blue-40" />
                            回答内容
                          </h4>
                          <div className="bg-light-sand rounded-xl p-4 border border-deep-blue-10">
                            <p className="text-deep-blue-80 whitespace-pre-wrap">{log.answer}</p>
                          </div>
                        </div>

                        {/* Resource Consumption */}
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-deep-blue-80 mb-3 flex items-center gap-2">
                            <BarChart3 size={16} className="text-deep-blue-40" />
                            资源消耗
                          </h4>
                          <div className="bg-light-sand rounded-xl p-5 border border-deep-blue-10">
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <div className="text-xs text-deep-blue-40 mb-1">Input Tokens</div>
                                <div className="text-xl font-bold text-deep-blue-80">
                                  {formatNumber(log.inputTokens)}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-deep-blue-40 mb-1">Output Tokens</div>
                                <div className="text-xl font-bold text-deep-blue-80">
                                  {formatNumber(log.outputTokens)}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-deep-blue-40 mb-1">费用</div>
                                <div className="text-xl font-bold text-deep-blue-80">
                                  {formatCost(log.cost)}
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-deep-blue-10">
                              <div className="text-sm text-deep-blue-60 flex items-center gap-2">
                                <DollarSign size={14} className="text-deep-blue-40" />
                                本月累计费用: <span className="font-semibold text-deep-blue-80">{formatCost(stats.totalCost)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Related Data */}
                        <div>
                          <h4 className="text-sm font-semibold text-deep-blue-80 mb-3 flex items-center gap-2">
                            <Database size={16} className="text-deep-blue-40" />
                            关联数据
                          </h4>
                          <div className="space-y-2 text-sm">
                            {log.relatedData.knowledgeBase && (
                              <div className="flex items-center gap-2 text-deep-blue-80">
                                <span className="text-deep-blue-40 w-24">来源知识库:</span>
                                <span>{log.relatedData.knowledgeBase}</span>
                              </div>
                            )}
                            {log.relatedData.agent && (
                              <div className="flex items-center gap-2 text-deep-blue-80">
                                <span className="text-deep-blue-40 w-24">Agent:</span>
                                <span className="flex items-center gap-1">
                                  <Bot size={14} className="text-deep-blue-40" />
                                  {log.relatedData.agent}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-deep-blue-80">
                              <span className="text-deep-blue-40 w-24">AskData:</span>
                              <span className="flex items-center gap-1">
                                {log.relatedData.askDataTriggered ? (
                                  <>
                                    <CheckCircle size={14} className="text-green" />
                                    已触发
                                  </>
                                ) : (
                                  <>
                                    <XCircle size={14} className="text-deep-blue-40" />
                                    未触发
                                  </>
                                )}
                                {log.relatedData.askDataTriggered && log.relatedData.askDataTables && (
                                  <span className="text-deep-blue-40">
                                    (查询了 {log.relatedData.askDataTables} 张表)
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-deep-blue-10 flex items-center justify-between bg-light-sand/50">
          <div className="text-sm text-deep-blue-60">
            共 {logs.length} 条记录
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-deep-blue-10 rounded hover:bg-light-sand disabled:opacity-50 disabled:cursor-not-allowed transition-all" disabled>
              &lt;
            </button>
            <button className="px-3 py-1.5 bg-brand-petrol text-white rounded shadow-soft">1</button>
            <button className="px-3 py-1.5 border border-deep-blue-10 rounded hover:bg-light-sand transition-all">2</button>
            <button className="px-3 py-1.5 border border-deep-blue-10 rounded hover:bg-light-sand transition-all">3</button>
            <span className="text-deep-blue-40">...</span>
            <button className="px-3 py-1.5 border border-deep-blue-10 rounded hover:bg-light-sand transition-all">50</button>
            <button className="px-3 py-1.5 border border-deep-blue-10 rounded hover:bg-light-sand transition-all">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}