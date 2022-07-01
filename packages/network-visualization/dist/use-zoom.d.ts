interface UseZoomParams {
    /** @default 500 */
    animationDuration?: number;
    onZoom?: () => void;
    onZoomEnd?: () => void;
}
interface UseZoomResult {
    zoomIn: () => void;
    zoomOut: () => void;
    zoomToFit: () => void;
}
export declare function useZoom(params?: UseZoomParams): UseZoomResult;
export {};
