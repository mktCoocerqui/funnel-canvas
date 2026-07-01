import { memo } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import * as Icons from 'lucide-react'
import type { CardData } from '../../types/card'
import { CARD_TYPES } from '../../lib/cardTypes'

const STATUS_LABEL: Record<string, string> = {
  planejamento: 'Planejamento',
  criado: 'Criado',
  em_andamento: 'Em andamento',
  em_teste: 'Em teste',
  ativo: 'Ativo',
  pausado: 'Pausado',
  concluido: 'Concluído',
  arquivado: 'Arquivado',
}

function CardNode({ data, selected }: NodeProps<CardData>) {
  const meta = CARD_TYPES[data.type]
  const color = data.color ?? meta?.color ?? '#818cf8'
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[meta?.icon ?? 'Box'] ?? Icons.Box

  return (
    <div
      className={`min-w-[180px] max-w-[240px] rounded-xl border bg-[#191a20]/95 px-3 py-2.5 shadow-lg backdrop-blur transition-colors ${
        selected ? 'border-white/60 ring-2 ring-white/20' : 'border-white/10'
      }`}
      style={{ boxShadow: selected ? `0 0 0 1px ${color}55, 0 8px 24px -8px ${color}66` : undefined }}
    >
      <Handle type="target" position={Position.Left} className="!h-2.5 !w-2.5 !border-none" style={{ background: color }} />
      <Handle type="source" position={Position.Right} className="!h-2.5 !w-2.5 !border-none" style={{ background: color }} />

      <div className="flex items-center gap-2">
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
          style={{ background: `${color}26`, color }}
        >
          <Icon size={14} strokeWidth={2.25} />
        </span>
        <span className="truncate text-[13px] font-medium text-zinc-100">{data.name}</span>
      </div>

      <div className="mt-1.5 flex items-center gap-1.5">
        <span
          className="rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide"
          style={{ background: `${color}1f`, color }}
        >
          {meta?.label ?? data.type}
        </span>
        {data.status && (
          <span className="rounded-full bg-white/5 px-1.5 py-0.5 text-[10px] text-zinc-400">
            {STATUS_LABEL[data.status] ?? data.status}
          </span>
        )}
      </div>
    </div>
  )
}

export default memo(CardNode)
