import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  version?: string;
}

interface SelectProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  allowSearch?: boolean;
}

export default function Select({
  label,
  value,
  options,
  onChange,
  placeholder = '请选择',
  allowSearch = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  const filteredOptions = allowSearch
    ? options.filter(opt =>
        opt.label.toLowerCase().includes(searchValue.toLowerCase()) ||
        opt.value.toLowerCase().includes(searchValue.toLowerCase())
      )
    : options;

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
      setIsOpen(false);
      setSearchValue('');
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchValue('');
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-deep-blue-60">{label}</label>}
      <div ref={selectRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 bg-white border-2 border-deep-blue-20 rounded-lg text-left flex items-center justify-between hover:border-deep-blue-40 focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-brand-petrol transition-all"
        >
          {selectedOption ? (
            <div className="flex items-center gap-3">
              {selectedOption.icon && <span className="text-lg">{selectedOption.icon}</span>}
              <div>
                <div className="font-medium text-deep-blue-80">{selectedOption.label}</div>
                {selectedOption.version && (
                  <div className="text-xs text-deep-blue-40">版本: {selectedOption.version}</div>
                )}
              </div>
            </div>
          ) : (
            <span className="text-deep-blue-40">{placeholder}</span>
          )}
          <ChevronDown
            size={20}
            className={`text-deep-blue-40 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border-2 border-deep-blue-20 rounded-lg shadow-card overflow-hidden">
            {allowSearch && (
              <div className="p-2 border-b border-deep-blue-10">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-deep-blue-40" />
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="搜索..."
                    className="w-full pl-9 pr-9 py-2 text-sm border border-deep-blue-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-brand-petrol"
                  />
                  {searchValue && (
                    <button
                      onClick={() => setSearchValue('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-deep-blue-40 hover:text-deep-blue-60"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-light-sand transition-colors ${
                      option.value === value ? 'bg-primary-soft' : ''
                    }`}
                  >
                    {option.icon && <span className="text-lg">{option.icon}</span>}
                    <div>
                      <div className={`font-medium ${option.value === value ? 'text-brand-petrol' : 'text-deep-blue-80'}`}>
                        {option.label}
                      </div>
                      {option.version && (
                        <div className="text-xs text-deep-blue-40">版本: {option.version}</div>
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-deep-blue-40">
                  未找到匹配的选项
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
