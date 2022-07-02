import Graph from 'graphology';
import type { ReactNode } from 'react';
export declare type GraphInitialData = Parameters<typeof Graph.from>[0];
export declare type GraphOptions = Parameters<typeof Graph.from>[1];
export declare function useGraph(initialData?: GraphInitialData, options?: GraphOptions): Graph;
export declare function useForceGraphData(graph: Graph): void;
interface GraphDataProviderProps {
    children?: ReactNode;
    initialData?: GraphInitialData;
    options?: GraphOptions;
}
export declare const GraphDataProvider: import("react").ForwardRefExoticComponent<GraphDataProviderProps & import("react").RefAttributes<Graph<import("graphology-types").Attributes, import("graphology-types").Attributes, import("graphology-types").Attributes> | null>>;
export declare function useGraphData(): Graph;
export {};
