import { useState } from 'react';
import { Bot, Globe, Radio, Zap, Cpu, Brain } from 'lucide-react';
import Select from '../components/Select';

const llmOptions = [
  { value: 'deepseek-r1', label: 'DeepSeek R1', icon: <Zap className="text-brand-petrol" size={20} />, version: 'v1.0' },
  { value: 'gpt-4o', label: 'GPT-4o', icon: <Cpu className="text-brand-petrol" size={20} />, version: 'v4.0' },
  { value: 'claude-3.5', label: 'Claude 3.5', icon: <Brain className="text-green" size={20} />, version: 'v3.5' },
  { value: 'qwen-max', label: 'Qwen Max', icon: <Bot className="text-dark-yellow" size={20} />, version: 'v2.0' },
  { value: 'llama-3.3', label: 'Llama 3.3', icon: <Zap className="text-dark-purple" size={20} />, version: 'v3.3' },
];

const ragStrategyOptions = [
  { value: 'knowledge-only', label: '仅搜索当前workspace知识库', description: '高度敏感、仅内部使用的知识' },
  { value: 'knowledge-first', label: '知识库优先，再搜索其他workspace公开知识', description: '常规业务场景' },
  { value: 'knowledge-plus-general', label: '知识库 + 大语言模型通用知识（不搜索其他workspace）', description: '需要结合私有知识与通用能力的场景' },
];

export default function ModelSettings() {
  const [selectedModel, setSelectedModel] = useState('deepseek-r1');
  const [selectedRagStrategy, setSelectedRagStrategy] = useState('knowledge-plus-general');
  const [webSearchEnabled, setWebSearchEnabled] = useState(true);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-gradient-petrol-soft rounded-xl flex items-center justify-center shadow-soft">
          <Cpu size={20} className="text-deep-blue-80" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-deep-blue-80 tracking-tight">模型配置</h1>
          <p className="text-sm text-deep-blue-40">配置工作区的默认大语言模型和检索策略</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-deep-blue-10 shadow-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-deep-blue-10 bg-light-sand/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-soft rounded-lg flex items-center justify-center">
              <Bot className="text-brand-petrol" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-deep-blue-80">默认大语言模型</h3>
              <p className="text-sm text-deep-blue-40 mt-0.5">选择工作区使用的默认模型</p>
            </div>
          </div>
        </div>
        <div className="p-5">
          <Select
            label=""
            value={selectedModel}
            options={llmOptions}
            onChange={setSelectedModel}
            allowSearch={true}
          />
        </div>

        <div className="px-5 py-4 border-t border-deep-blue-10 bg-light-sand/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-soft rounded-lg flex items-center justify-center">
              <Radio className="text-brand-petrol" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-deep-blue-80">检索策略</h3>
              <p className="text-sm text-deep-blue-40 mt-0.5">配置知识库和搜索的优先级</p>
            </div>
          </div>
        </div>
        <div className="px-5 pb-5 pt-3 space-y-2">
          {ragStrategyOptions.map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-3 p-3.5 rounded-lg border-2 cursor-pointer transition-all ${
                selectedRagStrategy === option.value
                  ? 'border-brand-petrol bg-primary-soft/60'
                  : 'border-deep-blue-10 hover:border-deep-blue-30 hover:bg-light-sand'
              }`}
            >
              <div className={`relative w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                selectedRagStrategy === option.value ? 'border-brand-petrol' : 'border-deep-blue-30'
              }`}>
                {selectedRagStrategy === option.value && (
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-petrol" />
                )}
              </div>
              <div className="flex-1">
                <div className={`text-sm font-semibold ${
                  selectedRagStrategy === option.value ? 'text-brand-petrol-dark' : 'text-deep-blue-80'
                }`}>
                  {option.label}
                </div>
                <div className="text-xs text-deep-blue-40 mt-0.5">{option.description}</div>
              </div>
              <input
                type="radio"
                name="rag-strategy"
                value={option.value}
                checked={selectedRagStrategy === option.value}
                onChange={(e) => setSelectedRagStrategy(e.target.value)}
                className="sr-only"
              />
            </label>
          ))}
        </div>

        <div className="px-5 py-4 border-t border-deep-blue-10 bg-light-sand/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-green/20 rounded-lg flex items-center justify-center">
              <Globe className="text-dark-green" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-deep-blue-80">联网搜索</h3>
              <p className="text-sm text-deep-blue-40 mt-0.5">控制用户是否可以使用联网搜索</p>
            </div>
          </div>
        </div>
        <div className="px-5 pb-5 pt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label
              className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all text-sm border-2 ${
                webSearchEnabled ? 'bg-brand-green/20 text-dark-green border-green' : 'bg-light-sand text-deep-blue-60 border-deep-blue-10 hover:bg-bright-sand hover:border-deep-blue-20'
              }`}
            >
              <input
                type="radio"
                name="web-search"
                checked={webSearchEnabled}
                onChange={() => setWebSearchEnabled(true)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                webSearchEnabled ? 'border-green' : 'border-deep-blue-30'
              }`}>
                {webSearchEnabled && <div className="w-2 h-2 rounded-full bg-green" />}
              </div>
              <span className="font-semibold">启用</span>
            </label>
            <label
              className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all text-sm border-2 ${
                !webSearchEnabled ? 'bg-red-light text-red border-red' : 'bg-light-sand text-deep-blue-60 border-deep-blue-10 hover:bg-bright-sand hover:border-deep-blue-20'
              }`}
            >
              <input
                type="radio"
                name="web-search"
                checked={!webSearchEnabled}
                onChange={() => setWebSearchEnabled(false)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                !webSearchEnabled ? 'border-red' : 'border-deep-blue-30'
              }`}>
                {!webSearchEnabled && <div className="w-2 h-2 rounded-full bg-red" />}
              </div>
              <span className="font-semibold">禁用</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button className="px-4 py-2 text-sm text-deep-blue-60 font-medium rounded-lg hover:bg-light-sand transition-colors border border-deep-blue-10 bg-white">
          取消
        </button>
        <button className="px-4 py-2 bg-brand-petrol text-white text-sm font-medium rounded-lg hover:bg-brand-petrol-dark active:bg-primary-700 transition-all shadow-soft">
          保存设置
        </button>
      </div>
    </div>
  );
}
