import type { ForceGraphInstance } from 'force-graph';
import type { ReactNode, RefObject } from 'react';
export declare function useForceGraphInstance<T extends HTMLElement>(ref: RefObject<T>): ForceGraphInstance | null;
interface ForceGraphProviderProps {
    children?: ReactNode;
    id?: string;
}
export declare const ForceGraphProvider: import("react").ForwardRefExoticComponent<ForceGraphProviderProps & import("react").RefAttributes<ForceGraphInstance | null>>;
export declare function useForceGraph(): ForceGraphInstance;
declare module 'force-graph' {
    interface NodeObject {
        key: string;
        label: string;
        color?: string;
    }
    interface LinkObject {
        key: string;
        label: string;
    }
}
export {};
