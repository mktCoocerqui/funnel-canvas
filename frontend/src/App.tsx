import { useEffect, useState } from 'react'
import Topbar from './components/layout/Topbar'
import Sidebar from './components/layout/Sidebar'
import CanvasBoard from './components/canvas/CanvasBoard'
import PropertiesPanel from './components/panels/PropertiesPanel'
import KanbanBoard from './components/kanban/KanbanBoard'
import { useCanvasStore } from './store/canvasStore'

function App() {
  const [activeView, setActiveView] = useState('canvas')
  const initialize = useCanvasStore((s) => s.initialize)
  const isLoading = useCanvasStore((s) => s.isLoading)
  const backendAvailable = useCanvasStore((s) => s.backendAvailable)

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <div className="relative flex h-screen w-screen flex-col bg-[#0e0e12] text-zinc-100">
      <Topbar activeView={activeView} onViewChange={setActiveView} />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="min-w-0 flex-1">
          {isLoading ? (
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">
              Carregando projeto...
            </div>
          ) : activeView === 'canvas' ? (
            <CanvasBoard />
          ) : activeView === 'kanban' ? (
            <KanbanBoard />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">
              Visualização "{activeView}" ainda não implementada nesta versão.
            </div>
          )}
        </main>
        <PropertiesPanel />
      </div>
      {!isLoading && !backendAvailable && (
        <div className="absolute bottom-3 right-3 rounded-md border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-[11px] text-amber-300">
          Backend indisponível — usando dados locais de demonstração
        </div>
      )}
    </div>
  )
}

export default App
