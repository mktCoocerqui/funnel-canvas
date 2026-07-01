import { useCallback, useRef } from 'react'
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow'
import { useCanvasStore } from '../../store/canvasStore'
import CardNode from './CardNode'
import type { CardType } from '../../types/card'
import { CARD_TYPES } from '../../lib/cardTypes'

const nodeTypes = { card: CardNode }

function Board() {
  const nodes = useCanvasStore((s) => s.nodes)
  const edges = useCanvasStore((s) => s.edges)
  const onNodesChange = useCanvasStore((s) => s.onNodesChange)
  const onEdgesChange = useCanvasStore((s) => s.onEdgesChange)
  const onConnect = useCanvasStore((s) => s.onConnect)
  const addCard = useCanvasStore((s) => s.addCard)
  const setSelectedNode = useCanvasStore((s) => s.setSelectedNode)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const { screenToFlowPosition } = useReactFlow()

  const minimapNodeColor = useCallback((n: (typeof nodes)[number]) => {
    return n.data.color ?? CARD_TYPES[n.data.type as CardType]?.color ?? '#818cf8'
  }, [])

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const type = e.dataTransfer.getData('application/card-type') as CardType
      if (!type || !CARD_TYPES[type]) return
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY })
      const id = addCard(type, position)
      setSelectedNode(id)
    },
    [addCard, screenToFlowPosition, setSelectedNode],
  )

  return (
    <div ref={wrapperRef} className="h-full w-full" onDragOver={onDragOver} onDrop={onDrop}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => setSelectedNode(node.id)}
        onPaneClick={() => setSelectedNode(null)}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={2}
        selectionOnDrag
        panOnDrag={[1, 2]}
        panOnScroll
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{ type: 'smoothstep' }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#2a2b33" />
        <Controls className="!border-white/10 !bg-[#191a20] [&>button]:!border-white/10 [&>button]:!bg-[#191a20] [&>button]:!fill-zinc-300 [&>button:hover]:!bg-[#232430]" />
        <MiniMap
          nodeColor={minimapNodeColor}
          maskColor="rgba(10,10,14,0.7)"
          className="!border !border-white/10 !bg-[#141419]"
        />
      </ReactFlow>
    </div>
  )
}

export default function CanvasBoard() {
  return (
    <ReactFlowProvider>
      <div className="relative h-full w-full">
        <Board />
      </div>
    </ReactFlowProvider>
  )
}
