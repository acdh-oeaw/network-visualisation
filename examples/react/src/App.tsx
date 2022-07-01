import {
  GraphData,
  ForceGraph,
  Panel,
  ZoomControls,
  PanelSeparator,
  FullScreenControls,
} from '@acdh/network-visualization'
import type { GraphInitialData } from '@acdh/network-visualization'
import '@acdh/network-visualization/network-visualization.css'

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
  color: colors[key]
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

const data: GraphInitialData = { attributes: {}, options: { multi: true }, nodes, edges }

export function App() {
  return (
    <div className="page-layout">
      <header>
        <h1>Network visualization</h1>
      </header>
      <main>
        <ForceGraph>
          <GraphData initialData={data}>
            <Panel position="top-left" orientation="vertical">
              <ZoomControls />
              <PanelSeparator />
              <FullScreenControls />
            </Panel>
            <Panel>
              <Legend />
            </Panel>
          </GraphData>
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
      <ul role="list">
        {categories.map((category) => {
          return (
            <li key={category.key} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <div style={{ width: 12, height: 12, backgroundColor: category.color, borderRadius: 4 }} />
              {category.label}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
