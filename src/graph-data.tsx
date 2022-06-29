import { assert } from '@stefanprobst/assert'
import type { GraphData } from 'force-graph'
import Graph from 'graphology'
import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'

import { useForceGraph } from './force-graph.js'

export type GraphInitialData = Parameters<typeof Graph.from>[0]

export type GraphOptions = Parameters<typeof Graph.from>[1]

// TODO: pass through generics
export function useGraph(initialData?: GraphInitialData, options?: GraphOptions): Graph {
  const [graph] = useState(() => {
    if (initialData != null) {
      return Graph.from(initialData, options)
    }
    return new Graph(options)
  })

  return graph
}

export function useForceGraphData(graph: Graph): void {
  const forceGraph = useForceGraph()

  useEffect(() => {
    if (forceGraph == null) return

    // TODO: debounce this?
    function updateGraphData(): void {
      const data: GraphData = {
        links: graph.mapEdges((key, attributes, source, target) => {
          return { key, source, target, label: attributes.label }
        }),
        nodes: graph.mapNodes((key, attributes) => {
          return { key, label: attributes.label }
        }),
      }

      forceGraph.graphData(data)
    }

    graph.addListener('edgeAdded', updateGraphData)
    graph.addListener('nodeAdded', updateGraphData)
    graph.addListener('edgeDropped', updateGraphData)
    graph.addListener('nodeDropped', updateGraphData)
    graph.addListener('edgesCleared', updateGraphData)
    graph.addListener('cleared', updateGraphData)

    return () => {
      graph.removeListener('edgeAdded', updateGraphData)
      graph.removeListener('nodeAdded', updateGraphData)
      graph.removeListener('edgeDropped', updateGraphData)
      graph.removeListener('nodeDropped', updateGraphData)
      graph.removeListener('edgesCleared', updateGraphData)
      graph.removeListener('cleared', updateGraphData)
    }
  }, [graph, forceGraph])
}

const GraphDataContext = createContext<Graph | null>(null)

interface GraphDataProviderProps {
  children?: JSX.Element
  initialData?: GraphInitialData
  options?: GraphOptions
}

export const GraphDataProvider = forwardRef<Graph | null, GraphDataProviderProps>(
  function GraphDataProvider(props, forwardedRef): JSX.Element {
    const { children, initialData, options } = props

    const graph = useGraph(initialData, options)
    useForceGraphData(graph)
    useImperativeHandle<Graph | null, Graph | null>(forwardedRef, () => {
      return graph
    })

    return <GraphDataContext.Provider value={graph}>{children}</GraphDataContext.Provider>
  },
)

export function useGraphData(): Graph {
  const value = useContext(GraphDataContext)

  assert(value != null, '`useGraph` must be nested inside a `GraphDataProvider`.')

  return value
}
