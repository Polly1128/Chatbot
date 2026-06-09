import {
  Bot,
  Database,
  ChevronRight,
  BarChart3,
  ExternalLink,
  Sparkles,
  FileQuestion,
  Palette,
  Shield,
  FileText,
  Users,
  LayoutDashboard,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const quickLinks = [
  { title: 'Agent 管理', desc: '创建和管理 AI Agent', icon: Bot, color: 'petrol', link: '/agents' },
  { title: '知识管理', desc: '管理知识库和数据产品', icon: Database, color: 'green', link: '/knowledge/products' },
  { title: '模型配置', desc: '配置默认模型和检索策略', icon: Sparkles, color: 'blue', link: '/settings/model' },
  { title: '权限设置', desc: '管理工作区访问权限', icon: Shield, color: 'orange', link: '/settings/permission' },
  { title: '样式配置', desc: '自定义 Agent 回复样式', icon: Palette, color: 'purple', link: '/settings/style' },
  { title: 'FAQ 配置', desc: '管理常见问题和答案', icon: FileQuestion, color: 'deep', link: '/settings/faq' },
  { title: '使用日志', desc: '查看用户使用日志记录', icon: FileText, color: 'teal', link: '/analytics/logs' },
  { title: 'Agent Skill', desc: '配置 Agent 的技能和方法论', icon: Sparkles, color: 'cyan', link: '/skills' },
  { title: '用户管理', desc: '管理工作区用户和角色', icon: Users, color: 'amber', link: '/users' },
]

const colorClasses: Record<string, { bg: string; text: string; hover: string; hoverBorder: string; ring: string }> = {
  petrol: { bg: 'bg-primary-soft', text: 'text-brand-petrol', hover: 'hover:bg-primary-soft', hoverBorder: 'hover:border-brand-petrol/40', ring: 'ring-brand-petrol' },
  green: { bg: 'bg-brand-green/25', text: 'text-green', hover: 'hover:bg-brand-green/30', hoverBorder: 'hover:border-green/40', ring: 'ring-green' },
  blue: { bg: 'bg-light-petrol/25', text: 'text-dark-blue', hover: 'hover:bg-light-petrol/30', hoverBorder: 'hover:border-light-petrol/40', ring: 'ring-dark-blue' },
  orange: { bg: 'bg-orange/25', text: 'text-dark-orange', hover: 'hover:bg-orange/30', hoverBorder: 'hover:border-orange/40', ring: 'ring-dark-orange' },
  purple: { bg: 'bg-soft-purple/40', text: 'text-dark-purple', hover: 'hover:bg-soft-purple/50', hoverBorder: 'hover:border-purple/40', ring: 'ring-dark-purple' },
  deep: { bg: 'bg-bright-sand', text: 'text-deep-blue-80', hover: 'hover:bg-bright-sand', hoverBorder: 'hover:border-deep-blue-20', ring: 'ring-deep-blue-60' },
  teal: { bg: 'bg-light-petrol/20', text: 'text-brand-petrol-dark', hover: 'hover:bg-light-petrol/25', hoverBorder: 'hover:border-light-petrol/30', ring: 'ring-brand-petrol' },
  cyan: { bg: 'bg-soft-green/30', text: 'text-dark-green', hover: 'hover:bg-soft-green/40', hoverBorder: 'hover:border-soft-green/40', ring: 'ring-dark-green' },
  amber: { bg: 'bg-soft-yellow/50', text: 'text-dark-yellow', hover: 'hover:bg-soft-yellow/60', hoverBorder: 'hover:border-yellow/40', ring: 'ring-dark-yellow' },
}

export default function Dashboard() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-gradient-petrol-bold rounded-xl flex items-center justify-center shadow-soft">
          <LayoutDashboard size={20} className="text-deep-blue-80" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-deep-blue-80 tracking-tight">欢迎使用小禹管理后台</h1>
          <p className="text-sm text-deep-blue-40">管理和配置您的 AI 工作区</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary-soft via-light-sand to-brand-green/15 rounded-xl border border-deep-blue-10 shadow-soft p-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-lg shadow-soft flex items-center justify-center shrink-0">
            <BarChart3 className="text-brand-petrol" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-deep-blue-80 mb-1">使用数据分析报告</h3>
            <p className="text-sm text-deep-blue-60 whitespace-nowrap">
              使用统计、性能指标和分析数据已整合至 PowerBI，请点击下方按钮前往查看详细分析报告
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://app.powerbi.com/groups/me/workspaces"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-petrol text-white rounded-lg text-sm font-medium hover:bg-brand-petrol-dark transition-colors shadow-soft"
            >
              <ExternalLink size={14} />
              打开 PowerBI Workspace
            </a>
            <NavLink
              to="/analytics/logs"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-deep-blue-80 rounded-lg text-sm font-medium border border-deep-blue-10 hover:bg-light-sand hover:border-deep-blue-20 transition-colors shadow-soft"
            >
              <FileText size={14} />
              查看原始日志
            </NavLink>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-deep-blue-10 shadow-soft">
        <div className="flex items-center justify-between px-5 py-4 border-b border-deep-blue-10">
          <div>
            <h3 className="text-base font-semibold text-deep-blue-80">常用功能</h3>
            <p className="text-xs text-deep-blue-40 mt-0.5">快速访问管理后台的核心功能</p>
          </div>
          <span className="text-xs text-deep-blue-40">{quickLinks.length} 项功能</span>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickLinks.map((item, index) => {
              const colors = colorClasses[item.color]
              const IconComponent = item.icon
              return (
                <NavLink
                  key={index}
                  to={item.link}
                  className={`flex items-center gap-3 p-3.5 bg-white rounded-lg border border-deep-blue-10 hover:shadow-soft transition-all cursor-pointer group ${colors.hover} ${colors.hoverBorder}`}
                >
                  <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center shrink-0 group-hover:shadow-soft transition-shadow`}>
                    <IconComponent className={colors.text} size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-deep-blue-80">{item.title}</h4>
                    <p className="text-xs text-deep-blue-40 truncate">{item.desc}</p>
                  </div>
                  <ChevronRight className="text-deep-blue-20 group-hover:text-deep-blue-40 shrink-0" size={16} />
                </NavLink>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
