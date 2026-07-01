import * as Icons from 'lucide-react'
import { useCanvasStore, type CardNode } from '../../store/canvasStore'
import { CARD_TYPES } from '../../lib/cardTypes'
import type { CardStatus } from '../../types/card'

const COLUMNS: { id: CardStatus | 'sem_status'; label: string }[] = [
  { id: 'planejamento', label: 'Planejamento' },
  { id: 'criado', label: 'Criado' },
  { id: 'em_andamento', label: 'Em andamento' },
  { id: 'em_teste', label: 'Em teste' },
  { id: 'ativo', label: 'Ativo' },
  { id: 'pausado', label: 'Pausado' },
  { id: 'concluido', label: 'Concluído' },
  { id: 'arquivado', label: 'Arquivado' },
  { id: 'sem_status', label: 'Sem status' },
]

function TypeIcon({ name }: { name: string }) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Box
  return <Icon size={13} strokeWidth={2.25} />
}

function KanbanCard({ node, onSelect, selected }: { node: CardNode; onSelect: () => void; selected: boolean }) {
  const meta = CARD_TYPES[node.data.type]
  const color = node.data.color ?? meta?.color ?? '#818cf8'

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('application/card-id', node.id)
        e.dataTransfer.effectAllowed = 'move'
      }}
      onClick={onSelect}
      className={`cursor-grab rounded-lg border bg-[#191a20] px-3 py-2.5 shadow-sm transition-colors active:cursor-grabbing ${
        selected ? 'border-white/40 ring-1 ring-white/20' : 'border-white/10 hover:border-white/20'
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded"
          style={{ background: `${color}26`, color }}
        >
          <TypeIcon name={meta?.icon ?? 'Box'} />
        </span>
        <span className="truncate text-[12.5px] font-medium text-zinc-100">{node.data.name}</span>
      </div>
      <div className="mt-1.5 flex items-center gap-1.5">
        <span
          className="rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide"
          style={{ background: `${color}1f`, color }}
        >
          {meta?.label ?? node.data.type}
        </span>
        {node.data.priority && (
          <span className="rounded-full bg-white/5 px-1.5 py-0.5 text-[10px] text-zinc-400">
            {node.data.priority}
          </span>
        )}
      </div>
    </div>
  )
}

export default function KanbanBoard() {
  const nodes = useCanvasStore((s) => s.nodes)
  const updateCard = useCanvasStore((s) => s.updateCard)
  const selectedNodeId = useCanvasStore((s) => s.selectedNodeId)
  const setSelectedNode = useCanvasStore((s) => s.setSelectedNode)

  const onDrop = (e: React.DragEvent, columnId: CardStatus | 'sem_status') => {
    e.preventDefault()
    const id = e.dataTransfer.getData('application/card-id')
    if (!id) return
    updateCard(id, { status: columnId === 'sem_status' ? undefined : columnId })
  }

  return (
    <div className="flex h-full gap-3 overflow-x-auto p-4">
      {COLUMNS.map((col) => {
        const cards = nodes.filter((n) =>
          col.id === 'sem_status' ? !n.data.status : n.data.status === col.id,
        )
        return (
          <div
            key={col.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, col.id)}
            className="flex w-64 shrink-0 flex-col rounded-xl border border-white/10 bg-white/[0.02]"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
              <span className="text-[12px] font-semibold uppercase tracking-wide text-zinc-400">
                {col.label}
              </span>
              <span className="rounded-full bg-white/5 px-1.5 py-0.5 text-[11px] text-zinc-500">
                {cards.length}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-2">
              {cards.map((node) => (
                <KanbanCard
                  key={node.id}
                  node={node}
                  selected={node.id === selectedNodeId}
                  onSelect={() => setSelectedNode(node.id)}
                />
              ))}
              {cards.length === 0 && (
                <div className="rounded-lg border border-dashed border-white/10 px-2 py-4 text-center text-[11px] text-zinc-600">
                  Arraste cards aqui
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
