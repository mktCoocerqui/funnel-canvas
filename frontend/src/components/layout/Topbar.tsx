import * as Icons from 'lucide-react'
import { useCanvasStore } from '../../store/canvasStore'

const VIEWS = [
  { id: 'canvas', label: 'Canvas', icon: 'LayoutDashboard' },
  { id: 'kanban', label: 'Kanban', icon: 'Kanban' },
  { id: 'table', label: 'Tabela', icon: 'Table' },
  { id: 'timeline', label: 'Timeline', icon: 'GanttChartSquare' },
  { id: 'calendar', label: 'Calendário', icon: 'Calendar' },
  { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3' },
] as const

export default function Topbar({
  activeView,
  onViewChange,
}: {
  activeView: string
  onViewChange: (id: string) => void
}) {
  const workspaces = useCanvasStore((s) => s.workspaces)
  const activeWorkspaceId = useCanvasStore((s) => s.activeWorkspaceId)
  const projectPath = useCanvasStore((s) => s.projectPath)
  const goToProjectPathIndex = useCanvasStore((s) => s.goToProjectPathIndex)

  const workspace = workspaces.find((w) => w.id === activeWorkspaceId)

  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b border-white/10 bg-[#141419] px-3">
      <div className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[13px] font-medium text-zinc-200">
        <span className="flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br from-violet-500 to-fuchsia-500 text-[10px] font-bold text-white">
          C
        </span>
        CRM Strategy OS
      </div>

      <div className="mx-1 h-4 w-px bg-white/10" />

      <button className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[13px] text-zinc-300 hover:bg-white/5">
        {workspace?.name ?? 'Workspace'}
        <Icons.ChevronDown size={13} className="text-zinc-500" />
      </button>

      {projectPath.map((entry, index) => {
        const isCurrent = index === projectPath.length - 1
        return (
          <div key={entry.id} className="flex items-center gap-3">
            <Icons.ChevronRight size={13} className="text-zinc-600" />
            <button
              onClick={() => goToProjectPathIndex(index)}
              disabled={isCurrent}
              className={`rounded-md px-2 py-1 text-[13px] ${
                isCurrent ? 'font-medium text-zinc-100' : 'text-zinc-300 hover:bg-white/5'
              }`}
            >
              {entry.name}
            </button>
          </div>
        )
      })}

      <nav className="ml-4 flex items-center gap-0.5 rounded-lg bg-white/[0.03] p-0.5">
        {VIEWS.map((v) => {
          const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[v.icon] ?? Icons.Box
          const active = activeView === v.id
          return (
            <button
              key={v.id}
              onClick={() => onViewChange(v.id)}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[12.5px] font-medium transition-colors ${
                active ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Icon size={13} />
              {v.label}
            </button>
          )
        })}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <button className="rounded-md p-1.5 text-zinc-400 hover:bg-white/5 hover:text-zinc-200">
          <Icons.Search size={15} />
        </button>
        <button className="rounded-md p-1.5 text-zinc-400 hover:bg-white/5 hover:text-zinc-200">
          <Icons.Moon size={15} />
        </button>
        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500" />
      </div>
    </header>
  )
}
