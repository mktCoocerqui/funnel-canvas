import type { CardType, CardTypeMeta } from '../types/card'

export const CARD_TYPE_GROUPS = [
  'Estratégia',
  'Jornada',
  'Comunicação',
  'Dados & Indicadores',
  'Automação',
  'Comércio',
  'Notas',
] as const

export const CARD_TYPES: Record<CardType, CardTypeMeta> = {
  cluster: { type: 'cluster', label: 'Cluster', group: 'Estratégia', color: '#a78bfa', icon: 'Boxes' },
  pipeline: { type: 'pipeline', label: 'Pipeline', group: 'Estratégia', color: '#818cf8', icon: 'GitBranch' },
  funil: { type: 'funil', label: 'Funil', group: 'Estratégia', color: '#60a5fa', icon: 'Filter' },
  objetivo: { type: 'objetivo', label: 'Objetivo', group: 'Estratégia', color: '#34d399', icon: 'Target' },
  rfv: { type: 'rfv', label: 'RFV', group: 'Estratégia', color: '#4ade80', icon: 'BarChart3' },
  segmentacao: { type: 'segmentacao', label: 'Segmentação', group: 'Estratégia', color: '#22d3ee', icon: 'PieChart' },

  cliente: { type: 'cliente', label: 'Cliente', group: 'Jornada', color: '#f472b6', icon: 'User' },
  persona: { type: 'persona', label: 'Persona', group: 'Jornada', color: '#f0abfc', icon: 'UserCircle' },
  jornada: { type: 'jornada', label: 'Jornada', group: 'Jornada', color: '#e879f9', icon: 'Route' },

  campanha: { type: 'campanha', label: 'Campanha', group: 'Comunicação', color: '#fb923c', icon: 'Megaphone' },
  anuncio: { type: 'anuncio', label: 'Anúncio', group: 'Comunicação', color: '#f59e0b', icon: 'Image' },
  mensagem: { type: 'mensagem', label: 'Mensagem', group: 'Comunicação', color: '#fbbf24', icon: 'MessageSquare' },
  template: { type: 'template', label: 'Template', group: 'Comunicação', color: '#facc15', icon: 'FileText' },

  indicador: { type: 'indicador', label: 'Indicador', group: 'Dados & Indicadores', color: '#2dd4bf', icon: 'Activity' },
  kpi: { type: 'kpi', label: 'KPI', group: 'Dados & Indicadores', color: '#2dd4bf', icon: 'Gauge' },
  metrica: { type: 'metrica', label: 'Métrica', group: 'Dados & Indicadores', color: '#38bdf8', icon: 'LineChart' },
  banco_de_dados: { type: 'banco_de_dados', label: 'Banco de Dados', group: 'Dados & Indicadores', color: '#94a3b8', icon: 'Database' },

  acao: { type: 'acao', label: 'Ação', group: 'Automação', color: '#4ade80', icon: 'Zap' },
  condicao: { type: 'condicao', label: 'Condição', group: 'Automação', color: '#facc15', icon: 'GitFork' },
  espera: { type: 'espera', label: 'Espera', group: 'Automação', color: '#a3a3a3', icon: 'Clock' },
  decisao: { type: 'decisao', label: 'Decisão', group: 'Automação', color: '#f59e0b', icon: 'Split' },
  api: { type: 'api', label: 'API', group: 'Automação', color: '#818cf8', icon: 'Plug' },
  integracao: { type: 'integracao', label: 'Integração', group: 'Automação', color: '#818cf8', icon: 'Puzzle' },
  webhook: { type: 'webhook', label: 'Webhook', group: 'Automação', color: '#c084fc', icon: 'Webhook' },
  automacao: { type: 'automacao', label: 'Automação', group: 'Automação', color: '#22d3ee', icon: 'Bot' },
  workflow: { type: 'workflow', label: 'Workflow', group: 'Automação', color: '#22d3ee', icon: 'Workflow' },
  evento: { type: 'evento', label: 'Evento', group: 'Automação', color: '#f472b6', icon: 'CalendarClock' },

  produto: { type: 'produto', label: 'Produto', group: 'Comércio', color: '#fb7185', icon: 'Package' },
  categoria: { type: 'categoria', label: 'Categoria', group: 'Comércio', color: '#fda4af', icon: 'Tag' },
  cupom: { type: 'cupom', label: 'Cupom', group: 'Comércio', color: '#fde047', icon: 'Ticket' },
  promocao: { type: 'promocao', label: 'Promoção', group: 'Comércio', color: '#f472b6', icon: 'Percent' },
  loja: { type: 'loja', label: 'Loja', group: 'Comércio', color: '#38bdf8', icon: 'Store' },
  fornecedor: { type: 'fornecedor', label: 'Fornecedor', group: 'Comércio', color: '#94a3b8', icon: 'Truck' },
  marca: { type: 'marca', label: 'Marca', group: 'Comércio', color: '#a78bfa', icon: 'Award' },

  observacao: { type: 'observacao', label: 'Observação', group: 'Notas', color: '#eab308', icon: 'StickyNote' },
  documento: { type: 'documento', label: 'Documento', group: 'Notas', color: '#a3a3a3', icon: 'File' },
}

export const CARD_TYPE_LIST = Object.values(CARD_TYPES)

export function cardTypesByGroup() {
  const map = new Map<string, CardTypeMeta[]>()
  for (const meta of CARD_TYPE_LIST) {
    const list = map.get(meta.group) ?? []
    list.push(meta)
    map.set(meta.group, list)
  }
  return map
}
