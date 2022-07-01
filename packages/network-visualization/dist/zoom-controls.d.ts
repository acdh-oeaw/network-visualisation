/// <reference types="react" />
interface ZoomControlsProps {
    /** @default 500 */
    animationDuration?: number;
    onZoom?: () => void;
    onZoomEnd?: () => void;
}
export declare function ZoomControls(props: ZoomControlsProps): JSX.Element;
export {};
