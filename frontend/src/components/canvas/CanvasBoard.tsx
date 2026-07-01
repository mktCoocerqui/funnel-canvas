import { useCallback, useEffect, useRef, useState } from 'react'
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
  type NodeChange,
} from 'reactflow'
import { useCanvasStore } from '../../store/canvasStore'
import CardNode from './CardNode'
import AlignmentGuidesOverlay from './AlignmentGuidesOverlay'
import { computeAlignmentGuides } from '../../lib/alignmentGuides'
import type { CardType } from '../../types/card'
import { CARD_TYPES } from '../../lib/cardTypes'

const nodeTypes = { card: CardNode }
const EMPTY_GUIDES = { vertical: [] as number[], horizontal: [] as number[] }

function Board() {
  const nodes = useCanvasStore((s) => s.nodes)
  const edges = useCanvasStore((s) => s.edges)
  const onNodesChange = useCanvasStore((s) => s.onNodesChange)
  const onEdgesChange = useCanvasStore((s) => s.onEdgesChange)
  const onConnect = useCanvasStore((s) => s.onConnect)
  const addCard = useCanvasStore((s) => s.addCard)
  const setSelectedNode = useCanvasStore((s) => s.setSelectedNode)
  const openCardPage = useCanvasStore((s) => s.openCardPage)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const { screenToFlowPosition } = useReactFlow()
  const shiftPressedRef = useRef(false)
  const [guides, setGuides] = useState(EMPTY_GUIDES)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') shiftPressedRef.current = true
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') shiftPressedRef.current = false
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  const minimapNodeColor = useCallback((n: (typeof nodes)[number]) => {
    return n.data.color ?? CARD_TYPES[n.data.type as CardType]?.color ?? '#818cf8'
  }, [])

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      let sawActiveDrag = false

      if (shiftPressedRef.current) {
        for (const change of changes) {
          if (change.type === 'position' && change.dragging && change.position) {
            sawActiveDrag = true
            const others = nodes.filter((n) => n.id !== change.id)
            const dragged = { position: change.position, width: null as number | null, height: null as number | null }
            const source = nodes.find((n) => n.id === change.id)
            if (source) {
              dragged.width = source.width ?? null
              dragged.height = source.height ?? null
            }
            const result = computeAlignmentGuides(dragged, others)
            if (result.snapX !== null) change.position.x = result.snapX
            if (result.snapY !== null) change.position.y = result.snapY
            setGuides({ vertical: result.vertical, horizontal: result.horizontal })
          }
        }
      }

      if (!sawActiveDrag && (guides.vertical.length > 0 || guides.horizontal.length > 0)) {
        setGuides(EMPTY_GUIDES)
      }

      onNodesChange(changes)
    },
    [nodes, onNodesChange, guides],
  )

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
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => setSelectedNode(node.id)}
        onNodeDoubleClick={(_, node) => openCardPage(node.id)}
        onPaneClick={() => setSelectedNode(null)}
        onNodeDragStop={() => setGuides(EMPTY_GUIDES)}
        nodeTypes={nodeTypes}
        deleteKeyCode={['Backspace', 'Delete']}
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
        <AlignmentGuidesOverlay vertical={guides.vertical} horizontal={guides.horizontal} />
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
