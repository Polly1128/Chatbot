# Dayu Admin (大禹后台配置管理系统)

大禹 AI 智能助手后台配置管理系统，基于 Siemens 品牌设计规范构建，提供 ChatBot 前端交互界面和后台管理配置功能。

## 功能概览

### ChatBot 前端 (`/`)

- **多工作区切换**：支持 Siemens China、SAP、AskIT 等工作区，每个工作区有独立的推荐问题和知识范围
- **智能体发现与选择**：浏览和选择不同类型的 Agent（通用助手、AskData Agent 等）
- **AI Skill 自动匹配**：根据用户输入自动匹配并激活对应的 Agent Skill（销售数据分析、文档总结、代码审查、翻译、问题解答等）
- **多模型选择**：支持 DeepSeek R1、GPT-4 Turbo、Claude 3 Sonnet 等模型切换
- **推荐文档**：工作区关联的文档推荐与浏览
- **历史对话**：对话历史记录管理
- **文件上传**：支持图片、PDF 等多种文件上传
- **联网搜索**：可切换联网搜索模式
- **个人设置**：用户 Profile 管理、语言切换、默认模型配置

### 后台管理 (`/admin`)

| 模块 | 路径 | 功能 |
|------|------|------|
| 首页 | `/admin` | 管理仪表盘概览 |
| 权限设置 | `/admin/settings/permission` | 工作区权限与成员管理 |
| 模型配置 | `/admin/settings/model` | AI 模型参数与接入配置 |
| 样式配置 | `/admin/customize/style` | ChatBot 前端样式定制（Logo、配色、FAQ 等） |
| Agent 管理 | `/admin/agents` | 智能体的创建、编辑与启停管理 |
| Agent Skill | `/admin/agent-skill` | Skill 的触发词、Prompt、参数配置 |
| 数据产品 | `/admin/knowledge/products` | 知识库与数据产品管理 |
| 使用日志 | `/admin/analytics/logs` | 用户使用情况与调用日志分析 |

## 技术栈

- **框架**：React 18 + TypeScript
- **构建工具**：Vite 5
- **路由**：React Router DOM 6
- **样式**：TailwindCSS 3 + PostCSS + Autoprefixer
- **图标**：Lucide React
- **代码规范**：ESLint 9 + TypeScript ESLint

## 项目结构

```
src/
├── components/          # 通用组件
│   ├── ui/              # 基础 UI 组件
│   ├── AccordionItem.tsx
│   ├── FAQManager.tsx   # FAQ 管理组件
│   ├── JSONEditor.tsx   # JSON 编辑器
│   ├── LogoUploader.tsx # Logo 上传组件
│   ├── MultiSelectInput.tsx
│   ├── Select.tsx
│   ├── Sidebar.tsx      # 后台侧边栏
│   ├── Tag.tsx
│   ├── Toggle.tsx
│   ├── TopBar.tsx       # 后台顶栏
│   └── WelcomeMessage.tsx
├── config/
│   └── menu.ts          # 菜单配置与面包屑逻辑
├── layouts/
│   └── MainLayout.tsx   # 后台管理布局
├── pages/
│   ├── ChatBot.tsx      # ChatBot 前端页面
│   ├── Dashboard.tsx    # 管理首页
│   ├── PermissionSettings.tsx
│   ├── ModelSettings.tsx
│   ├── StyleSettings.tsx
│   ├── AgentManagement.tsx
│   ├── SkillManagement.tsx
│   ├── DataProducts.tsx
│   └── UsageLogs.tsx
├── types/
│   └── index.ts         # TypeScript 类型定义
├── App.tsx              # 路由入口
├── index.css
└── main.tsx
```

## 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
```

## 设计规范

项目采用 **Siemens 品牌设计规范**，主要色彩定义在 `tailwind.config.js` 中：

- **品牌主色**：Siemens Petrol (`#009999`)
- **品牌强调色**：Bold Green (`#00ffb9`)、Soft Green (`#00d7a0`)
- **背景色**：Light Sand (`#f3f3f0`)
- **文字色**：Deep Blue 系列 (`#333353` ~ `#e5e5e9`)
- **警告色**：Red (`#ef0137`)、Orange (`#ff9000`)

## 类型定义

核心业务类型定义在 `src/types/index.ts` 中，包括：

- `MenuItem` — 菜单项
- `Workspace` — 工作区
- `AgentSkill` — Agent Skill（含触发条件、Prompt 模板、参数定义、使用统计）
- `SkillCategory` — Skill 分类枚举
- `SkillParameter` / `SkillTrigger` / `SkillPrompt` / `SkillUsage` — Skill 子类型
