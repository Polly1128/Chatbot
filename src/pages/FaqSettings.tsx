import { HelpCircle } from 'lucide-react';

export default function FaqSettings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center shadow-soft">
          <HelpCircle size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-deep-blue-80 tracking-tight">FAQ配置</h1>
          <p className="text-sm text-deep-blue-40">配置常见问题解答</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-soft border border-deep-blue-10 p-8">
        <div className="text-center text-deep-blue-40 py-12">
          <p className="text-lg">FAQ配置页面</p>
          <p className="text-sm mt-2">即将上线...</p>
        </div>
      </div>
    </div>
  )
}
