import { useCallback, useEffect } from 'react';
import { animationDuration as defaultAnimationDuration } from './config.js';
import { useForceGraph } from './force-graph.js';
import { noop } from './noop.js';
import { useEvent } from './use-event.js';
export function useZoom(params) {
    const { animationDuration = defaultAnimationDuration, onZoom: _onZoom = noop, onZoomEnd: _onZoomEnd = noop, } = params !== null && params !== void 0 ? params : {};
    const forceGraph = useForceGraph();
    const onZoom = useEvent(_onZoom);
    const onZoomEnd = useEvent(_onZoomEnd);
    useEffect(() => {
        forceGraph.onZoom(onZoom);
    }, [forceGraph, onZoom]);
    useEffect(() => {
        forceGraph.onZoomEnd(onZoomEnd);
    }, [forceGraph, onZoomEnd]);
    // TODO: useEvent
    const zoomIn = useCallback(function zoomIn() {
        const zoom = forceGraph.zoom();
        forceGraph.zoom(zoom + 0.25, animationDuration);
    }, [forceGraph, animationDuration]);
    // TODO: useEvent
    const zoomOut = useCallback(function zoomOut() {
        const zoom = forceGraph.zoom();
        forceGraph.zoom(zoom - 0.25, animationDuration);
    }, [forceGraph, animationDuration]);
    // TODO: useEvent
    const zoomToFit = useCallback(function zoomToFit() {
        forceGraph.zoomToFit(animationDuration);
    }, [forceGraph, animationDuration]);
    return {
        zoomIn,
        zoomOut,
        zoomToFit,
    };
}
//# sourceMappingURL=use-zoom.js.map