import { useState, useMemo } from 'react';
import { Bot, Plus, Edit2, Trash2, Check, X, Database, Globe, Settings, Search, ChevronDown } from 'lucide-react';
import Toggle from '../components/Toggle';
import JSONEditor from '../components/JSONEditor';
import AccordionItem from '../components/AccordionItem';

// ============================================
// 类型定义
// ============================================

export type AgentType = 'custom' | 'askdata';

// 通用Agent属性
interface AgentBase {
  id: string;
  name: string;
  description: string;
  agentType: AgentType;
  status: 'online' | 'offline';
  defaultSelected: boolean;
  updatedAt: string;
}

// 自定义Agent
export interface CustomAgent extends AgentBase {
  agentType: 'custom';
  url: string;
  endpoint: string;
  authType: 'apiKey' | 'oauth';
  apiKey?: string;
  oauthConfig?: {
    clientId: string;
    clientSecret: string;
  };
  streaming: boolean;
  body: string;
}

// AskData Agent
export interface AskDataAgent extends AgentBase {
  agentType: 'askdata';
  enabled: boolean;
  // 数据源配置
  dataSourceType: 'snowflake' | 'postgresql';
  snowflakeConfig: {
    account: string;
    warehouse: string;
    database: string;
    schema: string;
    user: string;
    password: string;
  };
  postgresqlConfig: {
    host: string;
    port: string;
    database: string;
    schema: string;
    user: string;
    password: string;
  };
  // 业务语义配置
  useCase: string;
  abbreviations: string;
  fieldValues: string;
  formulas: string;
  businessLogic: string;
  answerRequirements: string;
  // 高级配置
  verifiedSqlFileName: string;
  chainOfThought: string;
}

export type Agent = CustomAgent | AskDataAgent;

// ============================================
// Mock 数据
// ============================================

const initialAgents: Agent[] = [
  {
    id: 'agent-1',
    name: '销售报表助手',
    description: '这是一个可以帮助查询销售数据的Agent，支持多种报表格式导出',
    agentType: 'custom',
    url: 'https://agent.company.com/sales',
    endpoint: '/api/v1/query',
    authType: 'apiKey',
    apiKey: 'sk-xxxxxxxxxxxxxxxx',
    streaming: true,
    defaultSelected: true,
    body: JSON.stringify({ temperature: 0.7, max_tokens: 2000 }, null, 2),
    status: 'online',
    updatedAt: '2024-01-15 14:30',
  },
  {
    id: 'agent-2',
    name: '客户查询Agent',
    description: '用于查询客户信息和历史记录',
    agentType: 'custom',
    url: 'https://agent.company.com/customer',
    endpoint: '/api/v1/search',
    authType: 'oauth',
    oauthConfig: {
      clientId: 'client-123',
      clientSecret: 'secret-456',
    },
    streaming: false,
    defaultSelected: false,
    body: JSON.stringify({ temperature: 0.5, max_tokens: 1000 }, null, 2),
    status: 'offline',
    updatedAt: '2024-01-14 09:15',
  },
  {
    id: 'agent-3',
    name: '销售数据分析助手',
    description: '帮助用户查询销售相关数据，支持多维度分析和可视化展示',
    agentType: 'askdata',
    enabled: true,
    defaultSelected: false,
    status: 'online',
    updatedAt: '2024-01-16 10:20',
    dataSourceType: 'snowflake',
    snowflakeConfig: {
      account: 'xy12345.us-east-1',
      warehouse: 'COMPUTE_WH',
      database: 'SALES_DB',
      schema: 'ANALYTICS',
      user: 'admin',
      password: '',
    },
    postgresqlConfig: {
      host: 'localhost',
      port: '5432',
      database: 'sales',
      schema: 'public',
      user: 'postgres',
      password: '',
    },
    useCase: '用于查询销售业绩、客户数据、市场分析等',
    abbreviations: 'FY: 财年，KPI: 关键绩效指标，ARE: 管控区域',
    fieldValues: 'status=1 表示已成交，2 表示跟进中，3 表示失败',
    formulas: '毛利率 = (收入 - 成本) / 收入 × 100%',
    businessLogic: '季度末最后一天为结算日',
    answerRequirements: '回答使用中文，使用 Markdown 表格展示数据',
    verifiedSqlFileName: 'verified_sales_queries.sql',
    chainOfThought: `1. 首先理解用户问题的业务意图
2. 识别问题中涉及的指标和维度
3. 根据业务语义映射到具体的表和字段
4. 构建 SQL 查询，注意业务逻辑和计算公式
5. 验证 SQL 的语法和逻辑正确性`,
  },
];

// ============================================
// 主组件
// ============================================

export default function AgentManagement() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [isMoreModalOpen, setIsMoreModalOpen] = useState(false);

  // 筛选状态
  const [filterType, setFilterType] = useState<'all' | AgentType>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'offline'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // 通用表单状态
  const [agentType, setAgentType] = useState<AgentType>('custom');
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDefaultSelected, setFormDefaultSelected] = useState(false);
  
  // Custom Agent 表单状态
  const [formUrl, setFormUrl] = useState('');
  const [formEndpoint, setFormEndpoint] = useState('');
  const [formAuthType, setFormAuthType] = useState<'apiKey' | 'oauth'>('apiKey');
  const [formApiKey, setFormApiKey] = useState('');
  const [formOauthClientId, setFormOauthClientId] = useState('');
  const [formOauthClientSecret, setFormOauthClientSecret] = useState('');
  const [formStreaming, setFormStreaming] = useState(false);
  const [formBody, setFormBody] = useState('{\n  "temperature": 0.7,\n  "max_tokens": 2000\n}');
  
  // AskData Agent 表单状态
  const [formEnabled, setFormEnabled] = useState(true);
  const [formDataSourceType, setFormDataSourceType] = useState<'snowflake' | 'postgresql'>('snowflake');
  const [formSnowflakeConfig, setFormSnowflakeConfig] = useState({
    account: '',
    warehouse: '',
    database: '',
    schema: '',
    user: '',
    password: '',
  });
  const [formPostgresqlConfig, setFormPostgresqlConfig] = useState({
    host: '',
    port: '',
    database: '',
    schema: '',
    user: '',
    password: '',
  });
  const [formUseCase, setFormUseCase] = useState('');
  const [formAbbreviations, setFormAbbreviations] = useState('');
  const [formFieldValues, setFormFieldValues] = useState('');
  const [formFormulas, setFormFormulas] = useState('');
  const [formBusinessLogic, setFormBusinessLogic] = useState('');
  const [formAnswerRequirements, setFormAnswerRequirements] = useState('');
  const [formVerifiedSqlFileName, setFormVerifiedSqlFileName] = useState('');
  const [formChainOfThought, setFormChainOfThought] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const openAddForm = () => {
    setEditingAgent(null);
    resetForm();
    setIsFormOpen(true);
  };

  const openEditForm = (agent: Agent) => {
    setEditingAgent(agent);
    setAgentType(agent.agentType);
    setFormName(agent.name);
    setFormDescription(agent.description);
    setFormDefaultSelected(agent.defaultSelected);
    
    if (agent.agentType === 'custom') {
      setFormUrl(agent.url);
      setFormEndpoint(agent.endpoint);
      setFormAuthType(agent.authType);
      setFormApiKey(agent.apiKey || '');
      setFormOauthClientId(agent.oauthConfig?.clientId || '');
      setFormOauthClientSecret(agent.oauthConfig?.clientSecret || '');
      setFormStreaming(agent.streaming);
      setFormBody(agent.body);
    } else {
      setFormEnabled(agent.enabled);
      setFormDataSourceType(agent.dataSourceType);
      setFormSnowflakeConfig(agent.snowflakeConfig);
      setFormPostgresqlConfig(agent.postgresqlConfig);
      setFormUseCase(agent.useCase);
      setFormAbbreviations(agent.abbreviations);
      setFormFieldValues(agent.fieldValues);
      setFormFormulas(agent.formulas);
      setFormBusinessLogic(agent.businessLogic);
      setFormAnswerRequirements(agent.answerRequirements);
      setFormVerifiedSqlFileName(agent.verifiedSqlFileName);
      setFormChainOfThought(agent.chainOfThought);
    }
    
    setIsFormOpen(true);
  };

  const resetForm = () => {
    setAgentType('custom');
    setFormName('');
    setFormDescription('');
    setFormDefaultSelected(false);
    setFormUrl('');
    setFormEndpoint('');
    setFormAuthType('apiKey');
    setFormApiKey('');
    setFormOauthClientId('');
    setFormOauthClientSecret('');
    setFormStreaming(false);
    setFormBody('{\n  "temperature": 0.7,\n  "max_tokens": 2000\n}');
    setFormEnabled(true);
    setFormDataSourceType('snowflake');
    setFormSnowflakeConfig({ account: '', warehouse: '', database: '', schema: '', user: '', password: '' });
    setFormPostgresqlConfig({ host: '', port: '', database: '', schema: '', user: '', password: '' });
    setFormUseCase('');
    setFormAbbreviations('');
    setFormFieldValues('');
    setFormFormulas('');
    setFormBusinessLogic('');
    setFormAnswerRequirements('');
    setFormVerifiedSqlFileName('');
    setFormChainOfThought('');
    setConnectionStatus('idle');
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingAgent(null);
    resetForm();
  };

  const handleSave = () => {
    let newAgent: Agent;
    
    if (agentType === 'custom') {
      newAgent = {
        id: editingAgent?.id || `agent-${Date.now()}`,
        name: formName,
        description: formDescription,
        agentType: 'custom',
        url: formUrl,
        endpoint: formEndpoint,
        authType: formAuthType,
        apiKey: formAuthType === 'apiKey' ? formApiKey : undefined,
        oauthConfig: formAuthType === 'oauth'
          ? { clientId: formOauthClientId, clientSecret: formOauthClientSecret }
          : undefined,
        streaming: formStreaming,
        defaultSelected: formDefaultSelected,
        body: formBody,
        status: 'online',
        updatedAt: new Date().toLocaleString('zh-CN'),
      };
    } else {
      newAgent = {
        id: editingAgent?.id || `agent-${Date.now()}`,
        name: formName,
        description: formDescription,
        agentType: 'askdata',
        enabled: formEnabled,
        defaultSelected: formDefaultSelected,
        status: 'online',
        updatedAt: new Date().toLocaleString('zh-CN'),
        dataSourceType: formDataSourceType,
        snowflakeConfig: formSnowflakeConfig,
        postgresqlConfig: formPostgresqlConfig,
        useCase: formUseCase,
        abbreviations: formAbbreviations,
        fieldValues: formFieldValues,
        formulas: formFormulas,
        businessLogic: formBusinessLogic,
        answerRequirements: formAnswerRequirements,
        verifiedSqlFileName: formVerifiedSqlFileName,
        chainOfThought: formChainOfThought,
      };
    }

    if (editingAgent) {
      setAgents(agents.map((a) => (a.id === editingAgent.id ? newAgent : a)));
    } else {
      setAgents([...agents, newAgent]);
    }

    closeForm();
  };

  const handleDelete = (agentId: string) => {
    if (confirm('确定要删除这个 Agent 吗？')) {
      setAgents(agents.filter((a) => a.id !== agentId));
    }
  };

  const handleToggleStatus = (agentId: string) => {
    setAgents(
      agents.map((a) =>
        a.id === agentId
          ? { ...a, status: a.status === 'online' ? 'offline' : 'online' }
          : a
      )
    );
  };

  const handleTestConnection = () => {
    setConnectionStatus('testing');
    setTimeout(() => {
      setConnectionStatus('success');
    }, 1500);
  };

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.sql,.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setFormVerifiedSqlFileName(file.name);
      }
    };
    input.click();
  };

  const getAgentTypeIcon = (type: AgentType) => {
    switch (type) {
      case 'askdata':
        return <Database size={20} className="text-brand-petrol" />;
      case 'custom':
      default:
        return <Bot size={20} className="text-dark-purple" />;
    }
  };

  const getAgentTypeLabel = (type: AgentType) => {
    switch (type) {
      case 'askdata':
        return 'AskData';
      case 'custom':
      default:
        return '自定义';
    }
  };

  const getAgentTypeColor = (type: AgentType) => {
    switch (type) {
      case 'askdata':
        return 'bg-primary-soft text-brand-petrol-dark';
      case 'custom':
      default:
        return 'bg-soft-purple/30 text-dark-purple';
    }
  };

  // 过滤后的 Agent 列表
  const filteredAgents = useMemo(() => {
    return agents.filter(agent => {
      const matchType = filterType === 'all' || agent.agentType === filterType;
      const matchStatus = filterStatus === 'all' || agent.status === filterStatus;
      const matchSearch = searchQuery === '' ||
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchStatus && matchSearch;
    });
  }, [agents, filterType, filterStatus, searchQuery]);

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-soft">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-deep-blue-80 tracking-tight">Agent 管理</h1>
            <p className="text-sm text-deep-blue-40">管理所有智能体配置，包括自定义Agent和AskData</p>
          </div>
        </div>
        <button
          onClick={openAddForm}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-petrol text-white font-medium rounded-lg hover:bg-brand-petrol active:bg-brand-petrol-dark transition-all shadow-soft hover:shadow-soft"
        >
          <Plus size={18} />
          添加 Agent
        </button>
      </div>

      {/* 筛选栏 */}
      <div className="bg-white rounded-xl p-4 shadow-soft border border-deep-blue-10">
        <div className="flex flex-wrap items-center gap-4">
          {/* 类型筛选 */}
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | AgentType)}
              className="appearance-none pl-3 pr-8 py-2.5 bg-light-sand border border-deep-blue-10 rounded-lg text-sm text-deep-blue-80 focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent cursor-pointer"
            >
              <option value="all">全部类型</option>
              <option value="custom">自定义Agent</option>
              <option value="askdata">AskData</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-deep-blue-40 pointer-events-none" />
          </div>

          {/* 状态筛选 */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'online' | 'offline')}
              className="appearance-none pl-3 pr-8 py-2.5 bg-light-sand border border-deep-blue-10 rounded-lg text-sm text-deep-blue-80 focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent cursor-pointer"
            >
              <option value="all">全部状态</option>
              <option value="online">在线</option>
              <option value="offline">离线</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-deep-blue-40 pointer-events-none" />
          </div>

          {/* 搜索框 */}
          <div className="flex-1 min-w-[200px] relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-deep-blue-40" />
            <input
              type="text"
              placeholder="搜索 Agent 名称或描述..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-light-sand border border-deep-blue-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Agent 列表表格 */}
      <div className="bg-white rounded-xl border border-deep-blue-10 shadow-soft overflow-hidden">
        <table className="w-full">
          <thead className="bg-light-sand border-b border-deep-blue-10">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-deep-blue-40 uppercase tracking-wider">名称</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-deep-blue-40 uppercase tracking-wider">类型</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-deep-blue-40 uppercase tracking-wider">状态</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-deep-blue-40 uppercase tracking-wider">默认</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-deep-blue-40 uppercase tracking-wider">最后更新</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-deep-blue-40 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-deep-blue-10">
            {filteredAgents.map((agent) => (
              <tr key={agent.id} className="hover:bg-light-sand/70 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {getAgentTypeIcon(agent.agentType)}
                    <div>
                      <div className="font-medium text-deep-blue-80">{agent.name}</div>
                      <div className="text-xs text-deep-blue-40 truncate max-w-xs mt-0.5">{agent.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getAgentTypeColor(agent.agentType)}`}>
                    {getAgentTypeLabel(agent.agentType)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggleStatus(agent.id)}
                    className="flex items-center gap-2 mx-auto px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                    style={{
                      backgroundColor: agent.status === 'online' ? '#dcfce7' : '#fee2e2',
                      color: agent.status === 'online' ? '#16a34a' : '#dc2626',
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: agent.status === 'online' ? '#16a34a' : '#dc2626',
                        boxShadow: agent.status === 'online' ? '0 0 6px #16a34a' : 'none',
                      }}
                    />
                    {agent.status === 'online' ? '在线' : '离线'}
                  </button>
                </td>
                <td className="px-6 py-4 text-center">
                  {agent.defaultSelected && (
                    <Check size={18} className="text-green mx-auto" />
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm text-deep-blue-40">{agent.updatedAt}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => openEditForm(agent)}
                      className="p-2 text-brand-petrol hover:bg-primary-soft rounded-lg transition-colors"
                      title="编辑"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(agent.id)}
                      className="p-2 text-red hover:bg-red-light rounded-lg transition-colors"
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

        {filteredAgents.length === 0 && (
          <div className="px-6 py-12 text-center text-deep-blue-40">
            <Bot size={48} className="mx-auto mb-4 opacity-50" />
            <p>
              {agents.length === 0
                ? '暂无 Agent，请点击上方按钮添加'
                : '没有找到匹配的 Agent，请调整筛选条件'}
            </p>
          </div>
        )}
      </div>

      {/* View More Modal */}
      {isMoreModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsMoreModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-deep-blue-10">
              <h3 className="text-lg font-semibold text-deep-blue-80">选择 Agent</h3>
              <button
                onClick={() => setIsMoreModalOpen(false)}
                className="p-2 text-deep-blue-40 hover:text-deep-blue-60 hover:bg-light-sand rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto p-2">
              {agents.slice(3).map((agent) => (
                <div
                  key={agent.id}
                  className="px-4 py-3 hover:bg-light-sand transition-colors cursor-pointer flex items-center gap-4 rounded-lg"
                  onClick={() => {
                    setIsMoreModalOpen(false);
                    openEditForm(agent);
                  }}
                >
                  <div className="flex-shrink-0">
                    {getAgentTypeIcon(agent.agentType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-deep-blue-80">{agent.name}</div>
                    <div className="text-sm text-deep-blue-40 truncate">{agent.description}</div>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getAgentTypeColor(agent.agentType)}`}>
                    {getAgentTypeLabel(agent.agentType)}
                  </span>
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: agent.status === 'online' ? '#16a34a' : '#dc2626',
                      boxShadow: agent.status === 'online' ? '0 0 6px #16a34a' : 'none',
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-deep-blue-10 bg-light-sand">
              <button
                onClick={() => setIsMoreModalOpen(false)}
                className="w-full px-4 py-2.5 bg-deep-blue-10 text-deep-blue-80 font-medium rounded-lg hover:bg-deep-blue-20 transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Agent Form */}
      {isFormOpen && (
        <div className="bg-white rounded-xl border border-deep-blue-10 shadow-soft p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-deep-blue-80">
              {editingAgent ? '编辑 Agent' : '添加 Agent'}
            </h3>
            <button
              onClick={closeForm}
              className="p-2 text-deep-blue-40 hover:text-deep-blue-60 hover:bg-light-sand rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Agent Type Selection */}
          {!editingAgent && (
            <div className="mb-6 p-4 bg-light-sand rounded-lg">
              <label className="block text-sm font-medium text-deep-blue-80 mb-3">Agent 类型</label>
              <div className="flex gap-4">
                <label
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors border-2 ${
                    agentType === 'custom'
                      ? 'border-purple bg-soft-purple/20 text-dark-purple'
                      : 'border-deep-blue-10 bg-white text-deep-blue-60 hover:bg-light-sand'
                  }`}
                >
                  <input
                    type="radio"
                    name="agentType"
                    checked={agentType === 'custom'}
                    onChange={() => setAgentType('custom')}
                    className="sr-only"
                  />
                  <Bot size={24} />
                  <div>
                    <div className="font-medium">自定义 Agent</div>
                    <div className="text-xs opacity-75">连接外部 Agent 服务</div>
                  </div>
                </label>
                <label
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors border-2 ${
                    agentType === 'askdata'
                      ? 'border-brand-petrol bg-primary-soft text-brand-petrol-dark'
                      : 'border-deep-blue-10 bg-white text-deep-blue-60 hover:bg-light-sand'
                  }`}
                >
                  <input
                    type="radio"
                    name="agentType"
                    checked={agentType === 'askdata'}
                    onChange={() => setAgentType('askdata')}
                    className="sr-only"
                  />
                  <Database size={24} />
                  <div>
                    <div className="font-medium">AskData</div>
                    <div className="text-xs opacity-75">数据分析查询 Agent</div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Common Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-deep-blue-80">Agent 名称</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder={agentType === 'askdata' ? '如：销售数据分析助手' : '如：销售报表助手'}
                className="w-full px-4 py-2.5 border border-deep-blue-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-deep-blue-80">描述</label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Agent 功能描述"
                rows={2}
                className="w-full px-4 py-2.5 border border-deep-blue-10 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent"
              />
            </div>
          </div>

          {/* Custom Agent Form */}
          {agentType === 'custom' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Agent URL */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-deep-blue-80">Agent URL</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-deep-blue-40 font-mono text-sm">
                      https://
                    </span>
                    <input
                      type="text"
                      value={formUrl.replace(/^https?:\/\//, '')}
                      onChange={(e) => setFormUrl('https://' + e.target.value)}
                      placeholder="agent.company.com..."
                      className="w-full pl-20 pr-4 py-2.5 border border-deep-blue-10 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Endpoint */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-deep-blue-80">Endpoint</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-deep-blue-40 font-mono text-sm">
                      /
                    </span>
                    <input
                      type="text"
                      value={formEndpoint.replace(/^\//, '')}
                      onChange={(e) => setFormEndpoint('/' + e.target.value)}
                      placeholder="api/v1/query"
                      className="w-full pl-6 pr-4 py-2.5 border border-deep-blue-10 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Auth Type */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-deep-blue-80">权限认证方式</label>
                  <div className="flex gap-4">
                    <label
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                        formAuthType === 'apiKey'
                          ? 'bg-brand-petrol text-white'
                          : 'bg-light-sand text-deep-blue-60 hover:bg-deep-blue-10'
                      }`}
                    >
                      <input
                        type="radio"
                        name="authType"
                        checked={formAuthType === 'apiKey'}
                        onChange={() => setFormAuthType('apiKey')}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        formAuthType === 'apiKey' ? 'border-white' : 'border-deep-blue-20'
                      }`}>
                        {formAuthType === 'apiKey' && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className="font-medium text-sm">API Key</span>
                    </label>
                    <label
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                        formAuthType === 'oauth'
                          ? 'bg-brand-petrol text-white'
                          : 'bg-light-sand text-deep-blue-60 hover:bg-deep-blue-10'
                      }`}
                    >
                      <input
                        type="radio"
                        name="authType"
                        checked={formAuthType === 'oauth'}
                        onChange={() => setFormAuthType('oauth')}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        formAuthType === 'oauth' ? 'border-white' : 'border-deep-blue-20'
                      }`}>
                        {formAuthType === 'oauth' && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className="font-medium text-sm">OAuth</span>
                    </label>
                  </div>
                </div>

                {/* API Key / OAuth Config */}
                <div className="space-y-2">
                  {formAuthType === 'apiKey' ? (
                    <>
                      <label className="block text-sm font-medium text-deep-blue-80">API Key</label>
                      <input
                        type="password"
                        value={formApiKey}
                        onChange={(e) => setFormApiKey(e.target.value)}
                        placeholder="sk-xxxxxxxxxxxxxxxx"
                        className="w-full px-4 py-2.5 border border-deep-blue-10 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent"
                      />
                    </>
                  ) : (
                    <>
                      <label className="block text-sm font-medium text-deep-blue-80">Client ID</label>
                      <input
                        type="text"
                        value={formOauthClientId}
                        onChange={(e) => setFormOauthClientId(e.target.value)}
                        placeholder="client-id"
                        className="w-full px-4 py-2.5 border border-deep-blue-10 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent"
                      />
                      <label className="block text-sm font-medium text-deep-blue-80 mt-3">Client Secret</label>
                      <input
                        type="password"
                        value={formOauthClientSecret}
                        onChange={(e) => setFormOauthClientSecret(e.target.value)}
                        placeholder="client-secret"
                        className="w-full px-4 py-2.5 border border-deep-blue-10 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent"
                      />
                    </>
                  )}
                </div>

                {/* Streaming */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-deep-blue-80">开启流式输出</label>
                  <Toggle
                    checked={formStreaming}
                    onChange={setFormStreaming}
                  />
                </div>

                {/* Default Selected */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-deep-blue-80">默认每次会话选用</label>
                  <Toggle
                    checked={formDefaultSelected}
                    onChange={setFormDefaultSelected}
                  />
                </div>
              </div>

              {/* JSON Editor */}
              <div className="mt-6 pt-6 border-t border-deep-blue-10">
                <JSONEditor
                  value={formBody}
                  onChange={setFormBody}
                />
              </div>
            </div>
          )}

          {/* AskData Agent Form */}
          {agentType === 'askdata' && (
            <div className="space-y-6">
              {/* Enabled Switch */}
              <div className="p-4 bg-light-sand rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="text-brand-petrol" size={20} />
                    <h4 className="font-medium text-deep-blue-80">功能开关</h4>
                  </div>
                  <Toggle checked={formEnabled} onChange={setFormEnabled} />
                </div>
              </div>

              {/* Data Source Configuration */}
              <div className="p-4 bg-light-sand rounded-lg space-y-4">
                <h4 className="font-medium text-deep-blue-80 flex items-center gap-2">
                  <Database size={18} className="text-dark-purple" />
                  数据源配置
                </h4>
                
                <div className="flex gap-4">
                  <label
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                      formDataSourceType === 'snowflake'
                        ? 'bg-brand-petrol text-white'
                        : 'bg-white text-deep-blue-60 hover:bg-light-sand border border-deep-blue-10'
                    }`}
                  >
                    <input
                      type="radio"
                      name="dataSourceType"
                      checked={formDataSourceType === 'snowflake'}
                      onChange={() => setFormDataSourceType('snowflake')}
                      className="sr-only"
                    />
                    <span className="font-medium text-sm">Snowflake</span>
                  </label>
                  <label
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                      formDataSourceType === 'postgresql'
                        ? 'bg-brand-petrol text-white'
                        : 'bg-white text-deep-blue-60 hover:bg-light-sand border border-deep-blue-10'
                    }`}
                  >
                    <input
                      type="radio"
                      name="dataSourceType"
                      checked={formDataSourceType === 'postgresql'}
                      onChange={() => setFormDataSourceType('postgresql')}
                      className="sr-only"
                    />
                    <span className="font-medium text-sm">PostgreSQL</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formDataSourceType === 'snowflake' ? (
                    <>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-deep-blue-80">Account</label>
                        <input
                          type="text"
                          value={formSnowflakeConfig.account}
                          onChange={(e) => setFormSnowflakeConfig({ ...formSnowflakeConfig, account: e.target.value })}
                          placeholder="xy12345.us-east-1"
                          className="w-full px-4 py-2.5 border border-deep-blue-10 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-deep-blue-80">Warehouse</label>
                        <input
                          type="text"
                          value={formSnowflakeConfig.warehouse}
                          onChange={(e) => setFormSnowflakeConfig({ ...formSnowflakeConfig, warehouse: e.target.value })}
                          placeholder="COMPUTE_WH"
                          className="w-full px-4 py-2.5 border border-deep-blue-10 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-deep-blue-80">Database</label>
                        <input
                          type="text"
                          value={formSnowflakeConfig.database}
                          onChange={(e) => setFormSnowflakeConfig({ ...formSnowflakeConfig, database: e.target.value })}
                          placeholder="SALES_DB"
                          className="w-full px-4 py-2.5 border border-deep-blue-10 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-deep-blue-80">Schema</label>
                        <input
                          type="text"
                          value={formSnowflakeConfig.schema}
                          onChange={(e) => setFormSnowflakeConfig({ ...formSnowflakeConfig, schema: e.target.value })}
                          placeholder="ANALYTICS"
                          className="w-full px-4 py-2.5 border border-deep-blue-10 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-deep-blue-80">User</label>
                        <input
                          type="text"
                          value={formSnowflakeConfig.user}
                          onChange={(e) => setFormSnowflakeConfig({ ...formSnowflakeConfig, user: e.target.value })}
                          placeholder="admin"
                          className="w-full px-4 py-2.5 border border-deep-blue-10 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-deep-blue-80">Password</label>
                        <input
                          type="password"
                          value={formSnowflakeConfig.password}
                          onChange={(e) => setFormSnowflakeConfig({ ...formSnowflakeConfig, password: e.target.value })}
                          placeholder="••••••••"
                          className="w-full px-4 py-2.5 border border-deep-blue-10 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-deep-blue-80">Host</label>
                        <input
                          type="text"
                          value={formPostgresqlConfig.host}
                          onChange={(e) => setFormPostgresqlConfig({ ...formPostgresqlConfig, host: e.target.value })}
                          placeholder="localhost"
                          className="w-full px-4 py-2.5 border border-deep-blue-10 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-deep-blue-80">Port</label>
                        <input
                          type="text"
                          value={formPostgresqlConfig.port}
                          onChange={(e) => setFormPostgresqlConfig({ ...formPostgresqlConfig, port: e.target.value })}
                          placeholder="5432"
                          className="w-full px-4 py-2.5 border border-deep-blue-10 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-deep-blue-80">Database</label>
                        <input
                          type="text"
                          value={formPostgresqlConfig.database}
                          onChange={(e) => setFormPostgresqlConfig({ ...formPostgresqlConfig, database: e.target.value })}
                          placeholder="sales"
                          className="w-full px-4 py-2.5 border border-deep-blue-10 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-deep-blue-80">Schema</label>
                        <input
                          type="text"
                          value={formPostgresqlConfig.schema}
                          onChange={(e) => setFormPostgresqlConfig({ ...formPostgresqlConfig, schema: e.target.value })}
                          placeholder="public"
                          className="w-full px-4 py-2.5 border border-deep-blue-10 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-deep-blue-80">User</label>
                        <input
                          type="text"
                          value={formPostgresqlConfig.user}
                          onChange={(e) => setFormPostgresqlConfig({ ...formPostgresqlConfig, user: e.target.value })}
                          placeholder="postgres"
                          className="w-full px-4 py-2.5 border border-deep-blue-10 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-deep-blue-80">Password</label>
                        <input
                          type="password"
                          value={formPostgresqlConfig.password}
                          onChange={(e) => setFormPostgresqlConfig({ ...formPostgresqlConfig, password: e.target.value })}
                          placeholder="••••••••"
                          className="w-full px-4 py-2.5 border border-deep-blue-10 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent"
                        />
                      </div>
                    </>
                  )}
                </div>

                <button
                  onClick={handleTestConnection}
                  disabled={connectionStatus === 'testing'}
                  className="px-4 py-2.5 bg-green text-white font-medium rounded-lg hover:bg-green transition-colors disabled:bg-deep-blue-20 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {connectionStatus === 'testing' ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      测试中...
                    </>
                  ) : connectionStatus === 'success' ? (
                    <>
                      <Check size={16} />
                      连接成功
                    </>
                  ) : (
                    <>
                      <Database size={16} />
                      测试连接
                    </>
                  )}
                </button>
              </div>

              {/* Business Semantics */}
              <div className="p-4 bg-light-sand rounded-lg space-y-3">
                <h4 className="font-medium text-deep-blue-80 flex items-center gap-2">
                  <Globe size={18} className="text-dark-yellow" />
                  业务语义配置
                </h4>
                <AccordionItem
                  title="使用场景描述"
                  value={formUseCase}
                  onChange={setFormUseCase}
                  placeholder="描述 Agent 的主要用途，如：用于查询销售业绩、客户数据、市场分析等"
                />
                <AccordionItem
                  title="黑话/缩写定义"
                  value={formAbbreviations}
                  onChange={setFormAbbreviations}
                  placeholder="特殊术语解释，如：FY: 财年，KPI: 关键绩效指标，ARE: 管控区域"
                />
                <AccordionItem
                  title="特殊字段值说明"
                  value={formFieldValues}
                  onChange={setFormFieldValues}
                  placeholder="字段值的业务含义，如：status=1 表示已成交，2 表示跟进中，3 表示失败"
                />
                <AccordionItem
                  title="指标计算公式"
                  value={formFormulas}
                  onChange={setFormFormulas}
                  placeholder="关键指标的计算方法，如：毛利率 = (收入 - 成本) / 收入 × 100%"
                />
                <AccordionItem
                  title="特殊业务逻辑"
                  value={formBusinessLogic}
                  onChange={setFormBusinessLogic}
                  placeholder="特定计算规则，如：季度末最后一天为结算日"
                />
                <AccordionItem
                  title="回答特殊要求"
                  value={formAnswerRequirements}
                  onChange={setFormAnswerRequirements}
                  placeholder="对回答格式/语言的要求，如：回答使用中文，使用 Markdown 表格展示数据"
                />
              </div>

              {/* Advanced Configuration */}
              <div className="p-4 bg-light-sand rounded-lg space-y-4">
                <h4 className="font-medium text-deep-blue-80 flex items-center gap-2">
                  <Settings size={18} className="text-deep-blue-40" />
                  高级配置
                </h4>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-deep-blue-80">Verified SQL</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleFileUpload}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-petrol text-white font-medium rounded-lg hover:bg-brand-petrol transition-colors"
                    >
                      <Database size={16} />
                      上传 SQL 文件
                    </button>
                    {formVerifiedSqlFileName && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-deep-blue-10">
                        <Database size={16} className="text-deep-blue-40" />
                        <span className="text-sm text-deep-blue-80 font-mono">{formVerifiedSqlFileName}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-deep-blue-80">思维链（Chain of Thought）</label>
                  <textarea
                    value={formChainOfThought}
                    onChange={(e) => setFormChainOfThought(e.target.value)}
                    placeholder="AI 生成 SQL 时的思考链提示词"
                    rows={5}
                    className="w-full px-4 py-3 border border-deep-blue-10 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent font-mono"
                  />
                </div>
              </div>

              {/* Default Selected */}
              <div className="flex items-center gap-4">
                <label className="block text-sm font-medium text-deep-blue-80">默认每次会话选用</label>
                <Toggle
                  checked={formDefaultSelected}
                  onChange={setFormDefaultSelected}
                />
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-deep-blue-10">
            <button
              onClick={closeForm}
              className="px-5 py-2.5 text-deep-blue-60 font-medium rounded-lg hover:bg-light-sand transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              disabled={!formName}
              className="px-5 py-2.5 bg-brand-petrol text-white font-medium rounded-lg hover:bg-brand-petrol transition-colors disabled:bg-deep-blue-20 disabled:cursor-not-allowed"
            >
              保存
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
