import type { ReactNode } from 'react';
declare type PanelOrientation = 'horizontal' | 'vertical';
declare type PanelPosition = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
interface PanelProps {
    children: ReactNode;
    id?: string;
    /** @default 'horizontal' */
    orientation?: PanelOrientation;
    /** @default 'top-right' */
    position?: PanelPosition;
}
export declare function Panel(props: PanelProps): JSX.Element;
export {};
