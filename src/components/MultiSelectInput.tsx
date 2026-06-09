import { useState, useRef, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import Tag from './Tag';

interface MultiSelectInputProps {
  label: string;
  placeholder: string;
  items: string[];
  onItemsChange: (items: string[]) => void;
  variant?: 'email' | 'department' | 'are';
  icon: React.ReactNode;
}

export default function MultiSelectInput({
  label,
  placeholder,
  items,
  onItemsChange,
  variant = 'email',
  icon,
}: MultiSelectInputProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleAdd = () => {
    if (!value.trim()) return;

    const newItems = value
      .split(/[,;\n]/)
      .map(item => item.trim())
      .filter(item => item && !items.includes(item));

    if (newItems.length > 0) {
      onItemsChange([...items, ...newItems]);
    }
    setValue('');
  };

  const handleRemove = (itemToRemove: string) => {
    onItemsChange(items.filter(item => item !== itemToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    } else if (e.key === 'Backspace' && !value && items.length > 0) {
      onItemsChange(items.slice(0, -1));
    }
  };

  const handleClearAll = () => {
    onItemsChange([]);
  };

  return (
    <div className="bg-white rounded-xl border border-deep-blue-10 p-5 hover:border-deep-blue-20 transition-colors">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">{icon}</span>
        <h3 className="font-semibold text-deep-blue-80">{label}</h3>
      </div>

      {/* Input Field */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 border border-deep-blue-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent transition-all"
      />

      {/* Items Count */}
      <div className="mt-3 text-sm text-deep-blue-40">
        已添加: <span className="font-medium text-deep-blue-80">{items.length}</span> 个
      </div>

      {/* Tags */}
      {items.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((item) => (
            <Tag
              key={item}
              label={item}
              onRemove={() => handleRemove(item)}
              variant={variant}
            />
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-petrol text-white text-sm font-medium rounded-lg hover:bg-brand-petrol transition-colors"
        >
          <Plus size={16} />
          确认添加
        </button>
        
        {items.length > 0 && (
          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-deep-blue-40 text-sm hover:text-red hover:bg-red-light rounded-lg transition-colors"
          >
            <X size={14} />
            清空全部
          </button>
        )}
      </div>
    </div>
  );
}
