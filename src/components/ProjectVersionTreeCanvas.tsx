import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import type { VersionNode } from '../data/projects'
import { statusColors } from '../data/status'

type ProjectVersionTreeCanvasProps = {
  versions: VersionNode[]
  selectedId?: string
  drawerOpen?: boolean
  onSelect: (version: VersionNode) => void
}

type PositionedNode = {
  node: VersionNode
  x: number
  y: number
  width: number
  height: number
  depth: number
}

type Connector = {
  id: string
  child: VersionNode
  path: string
}

const CANVAS_WIDTH = 1240
const TOP_PADDING = 80
const BOTTOM_PADDING = 120
const MIN_TRUNK_GAP = 360
const TRUNK_SECTION_GAP = 180
const BRANCH_OFFSET = 360
const SUB_BRANCH_OFFSET = 240
const BRANCH_GAP_Y = 110
const SUB_BRANCH_GAP_Y = 105
const NODE_HEIGHT = 76
const TRUNK_WIDTH = 280
const BRANCH_WIDTH = 220
const SUB_WIDTH = 210

export function ProjectVersionTreeCanvas({
  versions,
  selectedId,
  drawerOpen = false,
  onSelect,
}: ProjectVersionTreeCanvasProps) {
  const layout = buildTreeLayout(versions)

  return (
    <motion.div
      className={`version-tree-canvas ${drawerOpen ? 'tree-with-drawer' : ''}`}
      style={{ height: layout.height }}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
    >
      <svg
        className="tree-connector-layer"
        viewBox={`0 0 ${CANVAS_WIDTH} ${layout.height}`}
        preserveAspectRatio="xMidYMin meet"
        aria-hidden="true"
      >
        <defs>
          <filter id="connector-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {layout.trunkPaths.map((path) => (
          <path className="tree-trunk-path" d={path} filter="url(#connector-glow)" key={path} />
        ))}
        {layout.connectors.map((connector) => (
          <path
            className={`tree-connector-path ${connector.child.status}`}
            d={connector.path}
            filter="url(#connector-glow)"
            key={connector.id}
            stroke={statusColors[connector.child.status]}
          />
        ))}
      </svg>

      <div className="tree-node-layer">
        {layout.nodes.map((positioned, index) => (
          <VersionNodeButton
            depth={positioned.depth}
            key={positioned.node.id}
            positioned={positioned}
            selected={selectedId === positioned.node.id}
            onSelect={onSelect}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  )
}

function buildTreeLayout(versions: VersionNode[]) {
  const centerX = CANVAS_WIDTH / 2
  const nodes: PositionedNode[] = []
  const connectors: Connector[] = []
  const trunkNodes: PositionedNode[] = []
  let currentY = TOP_PADDING

  versions.forEach((trunk) => {
    const trunkX = centerX - TRUNK_WIDTH / 2
    const trunkY = currentY
    const trunkNode = addNode(trunk, trunkX, trunkY, TRUNK_WIDTH, NODE_HEIGHT, 0)
    trunkNodes.push(trunkNode)

    const subtreeBottom = placeBranchRows(trunkNode, trunk.children ?? [])
    const subtreeHeight = Math.max(getSubtreeHeight(trunk), subtreeBottom - trunkY)
    currentY += Math.max(subtreeHeight + TRUNK_SECTION_GAP, MIN_TRUNK_GAP)
  })

  const maxY = Math.max(...nodes.map((node) => node.y + node.height), TOP_PADDING + NODE_HEIGHT)
  const trunkPaths = drawTrunkConnectors(trunkNodes)

  return {
    connectors,
    height: maxY + BOTTOM_PADDING,
    nodes,
    trunkPaths,
  }

  function placeBranchRows(parent: PositionedNode, children: VersionNode[]) {
    if (!children.length) {
      return parent.y + parent.height
    }

    let rowY = parent.y + parent.height + BRANCH_GAP_Y
    let bottom = parent.y + parent.height

    for (let index = 0; index < children.length; index += 2) {
      const row = children.slice(index, index + 2)
      const rowHeights = row.map((child) => getSubtreeHeight(child))

      row.forEach((branch, rowIndex) => {
        const globalIndex = index + rowIndex
        const side = globalIndex % 2 === 0 ? -1 : 1
        const branchX =
          children.length === 1
            ? parent.x + parent.width / 2 - BRANCH_WIDTH / 2
            : centerX + side * BRANCH_OFFSET - BRANCH_WIDTH / 2
        const branchNode = addNode(branch, branchX, rowY, BRANCH_WIDTH, NODE_HEIGHT, 1)
        connectors.push(makeConnector(parent, branchNode, children.length === 1))
        bottom = Math.max(bottom, placeSubBranches(branchNode, branch.children ?? []))
      })

      rowY += Math.max(...rowHeights) + BRANCH_GAP_Y
    }

    return bottom
  }

  function placeSubBranches(parent: PositionedNode, children: VersionNode[]) {
    if (!children.length) {
      return parent.y + parent.height
    }

    const subY = parent.y + parent.height + SUB_BRANCH_GAP_Y
    const subCount = children.length
    let bottom = parent.y + parent.height

    children.forEach((child, index) => {
      const spread = subCount === 1 ? 0 : (index - (subCount - 1) / 2) * SUB_BRANCH_OFFSET
      const childX = parent.x + parent.width / 2 + spread - SUB_WIDTH / 2
      const childNode = addNode(child, childX, subY, SUB_WIDTH, NODE_HEIGHT, 2)
      connectors.push(makeConnector(parent, childNode, subCount === 1))
      bottom = Math.max(bottom, placeSubBranches(childNode, child.children ?? []))
    })

    return bottom
  }

  function addNode(
    node: VersionNode,
    x: number,
    y: number,
    width: number,
    height: number,
    depth: number,
  ): PositionedNode {
    const positioned = { node, x, y, width, height, depth }
    nodes.push(positioned)
    return positioned
  }
}

function drawTrunkConnectors(trunkNodes: PositionedNode[]) {
  return trunkNodes.slice(0, -1).map((trunkNode, index) => {
    const nextNode = trunkNodes[index + 1]
    const x = trunkNode.x + trunkNode.width / 2
    const startY = trunkNode.y + trunkNode.height
    const endY = nextNode.y

    return `M ${x} ${startY} V ${endY}`
  })
}

function getSubtreeHeight(node: VersionNode): number {
  if (!node.children?.length) {
    return NODE_HEIGHT
  }

  if (node.type === 'trunk') {
    const rowHeights: number[] = []
    for (let index = 0; index < node.children.length; index += 2) {
      const row = node.children.slice(index, index + 2)
      rowHeights.push(Math.max(...row.map((child) => getSubtreeHeight(child))))
    }

    const rowGapTotal = Math.max(0, rowHeights.length - 1) * BRANCH_GAP_Y
    return NODE_HEIGHT + BRANCH_GAP_Y + rowHeights.reduce((sum, height) => sum + height, 0) + rowGapTotal
  }

  return NODE_HEIGHT + SUB_BRANCH_GAP_Y + Math.max(...node.children.map((child) => getSubtreeHeight(child)))
}

function makeConnector(parent: PositionedNode, child: PositionedNode, forceDirectVertical = false): Connector {
  const parentX = parent.x + parent.width / 2
  const parentY = parent.y + parent.height
  const childX = child.x + child.width / 2
  const childY = child.y
  const midY = parentY + 24
  const isDirectVertical = forceDirectVertical || Math.abs(parentX - childX) < 1

  return {
    child: child.node,
    id: `${parent.node.id}-${child.node.id}`,
    path: isDirectVertical
      ? `M ${parentX} ${parentY} V ${childY}`
      : `M ${parentX} ${parentY} V ${midY} H ${childX} V ${childY}`,
  }
}

type VersionNodeButtonProps = {
  positioned: PositionedNode
  depth: number
  selected: boolean
  onSelect: (version: VersionNode) => void
  index: number
}

function VersionNodeButton({ positioned, depth, selected, onSelect, index }: VersionNodeButtonProps) {
  const { node, x, y, width, height } = positioned
  const color = statusColors[node.status]
  const isCompact = depth > 0

  return (
    <motion.button
      className={[
        'tree-version-node',
        node.type,
        isCompact ? 'compact' : 'major',
        selected ? 'selected' : '',
        node.status === 'planned' ? 'is-planned' : '',
      ].join(' ')}
      style={
        {
          '--status-color': color,
          height,
          left: x,
          top: y,
          width,
        } as CSSProperties
      }
      type="button"
      onClick={() => onSelect(node)}
      initial={{ opacity: 0, scale: 0.94, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.045, duration: 0.28 }}
      whileHover={{ scale: isCompact ? 1.04 : 1.025 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="tree-node-core" />
      <span className="tree-node-copy">
        <strong>{node.version}</strong>
        <span>{node.title}</span>
      </span>
      <span className="tree-node-type">{node.type}</span>
    </motion.button>
  )
}
