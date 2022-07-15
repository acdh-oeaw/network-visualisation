import '@acdh/network-visualization/network-visualization.css'

import type { CanvasCustomRenderFn, NodeObject } from '@acdh/network-visualization'
import {
  ForceGraph,
  FullScreenControls,
  GraphData,
  Panel,
  PanelSeparator,
  useForceGraph,
  useGraphData,
  ZoomControls,
} from '@acdh/network-visualization'
import { arrow, flip, offset, shift, useFloating } from '@floating-ui/react-dom'
import accessor from 'accessor-fn'
import Graph from 'graphology'
import generate from 'graphology-generators/random/clusters'
import type { Attributes } from 'graphology-types'
import type { CSSProperties, ReactNode } from 'react'
import { Fragment, useEffect, useRef, useState } from 'react'

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

export function App(): JSX.Element {
  return (
    <div className="page-layout">
      <header>
        <h1>Network visualization</h1>
      </header>
      <main>
        <ForceGraph>
          <GraphData initialData={data}>
            <HighlightNeighborsOnHover />
            <ShowNodeDetailsPopoverOnClick>
              {(node, data): JSX.Element => {
                return (
                  <div>
                    <strong>{data.label}</strong>
                  </div>
                )
              }}
            </ShowNodeDetailsPopoverOnClick>
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

function Legend(): JSX.Element {
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

function HighlightNeighborsOnHover(): null {
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
      if (
        (typeof edge.source === 'object' && edge.source?.key === hovered.current) ||
        (typeof edge.target === 'object' && edge.target?.key === hovered.current)
      ) {
        return 4
      }
      return 1
    })

    forceGraph.onNodeHover((hoveredNode, _previousHoveredNode) => {
      if (hoveredNode != null) {
        hovered.current = hoveredNode.key
        hoveredNeighbors.current = graph.neighbors(hoveredNode.key)
      } else {
        hovered.current = null
        hoveredNeighbors.current = []
      }
    })
  }, [forceGraph, graph])

  return null
}

interface ShowNodeDetailsPopoverOnClickProps {
  children: (node: NodeObject, data: Attributes) => ReactNode
}

function ShowNodeDetailsPopoverOnClick(
  props: ShowNodeDetailsPopoverOnClickProps,
): JSX.Element | null {
  const { children } = props

  const forceGraph = useForceGraph()
  const graph = useGraphData()
  const [node, setNode] = useState<NodeObject | null>(null)
  const arrowRef = useRef<HTMLDivElement>(null)
  const { x, y, reference, floating, strategy, placement, middlewareData } = useFloating({
    placement: 'top',
    middleware: [offset(8), flip(), shift({ padding: 8 }), arrow({ element: arrowRef })],
  })

  useEffect(() => {
    forceGraph.onNodeClick((node, event) => {
      const x = event.clientX
      const y = event.clientY
      setNode(node)
      reference({
        getBoundingClientRect() {
          return { width: 0, height: 0, x, y, top: y, left: x, right: x, bottom: y }
        },
      })
    })
  }, [forceGraph, reference])

  useEffect(() => {
    if (node == null) return

    function close(): void {
      setNode(null)
    }
    function closeOnEscapeKey(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        setNode(null)
      }
    }

    window.addEventListener('scroll', close, { passive: true })
    window.addEventListener('resize', close, { passive: true })
    window.addEventListener('keydown', closeOnEscapeKey)

    return () => {
      window.removeEventListener('scroll', close)
      window.removeEventListener('resize', close)
      window.removeEventListener('keydown', closeOnEscapeKey)
    }
  }, [node])

  if (node == null) return null

  const data = graph.getNodeAttributes(node.key)

  const staticSide = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }[placement.split('-')[0]]

  return (
    <Fragment>
      <div
        onClick={() => {
          setNode(null)
        }}
        style={{ position: 'fixed', inset: 0 }}
      />
      <aside
        ref={floating}
        className="popover"
        style={{ '--strategy': strategy, '--x': px(x), '--y': px(y) } as CSSProperties}
      >
        {children(node, data)}
        <div
          ref={arrowRef}
          className="popover-arrow"
          style={
            {
              '--arrow-x': px(middlewareData.arrow?.x),
              '--arrow-y': px(middlewareData.arrow?.y),
              [staticSide as string]: '-4px',
            } as CSSProperties
          }
        />
      </aside>
    </Fragment>
  )
}

function px(px: number | null | undefined): string | undefined {
  if (px == null) return undefined
  return px + 'px'
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
): void {
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
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  roundedRect(ctx, node.x! - width / 2, node.y! - height / 2, width, height, radius)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  ctx.fillStyle = node.color!
  ctx.fill()

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#fff'
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  ctx.fillText(node.label, node.x!, node.y!)
}
