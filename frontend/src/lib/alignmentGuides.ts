import type { Node } from 'reactflow'
import type { CardData } from '../types/card'

export interface AlignmentResult {
  vertical: number[]
  horizontal: number[]
  snapX: number | null
  snapY: number | null
}

const DEFAULT_WIDTH = 180
const DEFAULT_HEIGHT = 71
const SNAP_THRESHOLD = 6

export function computeAlignmentGuides(
  dragged: { position: { x: number; y: number }; width?: number | null; height?: number | null },
  others: Node<CardData>[],
): AlignmentResult {
  const dw = dragged.width ?? DEFAULT_WIDTH
  const dh = dragged.height ?? DEFAULT_HEIGHT
  const dx = dragged.position.x
  const dy = dragged.position.y

  const dXs = [dx, dx + dw / 2, dx + dw]
  const dYs = [dy, dy + dh / 2, dy + dh]

  const vertical = new Set<number>()
  const horizontal = new Set<number>()
  let snapX: number | null = null
  let snapY: number | null = null

  for (const other of others) {
    const ow = other.width ?? DEFAULT_WIDTH
    const oh = other.height ?? DEFAULT_HEIGHT
    const ox = other.position.x
    const oy = other.position.y

    const oXs = [ox, ox + ow / 2, ox + ow]
    const oYs = [oy, oy + oh / 2, oy + oh]

    for (const dXVal of dXs) {
      for (const oXVal of oXs) {
        if (Math.abs(dXVal - oXVal) <= SNAP_THRESHOLD) {
          vertical.add(oXVal)
          if (snapX === null) snapX = oXVal - (dXVal - dx)
        }
      }
    }

    for (const dYVal of dYs) {
      for (const oYVal of oYs) {
        if (Math.abs(dYVal - oYVal) <= SNAP_THRESHOLD) {
          horizontal.add(oYVal)
          if (snapY === null) snapY = oYVal - (dYVal - dy)
        }
      }
    }
  }

  return { vertical: [...vertical], horizontal: [...horizontal], snapX, snapY }
}
