import { useState, useCallback, useEffect } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface JSONEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function JSONEditor({ value, onChange, placeholder }: JSONEditorProps) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (value) {
      try {
        JSON.parse(value);
        setError(null);
      } catch (e) {
        setError((e as Error).message);
      }
    } else {
      setError(null);
    }
  }, [value]);

  const formatJSON = useCallback(() => {
    try {
      const parsed = JSON.parse(value);
      onChange(JSON.stringify(parsed, null, 2));
    } catch {
      // Invalid JSON, do nothing
    }
  }, [value, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-deep-blue-60">Agent Body (JSON)</span>
        <button
          onClick={formatJSON}
          disabled={!!(!value || error)}
          className="text-sm text-brand-petrol hover:text-brand-petrol-dark disabled:text-deep-blue-40 disabled:cursor-not-allowed transition-colors font-medium"
        >
          格式化
        </button>
      </div>

      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || '{\n  "key": "value"\n}'}
          className={`w-full px-4 py-3 font-mono text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
            error
              ? 'border-red/50 focus:ring-red/30 bg-red-light/20'
              : 'border-deep-blue-20 focus:ring-brand-petrol focus:border-brand-petrol bg-white text-deep-blue-80'
          }`}
          rows={6}
        />

        {error && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 text-red text-xs font-medium">
            <AlertCircle size={14} />
            <span>无效JSON</span>
          </div>
        )}

        {!error && value && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 text-green text-xs font-medium">
            <CheckCircle size={14} />
            <span>有效JSON</span>
          </div>
        )}
      </div>
    </div>
  );
}
