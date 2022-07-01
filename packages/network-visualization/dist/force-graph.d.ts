import type { ForceGraphInstance } from 'force-graph';
import type { RefObject } from 'react';
export declare function useForceGraphInstance<T extends HTMLElement>(ref: RefObject<T>): ForceGraphInstance | null;
interface ForceGraphProviderProps {
    children: JSX.Element;
    id?: string;
}
export declare const ForceGraphProvider: import("react").ForwardRefExoticComponent<ForceGraphProviderProps & import("react").RefAttributes<ForceGraphInstance | null>>;
export declare function useForceGraph(): ForceGraphInstance;
export {};
