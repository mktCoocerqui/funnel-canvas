import { useViewport } from 'reactflow'

export default function AlignmentGuidesOverlay({
  vertical,
  horizontal,
}: {
  vertical: number[]
  horizontal: number[]
}) {
  const { x, y, zoom } = useViewport()

  if (vertical.length === 0 && horizontal.length === 0) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {vertical.map((vx) => (
        <div
          key={`v-${vx}`}
          className="absolute top-0 bottom-0 w-px bg-fuchsia-400"
          style={{ left: vx * zoom + x }}
        />
      ))}
      {horizontal.map((hy) => (
        <div
          key={`h-${hy}`}
          className="absolute left-0 right-0 h-px bg-fuchsia-400"
          style={{ top: hy * zoom + y }}
        />
      ))}
    </div>
  )
}
