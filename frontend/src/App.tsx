import { useState } from 'react'
import Topbar from './components/layout/Topbar'
import Sidebar from './components/layout/Sidebar'
import CanvasBoard from './components/canvas/CanvasBoard'
import PropertiesPanel from './components/panels/PropertiesPanel'

function App() {
  const [activeView, setActiveView] = useState('canvas')

  return (
    <div className="flex h-screen w-screen flex-col bg-[#0e0e12] text-zinc-100">
      <Topbar activeView={activeView} onViewChange={setActiveView} />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="min-w-0 flex-1">
          {activeView === 'canvas' ? (
            <CanvasBoard />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">
              Visualização "{activeView}" ainda não implementada nesta versão.
            </div>
          )}
        </main>
        <PropertiesPanel />
      </div>
    </div>
  )
}

export default App
