export type CardType =
  | 'cluster'
  | 'pipeline'
  | 'funil'
  | 'cliente'
  | 'campanha'
  | 'mensagem'
  | 'template'
  | 'produto'
  | 'categoria'
  | 'objetivo'
  | 'rfv'
  | 'segmentacao'
  | 'acao'
  | 'condicao'
  | 'espera'
  | 'decisao'
  | 'observacao'
  | 'documento'
  | 'indicador'
  | 'kpi'
  | 'metrica'
  | 'api'
  | 'integracao'
  | 'banco_de_dados'
  | 'webhook'
  | 'cupom'
  | 'promocao'
  | 'loja'
  | 'fornecedor'
  | 'marca'
  | 'persona'
  | 'jornada'
  | 'automacao'
  | 'workflow'
  | 'evento'

export type CardStatus =
  | 'planejamento'
  | 'criado'
  | 'em_andamento'
  | 'em_teste'
  | 'ativo'
  | 'pausado'
  | 'concluido'
  | 'arquivado'

export type CardPriority = 'baixa' | 'media' | 'alta' | 'urgente'

export interface CardTypeMeta {
  type: CardType
  label: string
  group: string
  color: string
  icon: string
}

export interface CardData {
  id: string
  type: CardType
  name: string
  description?: string
  color?: string
  category?: string
  responsavel?: string
  status?: CardStatus
  priority?: CardPriority
  tags?: string[]
  dueDate?: string
  expectedValue?: string
  roi?: string
  investimento?: string
  ticketMedio?: string
  conversao?: string
  notes?: string
}
