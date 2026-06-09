export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
  children?: MenuItem[];
}

export interface Workspace {
  id: string;
  name: string;
  isPublic: boolean;
  memberCount: number;
  createdAt: string;
}

// ============================================
// Agent Skill 类型定义
// ============================================

export type SkillCategory =
  | 'data-analysis'       // 数据分析
  | 'document-processing'  // 文档处理
  | 'customer-service'     // 客服
  | 'operation'            // 运维
  | 'hr'                   // 人力资源
  | 'finance'              // 财务
  | 'dev'                  // 开发
  | 'other';              // 其他

export interface SkillParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  label: string;
  description?: string;
  required: boolean;
  defaultValue?: string | number | boolean;
  options?: string[];
}

export interface SkillTrigger {
  keywords: string[];
  intents: string[];
  patterns?: string[];
}

export interface SkillPrompt {
  role: string;
  methodology: string[];
  constraints: string[];
  outputFormat: string;
  examples?: { input: string; output: string }[];
}

export interface SkillUsage {
  invokedCount: number;
  successCount: number;
  lastInvokedAt?: string;
}

export interface AgentSkill {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: SkillCategory;
  status: 'enabled' | 'disabled';
  trigger: SkillTrigger;
  prompt: SkillPrompt;
  parameters: SkillParameter[];
  usage: SkillUsage;
  version: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
