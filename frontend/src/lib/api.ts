import type { CardPriority, CardStatus, CardType } from '../types/card'

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    throw new Error(`API ${res.status} on ${path}: ${await res.text()}`)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export interface ApiWorkspace {
  id: string
  name: string
}

export interface ApiProject {
  id: string
  name: string
  workspaceId: string
}

export interface ApiCard {
  id: string
  projectId: string
  type: CardType
  name: string
  description: string | null
  color: string | null
  category: string | null
  responsavel: string | null
  status: CardStatus | null
  priority: CardPriority | null
  tags: string[]
  dueDate: string | null
  expectedValue: string | null
  roi: string | null
  investimento: string | null
  ticketMedio: string | null
  conversao: string | null
  notes: string | null
  positionX: number
  positionY: number
}

export type CreateCardInput = Partial<Omit<ApiCard, 'projectId' | 'type' | 'name'>> & {
  id: string
  projectId: string
  type: CardType
  name: string
}

export type UpdateCardInput = Partial<Omit<ApiCard, 'id' | 'projectId'>>

export interface ApiConnection {
  id: string
  projectId: string
  sourceId: string
  targetId: string
  label: string | null
}

export const api = {
  listWorkspaces: () => request<ApiWorkspace[]>('/workspaces'),
  createWorkspace: (name: string) =>
    request<ApiWorkspace>('/workspaces', { method: 'POST', body: JSON.stringify({ name }) }),

  listProjects: (workspaceId: string) =>
    request<ApiProject[]>(`/projects?workspaceId=${workspaceId}`),
  createProject: (name: string, workspaceId: string) =>
    request<ApiProject>('/projects', { method: 'POST', body: JSON.stringify({ name, workspaceId }) }),

  listCards: (projectId: string) => request<ApiCard[]>(`/cards?projectId=${projectId}`),
  createCard: (card: CreateCardInput) =>
    request<ApiCard>('/cards', { method: 'POST', body: JSON.stringify(card) }),
  updateCard: (id: string, patch: UpdateCardInput) =>
    request<ApiCard>(`/cards/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),
  deleteCard: (id: string) => request<void>(`/cards/${id}`, { method: 'DELETE' }),

  listConnections: (projectId: string) =>
    request<ApiConnection[]>(`/connections?projectId=${projectId}`),
  createConnection: (connection: { id: string; projectId: string; sourceId: string; targetId: string }) =>
    request<ApiConnection>('/connections', { method: 'POST', body: JSON.stringify(connection) }),
  deleteConnection: (id: string) => request<void>(`/connections/${id}`, { method: 'DELETE' }),
}
