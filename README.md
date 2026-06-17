# AI ChatBot & Admin Platform

AI 智能助手对话平台，包含前端 ChatBot 交互界面与后台管理系统。前端提供多工作区智能对话、AI Skill 自动匹配、个人 Profile 配置和 AI 记忆管理等功能；后台提供 Agent 管理、知识库配置、模型与样式定制等完整的运营管理能力。

## 功能概览

### ChatBot 前端 (`/`)

- **多工作区切换**：支持多工作区独立管理，每个工作区有独立的推荐问题和知识范围
- **智能体发现与选择**：浏览和选择不同类型的 Agent（通用助手、AskData Agent 等）
- **AI Skill 自动匹配**：根据用户输入自动匹配并激活对应的 Agent Skill（销售数据分析、文档总结、代码审查、翻译、问题解答等）
- **多模型选择**：支持 DeepSeek R1、GPT-4 Turbo、Claude 3 Sonnet 等模型切换
- **推荐文档**：工作区关联的文档推荐与浏览
- **历史对话**：对话历史记录管理
- **文件上传**：支持图片、PDF 等多种文件上传
- **联网搜索**：可切换联网搜索模式
- **个人设置**：用户 Profile 管理、语言切换、默认模型配置
- **增强 Profile 弹窗**：支持位置、专业领域、兴趣、专业知识、电话号码、对话记忆开关、个人简介等字段配置
- **AI 记忆管理**：查看、编辑、删除 AI 为用户生成的记忆条目，支持手动刷新同步

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
│   ├── ProfileModal.tsx # 个人 Profile 弹窗（后台管理页）
│   ├── TopBar.tsx       # 后台顶栏（含用户头像入口）
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

## Profile 与 AI 记忆

- **ChatBot 端**：点击右上角用户名打开 Profile 弹窗，支持位置、专业领域、兴趣、专业知识、电话号码、对话记忆开关、个人简介等字段配置，底部集成 AI 记忆管理（查看/编辑/删除/刷新）
- **后台管理端**：点击 TopBar 右上角用户头像打开 Profile 弹窗，包含相同的字段配置，从右侧滑入

## 设计规范

项目采用专业品牌设计规范，主要色彩定义在 `tailwind.config.js` 中：

- **品牌主色**：Petrol (`#009999`)
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
- `MemoryItem` — AI 记忆条目（id、content、category、createdAt）
