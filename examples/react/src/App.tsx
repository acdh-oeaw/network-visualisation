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

const categories = range(5).map((key) => ({
  key: String(key),
  label: `Category ${key}`,
}))

const nodes = range(100).map((key) => ({
  key: String(key),
  attributes: { label: `Node ${key}`, type: random(categories).key },
}))

const edges = range(50).map((key) => ({
  key: String(key),
  source: random(nodes).key,
  target: random(nodes).key,
  attributes: { label: `Edge ${key}` },
}))

const data: GraphInitialData = { attributes: {}, options: {}, nodes, edges }

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
              <div style={{ width: 12, height: 12, backgroundColor: 'red', borderRadius: 4 }} />
              {category.label}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
