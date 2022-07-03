import accessor from 'accessor-fn'
import {
  GraphData,
  ForceGraph,
  Panel,
  ZoomControls,
  PanelSeparator,
  FullScreenControls,
  useForceGraph,
  useGraphData,
} from '@acdh/network-visualization'
import type {
  GraphInitialData,
  CanvasCustomRenderFn,
  NodeObject,
} from '@acdh/network-visualization'
import '@acdh/network-visualization/network-visualization.css'
import { CSSProperties, useEffect, useRef, useState } from 'react'
import generate from 'graphology-generators/random/clusters'
import Graph from 'graphology'

function range(n: number): Array<number> {
  return Array.from(Array(n).keys())
}

function random<T>(values: Array<T>): T {
  return values[Math.floor(Math.random() * values.length)]
}

const colors = ['#389edb', '#88dbdf', '#f82a61', '#1f2937', '#f7a20f']

const categories = range(5).map((key) => ({
  key: 'category' + String(key),
  label: `Category ${key}`,
  color: colors[key],
}))

const data = generate(Graph, { order: 250, size: 500, clusters: 15 })

data.forEachNode((key, attributes) => {
  attributes.label = `Node ${key}`
  attributes.color = random(categories).color
})

data.forEachEdge((key, attributes) => {
  attributes.label = `Edge ${key}`
})

export function App() {
  return (
    <div className="page-layout">
      <header>
        <h1>Network visualization</h1>
      </header>
      <main>
        <ForceGraph>
          <GraphData initialData={data}>
            <HighlightNeighborsOnHover />
            <ShowNodeDetailsPopoverOnClick />
          </GraphData>

          <Panel position="top-left" orientation="vertical">
            <ZoomControls />
            <PanelSeparator />
            <FullScreenControls />
          </Panel>

          <Panel>
            <Legend />
          </Panel>
        </ForceGraph>
      </main>
      <footer>
        <small>&copy; {new Date().getUTCFullYear()} ACDH-CH</small>
      </footer>
    </div>
  )
}

function Legend() {
  return (
    <div>
      <ul className="legend" role="list">
        {categories.map((category) => {
          return (
            <li key={category.key} className="legend-item">
              <div
                className="legend-item-color"
                style={{ '--nv-legend-item-color': category.color } as CSSProperties}
              />
              {category.label}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function HighlightNeighborsOnHover() {
  const forceGraph = useForceGraph()
  const graph = useGraphData()

  const hoveredNeighbors = useRef<Array<string>>([])
  const hovered = useRef<string | null>(null)

  const fadeColor = 'hsl(0deg 0% 0% / 15%)'

  useEffect(() => {
    const colorAccessor = forceGraph.nodeColor()
    const colorAccessorFn = accessor(colorAccessor)

    forceGraph.autoPauseRedraw(false)

    forceGraph.nodeColor((node) => {
      if (
        hovered.current == null ||
        hovered.current === node.key ||
        hoveredNeighbors.current.includes(node.key)
      ) {
        return colorAccessorFn(node)
      }

      return fadeColor
    })

    forceGraph.nodeCanvasObjectMode((node) => {
      return hoveredNeighbors.current.includes(node.key) ? 'after' : undefined
    })

    forceGraph.nodeCanvasObject(renderTextLabel)

    forceGraph.linkWidth((edge) => {
      if (edge.source.key === hovered.current || edge.target.key === hovered.current) {
        return 4
      }
      return 1
    })

    forceGraph.onNodeHover((hoveredNode, previousHoveredNode) => {
      if (hoveredNode != null) {
        hovered.current = hoveredNode.key
        hoveredNeighbors.current = graph.neighbors(hoveredNode.key)
      } else {
        hovered.current = null
        hoveredNeighbors.current = []
      }
    })
  }, [forceGraph])

  return null
}

function ShowNodeDetailsPopoverOnClick() {
  const forceGraph = useForceGraph()
  const graph = useGraphData()
  const [details, setDetails] = useState<{ node: NodeObject; x: number; y: number } | null>(null)

  useEffect(() => {
    forceGraph.onNodeClick((node, event) => {
      const [x, y] = getCoordinates(event, forceGraph.getContainer())
      setDetails({ node, x, y })
    })
  }, [])

  if (details == null) return null

  const data = graph.getNodeAttributes(details.node.key)

  return (
    <aside
      style={{
        position: 'absolute',
        left: details.x,
        top: details.y,
        border: '1px solid',
        backgroundColor: 'white',
      }}
    >
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </aside>
  )
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes#making_combinations
 */
function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath()
  ctx.moveTo(x, y + radius)
  ctx.arcTo(x, y + height, x + radius, y + height, radius)
  ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius)
  ctx.arcTo(x + width, y, x + width - radius, y, radius)
  ctx.arcTo(x, y, x, y + radius, radius)
}

const renderTextLabel: CanvasCustomRenderFn<NodeObject> = function renderTextLabel(
  node,
  ctx,
  globalScale,
) {
  if (globalScale < 1) return

  const fontSize = 12 / globalScale
  ctx.font = `${fontSize}px system-ui`
  const textWidth = ctx.measureText(node.label).width

  const [width, height] = [textWidth, fontSize].map((n) => n + fontSize * 0.75)

  const radius = 4 / globalScale
  roundedRect(ctx, node.x! - width / 2, node.y! - height / 2, width, height, radius)
  ctx.fillStyle = node.color!
  ctx.fill()

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#fff'
  ctx.fillText(node.label, node.x!, node.y!)
}

function getCoordinates(event: MouseEvent, element: HTMLElement) {
  if ('layerX' in event) {
    // @ts-expect-error Exists in Firefox at least, but non-standard.
    return [event.layerX, event.layerY]
  }

  const rect = element.getBoundingClientRect()

  return [event.pageX - rect.left - window.scrollX, event.pageY - rect.top - window.scrollY]
}
