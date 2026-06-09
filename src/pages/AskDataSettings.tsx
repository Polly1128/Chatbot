import { useState } from 'react';
import { Database, Info, BookOpen, Settings, CheckCircle, XCircle, Upload, FileText, BarChart3 } from 'lucide-react';
import Toggle from '../components/Toggle';
import AccordionItem from '../components/AccordionItem';

export default function AskDataSettings() {
  // Global switch
  const [enabled, setEnabled] = useState(true);
  const [isConfigured, setIsConfigured] = useState(true);

  // Data source
  const [dataSourceType, setDataSourceType] = useState<'snowflake' | 'postgresql'>('snowflake');
  const [snowflakeConfig, setSnowflakeConfig] = useState({
    account: 'xy12345.us-east-1',
    warehouse: 'COMPUTE_WH',
    database: 'SALES_DB',
    schema: 'ANALYTICS',
    user: 'admin',
    password: '',
  });
  const [postgresqlConfig, setPostgresqlConfig] = useState({
    host: 'localhost',
    port: '5432',
    database: 'sales',
    schema: 'public',
    user: 'postgres',
    password: '',
  });
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  // Agent basic info
  const [agentName, setAgentName] = useState('销售数据分析助手');
  const [agentDescription, setAgentDescription] = useState('帮助用户查询销售相关数据，支持多维度分析和可视化展示');

  // Business semantics
  const [useCase, setUseCase] = useState('用于查询销售业绩、客户数据、市场分析等');
  const [abbreviations, setAbbreviations] = useState('FY: 财年，KPI: 关键绩效指标，ARE: 管控区域');
  const [fieldValues, setFieldValues] = useState('status=1 表示已成交，2 表示跟进中，3 表示失败');
  const [formulas, setFormulas] = useState('毛利率 = (收入 - 成本) / 收入 × 100%');
  const [businessLogic, setBusinessLogic] = useState('季度末最后一天为结算日');
  const [answerRequirements, setAnswerRequirements] = useState('回答使用中文，使用 Markdown 表格展示数据');

  // Advanced config
  const [verifiedSqlFileName, setVerifiedSqlFileName] = useState('verified_sales_queries.sql');
  const [chainOfThought, setChainOfThought] = useState(
    `1. 首先理解用户问题的业务意图
2. 识别问题中涉及的指标和维度
3. 根据业务语义映射到具体的表和字段
4. 构建 SQL 查询，注意业务逻辑和计算公式
5. 验证 SQL 的语法和逻辑正确性`
  );

  const handleTestConnection = () => {
    setConnectionStatus('testing');
    setTimeout(() => {
      setConnectionStatus('success');
      setIsConfigured(true);
    }, 1500);
  };

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.sql,.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setVerifiedSqlFileName(file.name);
      }
    };
    input.click();
  };

  const handleSave = () => {
    alert('配置已保存！');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-gradient-to-br from-brand-petrol to-cyan-500 rounded-xl flex items-center justify-center shadow-soft">
          <BarChart3 size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-deep-blue-80 tracking-tight">AskData 配置</h1>
          <p className="text-sm text-deep-blue-40">配置 AskData 数据分析功能</p>
        </div>
      </div>

      {/* Global Switch */}
      <div className="bg-white rounded-xl border border-deep-blue-10 shadow-soft p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-soft rounded-lg flex items-center justify-center">
              <Database className="text-brand-petrol" size={20} />
            </div>
            <h3 className="font-semibold text-deep-blue-80">功能开关</h3>
          </div>
          <Toggle checked={enabled} onChange={setEnabled} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-deep-blue-60">状态:</span>
          {isConfigured && enabled ? (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-brand-green/20 text-dark-green rounded-full text-sm font-medium">
              <CheckCircle size={14} />
              已配置
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-light-sand text-deep-blue-60 rounded-full text-sm font-medium">
              <XCircle size={14} />
              未配置
            </div>
          )}
        </div>
      </div>

      {/* Data Source Configuration */}
      <div className="bg-white rounded-xl border border-deep-blue-10 shadow-soft p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-soft-purple/20 rounded-lg flex items-center justify-center">
            <Database className="text-dark-purple" size={20} />
          </div>
          <h3 className="font-semibold text-deep-blue-80">数据源配置</h3>
        </div>

        <div className="space-y-5">
          {/* Data Source Type */}
          <div className="flex gap-4">
            <label
              className={`flex items-center gap-3 px-5 py-3 rounded-lg cursor-pointer transition-all border-2 ${
                dataSourceType === 'snowflake'
                  ? 'bg-primary-soft border-brand-petrol text-brand-petrol-dark'
                  : 'bg-light-sand border-transparent text-deep-blue-60 hover:bg-light-sand'
              }`}
            >
              <input
                type="radio"
                name="dataSourceType"
                checked={dataSourceType === 'snowflake'}
                onChange={() => setDataSourceType('snowflake')}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                dataSourceType === 'snowflake' ? 'border-brand-petrol' : 'border-deep-blue-20'
              }`}>
                {dataSourceType === 'snowflake' && <div className="w-2.5 h-2.5 rounded-full bg-brand-petrol" />}
              </div>
              <span className="font-medium text-sm">Snowflake</span>
            </label>
            <label
              className={`flex items-center gap-3 px-5 py-3 rounded-lg cursor-pointer transition-all border-2 ${
                dataSourceType === 'postgresql'
                  ? 'bg-primary-soft border-brand-petrol text-brand-petrol-dark'
                  : 'bg-light-sand border-transparent text-deep-blue-60 hover:bg-light-sand'
              }`}
            >
              <input
                type="radio"
                name="dataSourceType"
                checked={dataSourceType === 'postgresql'}
                onChange={() => setDataSourceType('postgresql')}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                dataSourceType === 'postgresql' ? 'border-brand-petrol' : 'border-deep-blue-20'
              }`}>
                {dataSourceType === 'postgresql' && <div className="w-2.5 h-2.5 rounded-full bg-brand-petrol" />}
              </div>
              <span className="font-medium text-sm">PostgreSQL</span>
            </label>
          </div>

          {/* Connection Config */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {dataSourceType === 'snowflake' ? (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-deep-blue-80">Account</label>
                  <input
                    type="text"
                    value={snowflakeConfig.account}
                    onChange={(e) => setSnowflakeConfig({ ...snowflakeConfig, account: e.target.value })}
                    placeholder="xy12345.us-east-1"
                    className="w-full px-4 py-2.5 border border-deep-blue-10 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-deep-blue-80">Warehouse</label>
                  <input
                    type="text"
                    value={snowflakeConfig.warehouse}
                    onChange={(e) => setSnowflakeConfig({ ...snowflakeConfig, warehouse: e.target.value })}
                    placeholder="COMPUTE_WH"
                    className="w-full px-4 py-2.5 border border-deep-blue-10 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-deep-blue-80">Database</label>
                  <input
                    type="text"
                    value={snowflakeConfig.database}
                    onChange={(e) => setSnowflakeConfig({ ...snowflakeConfig, database: e.target.value })}
                    placeholder="SALES_DB"
                    className="w-full px-4 py-2.5 border border-deep-blue-10 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-deep-blue-80">Schema</label>
                  <input
                    type="text"
                    value={snowflakeConfig.schema}
                    onChange={(e) => setSnowflakeConfig({ ...snowflakeConfig, schema: e.target.value })}
                    placeholder="ANALYTICS"
                    className="w-full px-4 py-2.5 border border-deep-blue-10 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-deep-blue-80">User</label>
                  <input
                    type="text"
                    value={snowflakeConfig.user}
                    onChange={(e) => setSnowflakeConfig({ ...snowflakeConfig, user: e.target.value })}
                    placeholder="admin"
                    className="w-full px-4 py-2.5 border border-deep-blue-10 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-deep-blue-80">Password</label>
                  <input
                    type="password"
                    value={snowflakeConfig.password}
                    onChange={(e) => setSnowflakeConfig({ ...snowflakeConfig, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 border border-deep-blue-10 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent transition-all"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-deep-blue-80">Host</label>
                  <input
                    type="text"
                    value={postgresqlConfig.host}
                    onChange={(e) => setPostgresqlConfig({ ...postgresqlConfig, host: e.target.value })}
                    placeholder="localhost"
                    className="w-full px-4 py-2.5 border border-deep-blue-10 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-deep-blue-80">Port</label>
                  <input
                    type="text"
                    value={postgresqlConfig.port}
                    onChange={(e) => setPostgresqlConfig({ ...postgresqlConfig, port: e.target.value })}
                    placeholder="5432"
                    className="w-full px-4 py-2.5 border border-deep-blue-10 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-deep-blue-80">Database</label>
                  <input
                    type="text"
                    value={postgresqlConfig.database}
                    onChange={(e) => setPostgresqlConfig({ ...postgresqlConfig, database: e.target.value })}
                    placeholder="sales"
                    className="w-full px-4 py-2.5 border border-deep-blue-10 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-deep-blue-80">Schema</label>
                  <input
                    type="text"
                    value={postgresqlConfig.schema}
                    onChange={(e) => setPostgresqlConfig({ ...postgresqlConfig, schema: e.target.value })}
                    placeholder="public"
                    className="w-full px-4 py-2.5 border border-deep-blue-10 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-deep-blue-80">User</label>
                  <input
                    type="text"
                    value={postgresqlConfig.user}
                    onChange={(e) => setPostgresqlConfig({ ...postgresqlConfig, user: e.target.value })}
                    placeholder="postgres"
                    className="w-full px-4 py-2.5 border border-deep-blue-10 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-deep-blue-80">Password</label>
                  <input
                    type="password"
                    value={postgresqlConfig.password}
                    onChange={(e) => setPostgresqlConfig({ ...postgresqlConfig, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 border border-deep-blue-10 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent transition-all"
                  />
                </div>
              </>
            )}
          </div>

          {/* Test Connection Button */}
          <div className="flex items-center gap-3 pt-3">
            <button
              onClick={handleTestConnection}
              disabled={connectionStatus === 'testing'}
              className="px-5 py-2.5 bg-green text-white font-medium rounded-lg hover:bg-green active:bg-dark-green transition-all disabled:bg-deep-blue-20 disabled:cursor-not-allowed flex items-center gap-2 shadow-soft"
            >
              {connectionStatus === 'testing' ? (
                <>
                  <span className="animate-spin">⏳</span>
                  测试中...
                </>
              ) : connectionStatus === 'success' ? (
                <>
                  <CheckCircle size={16} />
                  连接成功
                </>
              ) : connectionStatus === 'error' ? (
                <>
                  <XCircle size={16} />
                  连接失败
                </>
              ) : (
                <>
                  <Database size={16} />
                  测试连接
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Agent Basic Info */}
      <div className="bg-white rounded-xl border border-deep-blue-10 shadow-soft p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-primary-soft rounded-lg flex items-center justify-center">
            <Info className="text-brand-petrol" size={20} />
          </div>
          <h3 className="font-semibold text-deep-blue-80">Agent 基本信息</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-deep-blue-80">名称</label>
            <input
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="销售数据分析助手"
              className="w-full px-4 py-2.5 border border-deep-blue-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-deep-blue-80">简短描述</label>
            <input
              type="text"
              value={agentDescription}
              onChange={(e) => setAgentDescription(e.target.value)}
              placeholder="帮助用户查询销售相关数据..."
              className="w-full px-4 py-2.5 border border-deep-blue-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Business Semantics */}
      <div className="bg-white rounded-xl border border-deep-blue-10 shadow-soft p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-soft-yellow/40 rounded-lg flex items-center justify-center">
              <BookOpen className="text-dark-yellow" size={20} />
            </div>
            <h3 className="font-semibold text-deep-blue-80">业务语义配置</h3>
          </div>
          <span className="text-xs text-deep-blue-40">帮助 AI 准确理解业务</span>
        </div>

        <div className="space-y-4">
          <AccordionItem
            title="使用场景描述"
            value={useCase}
            onChange={setUseCase}
            placeholder="描述 Agent 的主要用途，如：用于查询销售业绩、客户数据、市场分析等"
          />
          <AccordionItem
            title="黑话/缩写定义"
            value={abbreviations}
            onChange={setAbbreviations}
            placeholder="特殊术语解释，如：FY: 财年，KPI: 关键绩效指标，ARE: 管控区域"
          />
          <AccordionItem
            title="特殊字段值说明"
            value={fieldValues}
            onChange={setFieldValues}
            placeholder="字段值的业务含义，如：status=1 表示已成交，2 表示跟进中，3 表示失败"
          />
          <AccordionItem
            title="指标计算公式"
            value={formulas}
            onChange={setFormulas}
            placeholder="关键指标的计算方法，如：毛利率 = (收入 - 成本) / 收入 × 100%"
          />
          <AccordionItem
            title="特殊业务逻辑"
            value={businessLogic}
            onChange={setBusinessLogic}
            placeholder="特定计算规则，如：季度末最后一天为结算日"
          />
          <AccordionItem
            title="回答特殊要求"
            value={answerRequirements}
            onChange={setAnswerRequirements}
            placeholder="对回答格式/语言的要求，如：回答使用中文，使用 Markdown 表格展示数据"
          />
        </div>
      </div>

      {/* Advanced Configuration */}
      <div className="bg-white rounded-xl border border-deep-blue-10 shadow-soft p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-light-sand rounded-lg flex items-center justify-center">
            <Settings className="text-deep-blue-40" size={20} />
          </div>
          <h3 className="font-semibold text-deep-blue-80">高级配置</h3>
        </div>

        <div className="space-y-6">
          {/* Verified SQL */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-deep-blue-80">Verified SQL</label>
            <div className="flex items-center gap-3">
              <button
                onClick={handleFileUpload}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-petrol text-white font-medium rounded-lg hover:bg-brand-petrol active:bg-brand-petrol-dark transition-all shadow-soft"
              >
                <Upload size={16} />
                上传 SQL 文件
              </button>
              {verifiedSqlFileName && (
                <div className="flex items-center gap-2 px-4 py-2 bg-light-sand rounded-lg border border-deep-blue-10">
                  <FileText size={16} className="text-deep-blue-40" />
                  <span className="text-sm text-deep-blue-80 font-mono">{verifiedSqlFileName}</span>
                </div>
              )}
            </div>
            <p className="text-xs text-deep-blue-40">上传常见问题的标准 SQL 查询文件</p>
          </div>

          {/* Chain of Thought */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-deep-blue-80">思维链（Chain of Thought）</label>
            <textarea
              value={chainOfThought}
              onChange={(e) => setChainOfThought(e.target.value)}
              placeholder="AI 生成 SQL 时的思考链提示词"
              rows={5}
              className="w-full px-4 py-3 border border-deep-blue-10 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent font-mono"
            />
            <p className="text-xs text-deep-blue-40">指导 AI 如何逐步思考和生成 SQL</p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <button className="px-5 py-2.5 text-deep-blue-60 font-medium rounded-lg hover:bg-light-sand transition-colors">
          取消
        </button>
        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-brand-petrol text-white font-medium rounded-lg hover:bg-brand-petrol transition-colors"
        >
          保存配置
        </button>
      </div>
    </div>
  );
}
