interface WelcomeMessageProps {
  chineseText: string;
  englishText: string;
  onChineseChange: (text: string) => void;
  onEnglishChange: (text: string) => void;
}

export default function WelcomeMessage({
  chineseText,
  englishText,
  onChineseChange,
  onEnglishChange,
}: WelcomeMessageProps) {
  const maxLength = 500;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-deep-blue-60 mb-1.5">中文</label>
          <textarea
            value={chineseText}
            onChange={(e) => onChineseChange(e.target.value)}
            placeholder="请输入欢迎语..."
            maxLength={maxLength}
            className="w-full px-3 py-2 border border-deep-blue-10 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent transition-all"
            rows={3}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-deep-blue-40">
              变量：<code className="px-1 bg-light-sand rounded text-xs">{'{username}'}</code>
            </span>
            <span className={`text-xs ${chineseText.length >= maxLength ? 'text-red' : 'text-deep-blue-40'}`}>
              {chineseText.length}/{maxLength}
            </span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-deep-blue-60 mb-1.5">English</label>
          <textarea
            value={englishText}
            onChange={(e) => onEnglishChange(e.target.value)}
            placeholder="Enter welcome message..."
            maxLength={maxLength}
            className="w-full px-3 py-2 border border-deep-blue-10 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent transition-all"
            rows={3}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-deep-blue-40">
              Var: <code className="px-1 bg-light-sand rounded text-xs">{'{username}'}</code>
            </span>
            <span className={`text-xs ${englishText.length >= maxLength ? 'text-red' : 'text-deep-blue-40'}`}>
              {englishText.length}/{maxLength}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
