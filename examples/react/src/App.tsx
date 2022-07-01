import { GraphData, ForceGraph, Panel, ZoomControls, PanelSeparator, FullScreenControls  } from "@acdh/network-visualization";
import type { GraphInitialData } from "@acdh/network-visualization";
import '@acdh/network-visualization/network-visualization.css'

function range(n: number): Array<number> {
  return Array.from(Array(n).keys());
}

function random<T>(values: Array<T>): T {
  return values[Math.floor(Math.random() * values.length)];
}

const nodes = range(100).map((key) => ({
  key: String(key),
  attributes: { label: `Node ${key}` },
}));

const edges = range(50).map((key) => ({
  key: String(key),
  source: random(nodes).key,
  target: random(nodes).key,
  attributes: { label: `Edge ${key}` },
}));

const data: GraphInitialData = { attributes: {}, options: {}, nodes, edges };

export function App() {
  return (
    <main>
      <h1>Network visualization</h1>
      <ForceGraph>
        <GraphData initialData={data}>
          <Panel position="top-left" orientation="vertical">
            <ZoomControls />
            <PanelSeparator />
            <FullScreenControls />
          </Panel>
        </GraphData>
      </ForceGraph>
    </main>
  );
}
