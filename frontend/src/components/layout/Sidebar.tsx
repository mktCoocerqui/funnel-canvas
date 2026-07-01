import { useMemo, useState } from 'react'
import * as Icons from 'lucide-react'
import { cardTypesByGroup } from '../../lib/cardTypes'
import type { CardType } from '../../types/card'

function TypeIcon({ name }: { name: string }) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Box
  return <Icon size={14} strokeWidth={2.25} />
}

export default function Sidebar() {
  const groups = useMemo(() => cardTypesByGroup(), [])
  const [query, setQuery] = useState('')

  const onDragStart = (e: React.DragEvent, type: CardType) => {
    e.dataTransfer.setData('application/card-type', type)
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-white/10 bg-[#141419]">
      <div className="border-b border-white/10 p-3">
        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5">
          <Icons.Search size={14} className="text-zinc-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar objetos..."
            className="w-full bg-transparent text-[13px] text-zinc-200 placeholder:text-zinc-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3">
        {Array.from(groups.entries()).map(([group, types]) => {
          const filtered = types.filter((t) =>
            t.label.toLowerCase().includes(query.toLowerCase()),
          )
          if (filtered.length === 0) return null
          return (
            <div key={group} className="mb-4">
              <div className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                {group}
              </div>
              <div className="flex flex-col gap-0.5">
                {filtered.map((t) => (
                  <div
                    key={t.type}
                    draggable
                    onDragStart={(e) => onDragStart(e, t.type)}
                    className="group flex cursor-grab items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-zinc-300 transition-colors hover:bg-white/5 active:cursor-grabbing"
                  >
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
                      style={{ background: `${t.color}26`, color: t.color }}
                    >
                      <TypeIcon name={t.icon} />
                    </span>
                    <span className="truncate">{t.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="border-t border-white/10 p-3 text-[11px] text-zinc-500">
        Arraste um objeto para o canvas
      </div>
    </aside>
  )
}
