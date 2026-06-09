import { useState } from 'react';
import { Globe, Lock, User, Building2, Globe2, Info, Shield } from 'lucide-react';
import Toggle from '../components/Toggle';
import MultiSelectInput from '../components/MultiSelectInput';

export default function PermissionSettings() {
  const [isPublic, setIsPublic] = useState(false);
  
  // Mock data - 实际应用中应从 API 获取
  const [emailUsers, setEmailUsers] = useState<string[]>([
    'zhangsan@example.com',
    'lisi@example.com',
    'wangwu@example.com',
    'zhuliu@example.com',
    'sunqi@example.com',
  ]);
  
  const [departments, setDepartments] = useState<string[]>([
    'Sales.DE',
    'Marketing.CN',
    'IT.Global',
  ]);
  
  const [ares, setAres] = useState<string[]>([
    'APAC',
    'EMEA',
  ]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-gradient-to-br from-slate-500 to-gray-600 rounded-xl flex items-center justify-center shadow-soft">
          <Shield size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-deep-blue-80 tracking-tight">权限设置</h1>
          <p className="text-sm text-deep-blue-40">配置工作区的访问权限和可见范围</p>
        </div>
      </div>

      {/* Public/Private Toggle */}
      <div className="bg-white rounded-xl border border-deep-blue-10 shadow-soft p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isPublic ? (
              <div className="w-12 h-12 bg-brand-green/25 rounded-xl flex items-center justify-center">
                <Globe className="text-green" size={24} />
              </div>
            ) : (
              <div className="w-12 h-12 bg-light-sand rounded-xl flex items-center justify-center">
                <Lock className="text-deep-blue-60" size={24} />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-deep-blue-80 text-lg">
                {isPublic ? '公开工作区' : '私有工作区'}
              </h3>
              <p className="text-sm text-deep-blue-40 mt-0.5">
                {isPublic
                  ? '所有小禹用户均可搜索并访问该 workspace'
                  : '仅可见名单中的用户可访问'}
              </p>
            </div>
          </div>
          <Toggle
            checked={isPublic}
            onChange={setIsPublic}
          />
        </div>
      </div>

      {/* Private Workspace Configuration */}
      {!isPublic && (
        <div>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-primary-soft rounded-lg flex items-center justify-center">
              <Info className="text-brand-petrol" size={16} />
            </div>
            <span className="text-sm text-brand-petrol font-medium">私有 workspace 可见范围配置</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* By Email */}
            <MultiSelectInput
              label="按用户邮箱"
              placeholder="输入邮箱地址，支持逗号、分号或换行分隔"
              items={emailUsers}
              onItemsChange={setEmailUsers}
              variant="email"
              icon={<User className="text-emerald-500" size={20} />}
            />
            
            {/* By Department */}
            <MultiSelectInput
              label="按部门后缀"
              placeholder="输入部门后缀，如 Sales.DE"
              items={departments}
              onItemsChange={setDepartments}
              variant="department"
              icon={<Building2 className="text-dark-yellow" size={20} />}
            />
            
            {/* By ARE */}
            <MultiSelectInput
              label="按ARE"
              placeholder="输入 ARE，如 APAC, EMEA"
              items={ares}
              onItemsChange={setAres}
              variant="are"
              icon={<Globe2 className="text-dark-purple" size={20} />}
            />
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3">
        <button className="px-5 py-2.5 text-deep-blue-60 font-medium rounded-lg hover:bg-light-sand transition-colors">
          取消
        </button>
        <button className="px-5 py-2.5 bg-brand-petrol text-white font-medium rounded-lg hover:bg-brand-petrol active:bg-brand-petrol-dark transition-all shadow-soft">
          保存设置
        </button>
      </div>
    </div>
  );
}
