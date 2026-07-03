import { nanoid } from 'nanoid'
import { CARD_TYPES } from './cardTypes'
import type { CardPriority, CardStatus, CardType } from '../types/card'

export interface ImportNode {
  name: string
  type: string
  status?: string
  priority?: string
  description?: string
  notes?: string
  color?: string
  children?: ImportNode[]
}

export interface FlatImportCard {
  id: string
  type: CardType
  name: string
  status?: CardStatus
  priority?: CardPriority
  description?: string
  notes?: string
  color?: string
  x: number
  y: number
}

export interface FlatImportConnection {
  id: string
  sourceId: string
  targetId: string
}

export interface FlattenedTree {
  cards: FlatImportCard[]
  connections: FlatImportConnection[]
}

const LEVEL_WIDTH = 320
const ROW_HEIGHT = 140

function isValidCardType(type: string): type is CardType {
  return type in CARD_TYPES
}

function isValidStatus(status: string): status is CardStatus {
  return ['planejamento', 'criado', 'em_andamento', 'em_teste', 'ativo', 'pausado', 'concluido', 'arquivado'].includes(
    status,
  )
}

function isValidPriority(priority: string): priority is CardPriority {
  return ['baixa', 'media', 'alta', 'urgente'].includes(priority)
}

// Validates the tree up front and collects every problem, so an import
// either fully succeeds or reports everything wrong with it at once.
export function validateImportTree(roots: ImportNode[]): string[] {
  const errors: string[] = []
  const validTypes = Object.keys(CARD_TYPES).join(', ')

  function visit(node: ImportNode, path: string) {
    if (!node || typeof node !== 'object') {
      errors.push(`${path}: nó inválido`)
      return
    }
    if (!node.name || typeof node.name !== 'string') {
      errors.push(`${path}: campo "name" obrigatório`)
    }
    if (!node.type || typeof node.type !== 'string') {
      errors.push(`${path}: campo "type" obrigatório`)
    } else if (!isValidCardType(node.type)) {
      errors.push(`${path}: type "${node.type}" desconhecido. Use um de: ${validTypes}`)
    }
    if (node.status && !isValidStatus(node.status)) {
      errors.push(`${path}: status "${node.status}" desconhecido`)
    }
    if (node.priority && !isValidPriority(node.priority)) {
      errors.push(`${path}: priority "${node.priority}" desconhecida`)
    }
    if (node.children) {
      if (!Array.isArray(node.children)) {
        errors.push(`${path}: "children" precisa ser uma lista`)
      } else {
        node.children.forEach((child, i) => visit(child, `${path} > filho ${i + 1}`))
      }
    }
  }

  roots.forEach((root, i) => visit(root, `raiz ${i + 1}`))
  return errors
}

export function flattenImportTree(roots: ImportNode[]): FlattenedTree {
  const cards: FlatImportCard[] = []
  const connections: FlatImportConnection[] = []
  let leafCursor = 0

  function visit(node: ImportNode, depth: number, parentId: string | null): number {
    const id = nanoid(8)
    let y: number

    if (node.children && node.children.length > 0) {
      const childYs = node.children.map((child) => visit(child, depth + 1, id))
      y = childYs.reduce((a, b) => a + b, 0) / childYs.length
    } else {
      y = leafCursor * ROW_HEIGHT
      leafCursor += 1
    }

    cards.push({
      id,
      type: node.type as CardType,
      name: node.name,
      status: node.status as CardStatus | undefined,
      priority: node.priority as CardPriority | undefined,
      description: node.description,
      notes: node.notes,
      color: node.color,
      x: depth * LEVEL_WIDTH,
      y,
    })

    if (parentId) {
      connections.push({ id: nanoid(8), sourceId: parentId, targetId: id })
    }

    return y
  }

  roots.forEach((root) => visit(root, 0, null))
  return { cards, connections }
}

export interface ParsedImportPayload {
  pageName: string
  roots: ImportNode[]
}

// Accepts either a bare tree (single node or array of root nodes) or a
// wrapper object like { page: "...", tree: [...] } / { name, nodes: [...] }.
export function parseImportPayload(raw: unknown, fallbackName: string): ParsedImportPayload {
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const obj = raw as Record<string, unknown>
    const treeValue = obj.tree ?? obj.nodes
    if (treeValue !== undefined) {
      const pageName =
        (typeof obj.page === 'string' && obj.page) ||
        (typeof obj.name === 'string' && obj.name) ||
        (typeof obj.title === 'string' && obj.title) ||
        fallbackName
      const roots = Array.isArray(treeValue) ? treeValue : [treeValue]
      return { pageName, roots: roots as ImportNode[] }
    }
  }
  const roots = Array.isArray(raw) ? raw : [raw]
  return { pageName: fallbackName, roots: roots as ImportNode[] }
}
