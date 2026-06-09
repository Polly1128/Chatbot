import { useState } from 'react';
import { ChevronDown, ChevronUp, Edit2, GripVertical, Plus, X } from 'lucide-react';

export interface FAQItem {
  id: string;
  questionZh: string;
  questionEn: string;
  answerZh: string;
  answerEn: string;
  enabled: boolean;
}

interface FAQManagerProps {
  faqs: FAQItem[];
  onFaqsChange: (faqs: FAQItem[]) => void;
}

export default function FAQManager({ faqs, onFaqsChange }: FAQManagerProps) {
  const [expandedId, setExpandedId] = useState<string | null>(faqs[0]?.id || null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeLang, setActiveLang] = useState<'zh' | 'en'>('zh');

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleToggleEnable = (id: string) => {
    onFaqsChange(
      faqs.map((faq) =>
        faq.id === id ? { ...faq, enabled: !faq.enabled } : faq
      )
    );
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleSaveEdit = () => {
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleQuestionChange = (id: string, lang: 'zh' | 'en', value: string) => {
    onFaqsChange(
      faqs.map((faq) =>
        faq.id === id ? { ...faq, [`question${lang === 'zh' ? 'Zh' : 'En'}`]: value } : faq
      )
    );
  };

  const handleAnswerChange = (id: string, lang: 'zh' | 'en', value: string) => {
    onFaqsChange(
      faqs.map((faq) =>
        faq.id === id ? { ...faq, [`answer${lang === 'zh' ? 'Zh' : 'En'}`]: value } : faq
      )
    );
  };

  const handleAdd = () => {
    const newFaq: FAQItem = {
      id: `faq-${Date.now()}`,
      questionZh: '',
      questionEn: '',
      answerZh: '',
      answerEn: '',
      enabled: true,
    };
    onFaqsChange([...faqs, newFaq]);
    setExpandedId(newFaq.id);
    setEditingId(newFaq.id);
  };

  const handleDelete = (id: string) => {
    onFaqsChange(faqs.filter((faq) => faq.id !== id));
    if (expandedId === id) setExpandedId(faqs.find((f) => f.id !== id)?.id || null);
    if (editingId === id) setEditingId(null);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('index', String(index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('index'));
    if (sourceIndex !== targetIndex) {
      const newFaqs = [...faqs];
      const [removed] = newFaqs.splice(sourceIndex, 1);
      newFaqs.splice(targetIndex, 0, removed);
      onFaqsChange(newFaqs);
    }
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-deep-blue-40">常见问题 (FAQ)</span>
          <span className="text-xs px-2 py-0.5 bg-light-sand text-deep-blue-40 rounded-full">
            {faqs.length} 个
          </span>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-petrol text-white text-sm font-medium rounded-lg hover:bg-brand-petrol transition-colors"
        >
          <Plus size={14} />
          添加FAQ
        </button>
      </div>

      {/* FAQ List */}
      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <div
            key={faq.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className="bg-white border border-deep-blue-10 rounded-lg overflow-hidden"
          >
            {/* FAQ Header */}
            <div
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-light-sand transition-colors"
              onClick={() => !editingId && handleToggleExpand(faq.id)}
            >
              <GripVertical size={16} className="text-deep-blue-40 cursor-grab" />
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleExpand(faq.id);
                }}
                className="p-1 hover:bg-light-sand rounded transition-colors"
              >
                {expandedId === faq.id ? (
                  <ChevronUp size={18} className="text-deep-blue-40" />
                ) : (
                  <ChevronDown size={18} className="text-deep-blue-40" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-deep-blue-80">
                    {index + 1}. {activeLang === 'zh' ? faq.questionZh : faq.questionEn || '未设置'}
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleEnable(faq.id);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  faq.enabled
                    ? 'bg-brand-green/25 text-dark-green hover:bg-brand-green/30'
                    : 'bg-light-sand text-deep-blue-40 hover:bg-deep-blue-10'
                }`}
              >
                {faq.enabled ? '启用' : '禁用'}
              </button>

              {editingId === faq.id ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveEdit();
                    }}
                    className="p-1.5 text-green hover:bg-brand-green/20 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelEdit();
                    }}
                    className="p-1.5 text-deep-blue-40 hover:bg-light-sand rounded-lg transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(faq.id);
                  }}
                  className="p-1.5 text-deep-blue-40 hover:text-brand-petrol hover:bg-primary-soft rounded-lg transition-colors"
                >
                  <Edit2 size={16} />
                </button>
              )}

              {faqs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(faq.id);
                  }}
                  className="p-1.5 text-deep-blue-40 hover:text-red hover:bg-red-light rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* FAQ Content */}
            {expandedId === faq.id && (
              <div className="px-4 pb-4">
                {/* Language Tabs */}
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveLang('zh');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      activeLang === 'zh'
                        ? 'bg-brand-petrol text-white'
                        : 'bg-light-sand text-deep-blue-60 hover:bg-deep-blue-10'
                    }`}
                  >
                    中文
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveLang('en');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      activeLang === 'en'
                        ? 'bg-brand-petrol text-white'
                        : 'bg-light-sand text-deep-blue-60 hover:bg-deep-blue-10'
                    }`}
                  >
                    English
                  </button>
                </div>

                {editingId === faq.id ? (
                  <div className="space-y-3">
                    {/* Question Input */}
                    <input
                      type="text"
                      value={activeLang === 'zh' ? faq.questionZh : faq.questionEn}
                      onChange={(e) =>
                        handleQuestionChange(faq.id, activeLang, e.target.value)
                      }
                      placeholder={activeLang === 'zh' ? '输入问题...' : 'Enter question...'}
                      className="w-full px-3 py-2 border border-deep-blue-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent"
                    />

                    {/* Answer Input */}
                    <textarea
                      value={activeLang === 'zh' ? faq.answerZh : faq.answerEn}
                      onChange={(e) =>
                        handleAnswerChange(faq.id, activeLang, e.target.value)
                      }
                      placeholder={activeLang === 'zh' ? '输入回答（支持 Markdown）...' : 'Enter answer (Markdown supported)...'}
                      rows={4}
                      className="w-full px-3 py-2 border border-deep-blue-10 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-petrol focus:border-transparent"
                    />
                  </div>
                ) : (
                  <div className="pl-8 space-y-2">
                    <div className="text-sm text-deep-blue-80 font-medium">
                      {activeLang === 'zh' ? faq.questionZh : faq.questionEn || '未设置'}
                    </div>
                    <div className="text-sm text-deep-blue-60 whitespace-pre-wrap">
                      {activeLang === 'zh' ? faq.answerZh : faq.answerEn || '未设置'}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
