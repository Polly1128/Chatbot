import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import ChatBot from './pages/ChatBot'
import Dashboard from './pages/Dashboard'
import PermissionSettings from './pages/PermissionSettings'
import ModelSettings from './pages/ModelSettings'
import StyleSettings from './pages/StyleSettings'
import AgentManagement from './pages/AgentManagement'
import SkillManagement from './pages/SkillManagement'
import DataProducts from './pages/DataProducts'
import UsageLogs from './pages/UsageLogs'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ChatBot 首页 - 不需要 MainLayout */}
        <Route path="/" element={<ChatBot />} />
        
        {/* 后台管理页面 - 使用 MainLayout */}
        <Route path="/admin" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="settings/permission" element={<PermissionSettings />} />
          <Route path="settings/model" element={<ModelSettings />} />
          <Route path="customize/style" element={<StyleSettings />} />
          <Route path="agents" element={<AgentManagement />} />
          <Route path="agent-skill" element={<SkillManagement />} />
          <Route path="knowledge/products" element={<DataProducts />} />
          <Route path="analytics/logs" element={<UsageLogs />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
        
        {/* 重定向到首页 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
