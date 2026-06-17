import { useState, useRef, useEffect, useCallback } from 'react';
import { X, MapPin, Briefcase, Heart, BookOpen, Phone, MessageSquare, User } from 'lucide-react';
import Toggle from './Toggle';
import Tag from './Tag';

// ============================================
// 选项常量
// ============================================
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

// ============================================
// MultiSelectDropdown 组件
// ============================================
interface MultiSelectDropdownProps {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  icon: React.ReactNode;
  variant?: 'default' | 'email' | 'department' | 'are';
}

function MultiSelectDropdown({
  label,
  options,
  selected,
  onChange,
  placeholder = '请选择',
  icon,
  variant = 'default',
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleRemove = (value: string) => {
    onChange(selected.filter(v => v !== value));
  };

  const selectedLabels = selected.map(
    v => options.find(opt => opt.value === v)?.label || v
  );

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-deep-blue-60">
        <span className="text-brand-petrol">{icon}</span>
        {label}
      </label>
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2.5 bg-white border border-deep-blue-20 rounded-lg text-left flex items-center justify-between hover:border-deep-blue-40 focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-brand-petrol transition-all"
        >
          <span className="text-deep-blue-40 text-sm truncate">
            {selected.length > 0 ? `已选择 ${selected.length} 项` : placeholder}
          </span>
          <svg
            className={`w-4 h-4 text-deep-blue-40 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-deep-blue-20 rounded-lg shadow-card overflow-hidden">
            <div className="max-h-48 overflow-y-auto p-1">
              {options.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleToggle(option.value)}
                  className={`w-full px-3 py-2 text-left text-sm rounded-md flex items-center gap-2 transition-colors ${
                    selected.includes(option.value)
                      ? 'bg-primary-soft text-brand-petrol font-medium'
                      : 'text-deep-blue-60 hover:bg-light-sand'
                  }`}
                >
                  <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    selected.includes(option.value)
                      ? 'bg-brand-petrol border-brand-petrol'
                      : 'border-deep-blue-20'
                  }`}>
                    {selected.includes(option.value) && (
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

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {selected.map(value => {
            const opt = options.find(o => o.value === value);
            return (
              <Tag
                key={value}
                label={opt?.label || value}
                onRemove={() => handleRemove(value)}
                variant={variant}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================
// ProfileModal 组件
// ============================================
interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [location, setLocation] = useState('');
  const [expertise, setExpertise] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [knowledge, setKnowledge] = useState<string[]>([]);
  const [phone, setPhone] = useState('');
  const [memoryEnabled, setMemoryEnabled] = useState(false);
  const [bio, setBio] = useState('');

  const backdropRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  const handleSave = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-start justify-end bg-black/30 backdrop-blur-sm"
    >
      <div
        className="mt-[56px] mr-4 w-[420px] max-h-[calc(100vh-80px)] bg-white rounded-xl border border-deep-blue-10 shadow-card overflow-hidden flex flex-col animate-slide-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-deep-blue-10 bg-gradient-to-r from-primary-soft/50 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-petrol-bold rounded-full flex items-center justify-center shadow-soft">
              <User size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-deep-blue-80">个人资料</h3>
              <p className="text-xs text-deep-blue-40">配置您的个人信息和偏好</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-deep-blue-40 hover:text-deep-blue-80 hover:bg-light-sand rounded-lg transition-colors"
          >
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
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-deep-blue-20 rounded-lg text-sm text-deep-blue-80 hover:border-deep-blue-40 focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-brand-petrol transition-all appearance-none cursor-pointer"
            >
              <option value="">请选择城市</option>
              {LOCATION_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* 专业领域 - 多选下拉 */}
          <MultiSelectDropdown
            label="专业领域"
            options={EXPERTISE_OPTIONS}
            selected={expertise}
            onChange={setExpertise}
            placeholder="请选择专业领域"
            icon={<Briefcase size={16} />}
            variant="department"
          />

          {/* 兴趣 - 多选下拉 */}
          <MultiSelectDropdown
            label="兴趣"
            options={INTEREST_OPTIONS}
            selected={interests}
            onChange={setInterests}
            placeholder="请选择兴趣方向"
            icon={<Heart size={16} />}
            variant="are"
          />

          {/* 专业知识 - 多选下拉 */}
          <MultiSelectDropdown
            label="专业知识"
            options={KNOWLEDGE_OPTIONS}
            selected={knowledge}
            onChange={setKnowledge}
            placeholder="请选择专业知识领域"
            icon={<BookOpen size={16} />}
            variant="default"
          />

          {/* 电话号码 */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-deep-blue-60">
              <Phone size={16} className="text-brand-petrol" />
              电话号码
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
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
              <Toggle checked={memoryEnabled} onChange={setMemoryEnabled} />
            </div>
          </div>

          {/* 个人简介 */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-deep-blue-60">
              <User size={16} className="text-brand-petrol" />
              个人简介
            </label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="请输入个人简介，帮助AI更好地了解您的背景和需求，提供更贴合的个性化回答..."
              rows={4}
              className="w-full px-4 py-2.5 bg-white border border-deep-blue-20 rounded-lg text-sm text-deep-blue-80 placeholder-deep-blue-40 hover:border-deep-blue-40 focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-brand-petrol transition-all resize-none"
            />
            <p className="text-xs text-deep-blue-40 text-right">{bio.length}/500</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-deep-blue-10 bg-light-sand/30">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-deep-blue-60 hover:text-deep-blue-80 hover:bg-light-sand rounded-lg border border-deep-blue-10 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-sm font-medium text-white bg-brand-petrol hover:bg-brand-petrol-dark rounded-lg transition-colors shadow-soft"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
