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
import type { GraphInitialData } from '@acdh/network-visualization'
import '@acdh/network-visualization/network-visualization.css'
import { CSSProperties, useEffect, useState } from 'react'

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

const nodes = range(100).map((key) => ({
  key: 'node' + String(key),
  attributes: { label: `Node ${key}`, color: random(categories).color },
}))

const edges = range(50).map((key) => ({
  key: 'edge' + String(key),
  source: random(nodes).key,
  target: random(nodes).key,
  attributes: { label: `Edge ${key}` },
}))

const data: GraphInitialData = {
  attributes: { name: 'Example' },
  options: { allowSelfLoops: true, multi: true },
  nodes,
  edges,
}

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

  const fadeColor = 'hsl(0deg 0% 0% / 15%)'

  useEffect(() => {
    const colorAccessor = forceGraph.nodeColor()
    const colorAccessorFn = accessor(colorAccessor)

    forceGraph.onNodeHover((hoveredNode, previousHoveredNode) => {
      if (hoveredNode != null) {
        const neighbors = graph.neighbors(hoveredNode.key)
        forceGraph.nodeColor((node) => {
          if (hoveredNode.key === node.key || neighbors.includes(node.key)) {
            return colorAccessorFn(node)
          }
          return fadeColor
        })
        forceGraph.nodeCanvasObjectMode((node) => {
          return neighbors.includes(node.key) ? 'after' : undefined
        })
        forceGraph.nodeCanvasObject((node, ctx, globalScale) => {
          if (globalScale < 1) return

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
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
          ctx.fillText(node.label, node.x!, node.y!)
        })
      } else {
        forceGraph.nodeCanvasObjectMode(() => undefined)
        forceGraph.nodeCanvasObject(() => undefined)
        forceGraph.nodeColor(colorAccessor)
      }
    })
  }, [forceGraph])

  return null
}

function ShowNodeDetailsPopoverOnClick() {
  const forceGraph = useForceGraph()
  const graph = useGraphData()
  const [nodeKey, setNodeKey] = useState<string | null>(null)

  useEffect(() => {
    forceGraph.onNodeClick((node, _event) => {
      setNodeKey(node.key)
    })
    forceGraph.onBackgroundClick((_event) => {
      setNodeKey(null)
    })
  }, [])

  if (nodeKey == null) return null

  const data = graph.getNodeAttributes(nodeKey)

  return (
    <aside>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </aside>
  )
}
