import { useState } from 'react';
import { ImageIcon, MessageSquare, Palette } from 'lucide-react';
import LogoUploader from '../components/LogoUploader';
import WelcomeMessage from '../components/WelcomeMessage';
import FAQManager, { FAQItem } from '../components/FAQManager';

const initialFaqs: FAQItem[] = [
  {
    id: 'faq-1',
    questionZh: '如何申请新客户权限？',
    questionEn: 'How to apply for new customer permissions?',
    answerZh: '请联系您的上级主管提交权限申请，审批通过后将自动生效。',
    answerEn: 'Please contact your supervisor to submit a permission request. It will take effect automatically after approval.',
    enabled: true,
  },
  {
    id: 'faq-2',
    questionZh: '销售数据更新频率是？',
    questionEn: 'What is the sales data update frequency?',
    answerZh: '销售数据每日凌晨 2:00 自动更新，包含前一天的所有交易记录。',
    answerEn: 'Sales data is automatically updated daily at 2:00 AM, including all transactions from the previous day.',
    enabled: true,
  },
  {
    id: 'faq-3',
    questionZh: '如何导出报表？',
    questionEn: 'How to export reports?',
    answerZh: '在报表页面点击右上角的「导出」按钮，支持 Excel 和 PDF 格式。',
    answerEn: 'Click the "Export" button in the top right corner of the report page. Excel and PDF formats are supported.',
    enabled: false,
  },
  {
    id: 'faq-4',
    questionZh: '联系技术支持的方式？',
    questionEn: 'How to contact technical support?',
    answerZh: '您可以通过左侧菜单的「帮助中心」提交工单，我们会在 24 小时内回复。',
    answerEn: 'You can submit a ticket through the "Help Center" in the left menu. We will respond within 24 hours.',
    enabled: true,
  },
];

export default function StyleSettings() {
  const [logo, setLogo] = useState<string | null>(null);
  const [welcomeZh, setWelcomeZh] = useState('欢迎来到 {username} 的销售工作区\n在这里你可以获取最新的销售数据和 insights，如有任何问题请随时联系管理员。');
  const [welcomeEn, setWelcomeEn] = useState('Welcome to {username}\'s Sales Workspace\nHere you can access the latest sales data and insights. Please contact the administrator if you have any questions.');
  const [faqs, setFaqs] = useState<FAQItem[]>(initialFaqs);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-gradient-petrol-soft rounded-xl flex items-center justify-center shadow-soft">
          <Palette size={20} className="text-deep-blue-80" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-deep-blue-80 tracking-tight">样式配置</h1>
          <p className="text-sm text-deep-blue-40">自定义工作区在前端的展示样式</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-deep-blue-10 shadow-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-deep-blue-10 bg-light-sand/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-soft rounded-lg flex items-center justify-center">
              <Palette className="text-brand-petrol" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-deep-blue-80">基础外观</h3>
              <p className="text-sm text-deep-blue-40 mt-0.5">配置 Logo 和欢迎语</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 p-5">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="text-dark-purple" size={16} />
              <span className="text-sm font-medium text-deep-blue-80">Logo 配置</span>
            </div>
            <LogoUploader currentLogo={logo} onLogoChange={setLogo} />
          </div>
          <div className="md:col-span-3">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="text-brand-petrol" size={16} />
              <span className="text-sm font-medium text-deep-blue-80">欢迎语</span>
            </div>
            <WelcomeMessage
              chineseText={welcomeZh}
              englishText={welcomeEn}
              onChineseChange={setWelcomeZh}
              onEnglishChange={setWelcomeEn}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-deep-blue-10 shadow-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-deep-blue-10 bg-light-sand/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-light-petrol/25 rounded-lg flex items-center justify-center">
                <MessageSquare className="text-dark-blue" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-deep-blue-80">常见问题 (FAQ)</h3>
                <p className="text-sm text-deep-blue-40 mt-0.5">配置前端展示的常见问题列表</p>
              </div>
            </div>
            <span className="text-xs text-deep-blue-40">{faqs.length} 项</span>
          </div>
        </div>
        <div className="p-5">
          <FAQManager faqs={faqs} onFaqsChange={setFaqs} />
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
