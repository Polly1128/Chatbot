import { useState } from 'react';
import { ChevronDown, ChevronUp, Edit2 } from 'lucide-react';

interface AccordionItemProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isEditing?: boolean;
}

export default function AccordionItem({
  title,
  value,
  onChange,
  placeholder,
  isEditing = false,
}: AccordionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingState, setIsEditingState] = useState(isEditing);

  const handleEdit = () => {
    setIsEditingState(true);
    setIsExpanded(true);
  };

  const handleSave = () => {
    setIsEditingState(false);
  };

  const handleCancel = () => {
    setIsEditingState(false);
  };

  return (
    <div className="border border-deep-blue-10 rounded-lg overflow-hidden bg-white">
      <div
        className="flex items-center justify-between px-4 py-3 bg-light-sand cursor-pointer hover:bg-bright-sand transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <button className="p-1 hover:bg-deep-blue-10 rounded transition-colors">
            {isExpanded ? (
              <ChevronUp size={18} className="text-deep-blue-60" />
            ) : (
              <ChevronDown size={18} className="text-deep-blue-60" />
            )}
          </button>
          <span className="font-medium text-deep-blue-80">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {isEditingState ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave();
                }}
                className="px-3 py-1.5 text-xs font-medium text-green bg-brand-green/20 hover:bg-brand-green/30 rounded-lg transition-colors"
              >
                保存
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
                className="px-3 py-1.5 text-xs font-medium text-deep-blue-60 bg-deep-blue-10 hover:bg-bright-sand rounded-lg transition-colors"
              >
                取消
              </button>
            </>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit();
              }}
              className="p-1.5 text-brand-petrol hover:bg-primary-soft rounded-lg transition-colors"
              title="编辑"
            >
              <Edit2 size={16} />
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 bg-white">
          {isEditingState ? (
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              rows={4}
              className="w-full px-3 py-2 border border-deep-blue-20 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-brand-petrol text-deep-blue-80"
            />
          ) : value ? (
            <p className="text-sm text-deep-blue-80 whitespace-pre-wrap">{value}</p>
          ) : (
            <p className="text-sm text-deep-blue-40 italic">未配置</p>
          )}
        </div>
      )}
    </div>
  );
}
