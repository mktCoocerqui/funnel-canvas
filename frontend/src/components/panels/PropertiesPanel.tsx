import * as Icons from 'lucide-react'
import { useCanvasStore } from '../../store/canvasStore'
import { CARD_TYPES } from '../../lib/cardTypes'
import type { CardPriority, CardStatus } from '../../types/card'

const STATUS_OPTIONS: CardStatus[] = [
  'planejamento',
  'criado',
  'em_andamento',
  'em_teste',
  'ativo',
  'pausado',
  'concluido',
  'arquivado',
]

const PRIORITY_OPTIONS: CardPriority[] = ['baixa', 'media', 'alta', 'urgente']

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">{label}</span>
      {children}
    </label>
  )
}

const inputClass =
  'w-full rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-[13px] text-zinc-100 placeholder:text-zinc-600 focus:border-violet-400/50 focus:outline-none'

export default function PropertiesPanel() {
  const selectedNodeId = useCanvasStore((s) => s.selectedNodeId)
  const node = useCanvasStore((s) => s.nodes.find((n) => n.id === s.selectedNodeId))
  const updateCard = useCanvasStore((s) => s.updateCard)
  const duplicateCard = useCanvasStore((s) => s.duplicateCard)
  const removeCard = useCanvasStore((s) => s.removeCard)
  const setSelectedNode = useCanvasStore((s) => s.setSelectedNode)

  if (!selectedNodeId || !node) {
    return (
      <aside className="flex h-full w-72 shrink-0 flex-col items-center justify-center gap-2 border-l border-white/10 bg-[#141419] px-6 text-center">
        <Icons.MousePointerClick size={20} className="text-zinc-600" />
        <p className="text-[13px] text-zinc-500">Selecione um card para ver e editar suas propriedades.</p>
      </aside>
    )
  }

  const data = node.data
  const meta = CARD_TYPES[data.type]

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-l border-white/10 bg-[#141419]">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2.5">
        <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide" style={{ color: meta?.color }}>
          {meta?.label ?? data.type}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => duplicateCard(node.id)}
            title="Duplicar"
            className="rounded p-1 text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
          >
            <Icons.Copy size={14} />
          </button>
          <button
            onClick={() => {
              removeCard(node.id)
              setSelectedNode(null)
            }}
            title="Excluir"
            className="rounded p-1 text-zinc-400 hover:bg-white/5 hover:text-red-400"
          >
            <Icons.Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
        <Field label="Nome">
          <input
            className={inputClass}
            value={data.name}
            onChange={(e) => updateCard(node.id, { name: e.target.value })}
          />
        </Field>

        <Field label="Descrição">
          <textarea
            className={`${inputClass} min-h-[64px] resize-none`}
            value={data.description ?? ''}
            onChange={(e) => updateCard(node.id, { description: e.target.value })}
            placeholder="Adicione uma descrição..."
          />
        </Field>

        <div className="grid grid-cols-2 gap-2">
          <Field label="Status">
            <select
              className={inputClass}
              value={data.status ?? ''}
              onChange={(e) => updateCard(node.id, { status: (e.target.value || undefined) as CardStatus })}
            >
              <option value="">—</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.replace('_', ' ')}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Prioridade">
            <select
              className={inputClass}
              value={data.priority ?? ''}
              onChange={(e) => updateCard(node.id, { priority: (e.target.value || undefined) as CardPriority })}
            >
              <option value="">—</option>
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Responsável">
          <input
            className={inputClass}
            value={data.responsavel ?? ''}
            onChange={(e) => updateCard(node.id, { responsavel: e.target.value })}
            placeholder="Nome do responsável"
          />
        </Field>

        <div className="grid grid-cols-2 gap-2">
          <Field label="Prazo">
            <input
              type="date"
              className={inputClass}
              value={data.dueDate ?? ''}
              onChange={(e) => updateCard(node.id, { dueDate: e.target.value })}
            />
          </Field>
          <Field label="Cor">
            <input
              type="color"
              className="h-[30px] w-full rounded-md border border-white/10 bg-white/5"
              value={data.color ?? meta?.color ?? '#818cf8'}
              onChange={(e) => updateCard(node.id, { color: e.target.value })}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Field label="ROI">
            <input
              className={inputClass}
              value={data.roi ?? ''}
              onChange={(e) => updateCard(node.id, { roi: e.target.value })}
              placeholder="%"
            />
          </Field>
          <Field label="Conversão">
            <input
              className={inputClass}
              value={data.conversao ?? ''}
              onChange={(e) => updateCard(node.id, { conversao: e.target.value })}
              placeholder="%"
            />
          </Field>
        </div>

        <Field label="Observações">
          <textarea
            className={`${inputClass} min-h-[52px] resize-none`}
            value={data.notes ?? ''}
            onChange={(e) => updateCard(node.id, { notes: e.target.value })}
          />
        </Field>
      </div>
    </aside>
  )
}
