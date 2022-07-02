import { jsx as _jsx } from "react/jsx-runtime";
import { assert } from '@stefanprobst/assert';
import Graph from 'graphology';
import { createContext, forwardRef, useContext, useEffect, useImperativeHandle, useState, } from 'react';
import { useForceGraph } from './force-graph.js';
// TODO: pass through generics
export function useGraph(initialData, options) {
    const [graph] = useState(() => {
        if (initialData != null) {
            return Graph.from(initialData, options);
        }
        return new Graph(options);
    });
    return graph;
}
export function useForceGraphData(graph) {
    const forceGraph = useForceGraph();
    useEffect(() => {
        if (forceGraph == null)
            return;
        // TODO: debounce this?
        function updateGraphData() {
            const data = {
                links: graph.mapEdges((key, attributes, source, target) => {
                    return { ...attributes, key, source, target, label: attributes.label };
                }),
                nodes: graph.mapNodes((key, attributes) => {
                    return { ...attributes, key, label: attributes.label };
                }),
            };
            forceGraph.graphData(data);
        }
        updateGraphData();
        graph.addListener('edgeAdded', updateGraphData);
        graph.addListener('nodeAdded', updateGraphData);
        graph.addListener('edgeDropped', updateGraphData);
        graph.addListener('nodeDropped', updateGraphData);
        graph.addListener('edgesCleared', updateGraphData);
        graph.addListener('cleared', updateGraphData);
        return () => {
            graph.removeListener('edgeAdded', updateGraphData);
            graph.removeListener('nodeAdded', updateGraphData);
            graph.removeListener('edgeDropped', updateGraphData);
            graph.removeListener('nodeDropped', updateGraphData);
            graph.removeListener('edgesCleared', updateGraphData);
            graph.removeListener('cleared', updateGraphData);
        };
    }, [graph, forceGraph]);
}
const GraphDataContext = createContext(null);
export const GraphDataProvider = forwardRef(function GraphDataProvider(props, forwardedRef) {
    const { children, initialData, options } = props;
    const graph = useGraph(initialData, options);
    useForceGraphData(graph);
    useImperativeHandle(forwardedRef, () => {
        return graph;
    });
    return _jsx(GraphDataContext.Provider, { value: graph, children: children });
});
export function useGraphData() {
    const value = useContext(GraphDataContext);
    assert(value != null, '`useGraph` must be nested inside a `GraphDataProvider`.');
    return value;
}
//# sourceMappingURL=graph-data.js.map