import { create } from 'zustand'
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type Connection,
  type NodeChange,
  type EdgeChange,
} from 'reactflow'
import { nanoid } from 'nanoid'
import type { CardData, CardType } from '../types/card'
import { CARD_TYPES } from '../lib/cardTypes'

export interface Workspace {
  id: string
  name: string
}

export interface Project {
  id: string
  workspaceId: string
  name: string
}

export type CardNode = Node<CardData>

interface CanvasState {
  workspaces: Workspace[]
  projects: Project[]
  activeWorkspaceId: string
  activeProjectId: string

  nodes: CardNode[]
  edges: Edge[]
  selectedNodeId: string | null

  setActiveWorkspace: (id: string) => void
  setActiveProject: (id: string) => void

  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void

  addCard: (type: CardType, position: { x: number; y: number }) => string
  updateCard: (id: string, patch: Partial<CardData>) => void
  duplicateCard: (id: string) => void
  removeCard: (id: string) => void
  setSelectedNode: (id: string | null) => void
}

const seedWorkspace: Workspace = { id: 'ws-coocerqui', name: 'Coocerqui' }
const seedProject: Project = { id: 'proj-crm-2026', workspaceId: seedWorkspace.id, name: 'CRM 2026' }

export const useCanvasStore = create<CanvasState>((set, get) => ({
  workspaces: [seedWorkspace],
  projects: [seedProject],
  activeWorkspaceId: seedWorkspace.id,
  activeProjectId: seedProject.id,

  nodes: [
    {
      id: 'seed-1',
      type: 'card',
      position: { x: 0, y: 0 },
      data: { id: 'seed-1', type: 'cluster', name: 'Cluster Hipertensivos', status: 'ativo' },
    },
    {
      id: 'seed-2',
      type: 'card',
      position: { x: 320, y: 0 },
      data: { id: 'seed-2', type: 'pipeline', name: 'Pipeline Recompra', status: 'em_andamento' },
    },
    {
      id: 'seed-3',
      type: 'card',
      position: { x: 640, y: -120 },
      data: { id: 'seed-3', type: 'espera', name: '30 dias' },
    },
    {
      id: 'seed-4',
      type: 'card',
      position: { x: 640, y: 120 },
      data: { id: 'seed-4', type: 'mensagem', name: 'Push de lembrete' },
    },
  ],
  edges: [
    { id: 'e-seed-1-2', source: 'seed-1', target: 'seed-2', type: 'smoothstep', animated: true },
    { id: 'e-seed-2-3', source: 'seed-2', target: 'seed-3', type: 'smoothstep' },
    { id: 'e-seed-2-4', source: 'seed-2', target: 'seed-4', type: 'smoothstep' },
  ],
  selectedNodeId: null,

  setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),
  setActiveProject: (id) => set({ activeProjectId: id }),

  onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) }),
  onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),
  onConnect: (connection) =>
    set({ edges: addEdge({ ...connection, type: 'smoothstep' }, get().edges) }),

  addCard: (type, position) => {
    const id = nanoid(8)
    const meta = CARD_TYPES[type]
    const node: CardNode = {
      id,
      type: 'card',
      position,
      data: { id, type, name: meta.label },
    }
    set({ nodes: [...get().nodes, node] })
    return id
  },

  updateCard: (id, patch) =>
    set({
      nodes: get().nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...patch } } : n)),
    }),

  duplicateCard: (id) => {
    const source = get().nodes.find((n) => n.id === id)
    if (!source) return
    const newId = nanoid(8)
    const clone: CardNode = {
      ...source,
      id: newId,
      selected: false,
      position: { x: source.position.x + 40, y: source.position.y + 40 },
      data: { ...source.data, id: newId, name: `${source.data.name} (cópia)` },
    }
    set({ nodes: [...get().nodes, clone] })
  },

  removeCard: (id) =>
    set({
      nodes: get().nodes.filter((n) => n.id !== id),
      edges: get().edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
    }),

  setSelectedNode: (id) => set({ selectedNodeId: id }),
}))
