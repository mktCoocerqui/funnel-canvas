import { create } from 'zustand'
import {
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type Connection,
  type NodeChange,
  type EdgeChange,
} from 'reactflow'
import { nanoid } from 'nanoid'
import type { CardData, CardType } from '../types/card'
import { CARD_TYPES } from '../lib/cardTypes'
import { api, type ApiCard, type ApiConnection, type UpdateCardInput } from '../lib/api'

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

interface SeedCard {
  id: string
  type: CardType
  name: string
  status?: CardData['status']
  x: number
  y: number
}

const SEED_CARDS: SeedCard[] = [
  { id: 'seed-1', type: 'cluster', name: 'Cluster Hipertensivos', status: 'ativo', x: 0, y: 0 },
  { id: 'seed-2', type: 'pipeline', name: 'Pipeline Recompra', status: 'em_andamento', x: 320, y: 0 },
  { id: 'seed-3', type: 'espera', name: '30 dias', x: 640, y: -120 },
  { id: 'seed-4', type: 'mensagem', name: 'Push de lembrete', x: 640, y: 120 },
]

const SEED_EDGES: Array<{ id: string; source: string; target: string; animated?: boolean }> = [
  { id: 'e-seed-1-2', source: 'seed-1', target: 'seed-2', animated: true },
  { id: 'e-seed-2-3', source: 'seed-2', target: 'seed-3' },
  { id: 'e-seed-2-4', source: 'seed-2', target: 'seed-4' },
]

function seedNodes(): CardNode[] {
  return SEED_CARDS.map((c) => ({
    id: c.id,
    type: 'card',
    position: { x: c.x, y: c.y },
    data: { id: c.id, type: c.type, name: c.name, status: c.status },
  }))
}

function seedEdgesList(): Edge[] {
  return SEED_EDGES.map((e) => ({ ...e, type: 'smoothstep' }))
}

function cardToNode(card: ApiCard): CardNode {
  return {
    id: card.id,
    type: 'card',
    position: { x: card.positionX, y: card.positionY },
    data: {
      id: card.id,
      type: card.type,
      name: card.name,
      description: card.description ?? undefined,
      color: card.color ?? undefined,
      category: card.category ?? undefined,
      responsavel: card.responsavel ?? undefined,
      status: card.status ?? undefined,
      priority: card.priority ?? undefined,
      tags: card.tags,
      dueDate: card.dueDate ?? undefined,
      expectedValue: card.expectedValue ?? undefined,
      roi: card.roi ?? undefined,
      investimento: card.investimento ?? undefined,
      ticketMedio: card.ticketMedio ?? undefined,
      conversao: card.conversao ?? undefined,
      notes: card.notes ?? undefined,
    },
  }
}

function connectionToEdge(connection: ApiConnection): Edge {
  return {
    id: connection.id,
    source: connection.sourceId,
    target: connection.targetId,
    type: 'smoothstep',
    label: connection.label ?? undefined,
  }
}

const DEMO_WORKSPACE: Workspace = { id: 'ws-demo', name: 'Coocerqui (offline)' }
const DEMO_PROJECT: Project = { id: 'proj-demo', workspaceId: DEMO_WORKSPACE.id, name: 'CRM 2026 (offline)' }

async function seedBackendProject(projectId: string): Promise<{ nodes: CardNode[]; edges: Edge[] }> {
  await Promise.all(
    SEED_CARDS.map((c) =>
      api.createCard({ id: c.id, projectId, type: c.type, name: c.name, status: c.status, positionX: c.x, positionY: c.y }),
    ),
  )
  await Promise.all(
    SEED_EDGES.map((e) => api.createConnection({ id: e.id, projectId, sourceId: e.source, targetId: e.target })),
  )
  return { nodes: seedNodes(), edges: seedEdgesList() }
}

interface CanvasState {
  workspaces: Workspace[]
  projects: Project[]
  activeWorkspaceId: string
  activeProjectId: string
  backendAvailable: boolean
  isLoading: boolean

  nodes: CardNode[]
  edges: Edge[]
  selectedNodeId: string | null

  initialize: () => Promise<void>
  _initializeImpl: () => Promise<void>
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

function toApiPatch(patch: Partial<CardData>): UpdateCardInput {
  const { id: _id, ...rest } = patch
  return rest as UpdateCardInput
}

// Guards against React StrictMode's double-invoked mount effect re-running
// the one-time bootstrap/seed flow twice.
let initializePromise: Promise<void> | null = null

export const useCanvasStore = create<CanvasState>((set, get) => ({
  workspaces: [DEMO_WORKSPACE],
  projects: [DEMO_PROJECT],
  activeWorkspaceId: DEMO_WORKSPACE.id,
  activeProjectId: DEMO_PROJECT.id,
  backendAvailable: false,
  isLoading: true,

  nodes: [],
  edges: [],
  selectedNodeId: null,

  initialize: () => {
    if (!initializePromise) initializePromise = get()._initializeImpl()
    return initializePromise
  },

  _initializeImpl: async () => {
    try {
      const workspaces = await api.listWorkspaces()
      const workspace = workspaces[0] ?? (await api.createWorkspace('Coocerqui'))

      const projects = await api.listProjects(workspace.id)
      const project = projects[0] ?? (await api.createProject('CRM 2026', workspace.id))

      const [cards, connections] = await Promise.all([
        api.listCards(project.id),
        api.listConnections(project.id),
      ])

      let nodes = cards.map(cardToNode)
      let edges = connections.map(connectionToEdge)

      if (nodes.length === 0) {
        const seeded = await seedBackendProject(project.id)
        nodes = seeded.nodes
        edges = seeded.edges
      }

      set({
        workspaces: [workspace],
        projects: [project],
        activeWorkspaceId: workspace.id,
        activeProjectId: project.id,
        nodes,
        edges,
        backendAvailable: true,
        isLoading: false,
      })
    } catch (err) {
      console.warn('Backend indisponível, usando dados de demonstração locais.', err)
      set({
        nodes: seedNodes(),
        edges: seedEdgesList(),
        backendAvailable: false,
        isLoading: false,
      })
    }
  },

  setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),
  setActiveProject: (id) => set({ activeProjectId: id }),

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) })
    if (!get().backendAvailable) return
    for (const change of changes) {
      if (change.type === 'position' && change.dragging === false) {
        // The drag-release event doesn't carry the final position, so read
        // it from state (already applied by applyNodeChanges above).
        const node = get().nodes.find((n) => n.id === change.id)
        if (node) {
          api
            .updateCard(change.id, { positionX: node.position.x, positionY: node.position.y })
            .catch((err) => console.warn('Falha ao salvar posição do card', err))
        }
      } else if (change.type === 'remove') {
        api.deleteCard(change.id).catch((err) => console.warn('Falha ao remover card', err))
      }
    }
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) })
    if (!get().backendAvailable) return
    for (const change of changes) {
      if (change.type === 'remove') {
        api.deleteConnection(change.id).catch((err) => console.warn('Falha ao remover conexão', err))
      }
    }
  },

  onConnect: (connection) => {
    if (!connection.source || !connection.target) return
    const id = nanoid(8)
    const edge: Edge = {
      id,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle ?? undefined,
      targetHandle: connection.targetHandle ?? undefined,
      type: 'smoothstep',
    }
    set({ edges: [...get().edges, edge] })
    if (get().backendAvailable) {
      api
        .createConnection({ id, projectId: get().activeProjectId, sourceId: connection.source, targetId: connection.target })
        .catch((err) => console.warn('Falha ao salvar conexão', err))
    }
  },

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
    if (get().backendAvailable) {
      api
        .createCard({
          id,
          projectId: get().activeProjectId,
          type,
          name: meta.label,
          positionX: position.x,
          positionY: position.y,
        })
        .catch((err) => console.warn('Falha ao criar card', err))
    }
    return id
  },

  updateCard: (id, patch) => {
    set({
      nodes: get().nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...patch } } : n)),
    })
    if (get().backendAvailable) {
      api.updateCard(id, toApiPatch(patch)).catch((err) => console.warn('Falha ao atualizar card', err))
    }
  },

  duplicateCard: (id) => {
    const source = get().nodes.find((n) => n.id === id)
    if (!source) return
    const newId = nanoid(8)
    const position = { x: source.position.x + 40, y: source.position.y + 40 }
    const data: CardData = { ...source.data, id: newId, name: `${source.data.name} (cópia)` }
    const clone: CardNode = { ...source, id: newId, selected: false, position, data }
    set({ nodes: [...get().nodes, clone] })
    if (get().backendAvailable) {
      api
        .createCard({
          id: newId,
          projectId: get().activeProjectId,
          type: data.type,
          name: data.name,
          positionX: position.x,
          positionY: position.y,
          description: data.description,
          color: data.color,
          category: data.category,
          responsavel: data.responsavel,
          status: data.status,
          priority: data.priority,
          tags: data.tags,
          notes: data.notes,
        })
        .catch((err) => console.warn('Falha ao duplicar card', err))
    }
  },

  removeCard: (id) => {
    set({
      nodes: get().nodes.filter((n) => n.id !== id),
      edges: get().edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
    })
    if (get().backendAvailable) {
      api.deleteCard(id).catch((err) => console.warn('Falha ao remover card', err))
    }
  },

  setSelectedNode: (id) => set({ selectedNodeId: id }),
}))
