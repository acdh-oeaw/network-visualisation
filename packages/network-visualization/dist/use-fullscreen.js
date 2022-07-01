import { useCallback, useEffect, useState } from 'react';
import { useForceGraph } from './force-graph.js';
export function useFullScreen() {
    const forceGraph = useForceGraph();
    const [isFullScreen, setIsFullScreen] = useState(false);
    useEffect(() => {
        if (!document.fullscreenEnabled)
            return;
        function onToggleFullScreen() {
            // @ts-expect-error FIXME: Should be added upstream.
            const element = forceGraph.getContainer().parentElement;
            setIsFullScreen(document.fullscreenElement === element);
        }
        document.addEventListener('fullscreenchange', onToggleFullScreen);
        return () => {
            document.removeEventListener('fullscreenchange', onToggleFullScreen);
        };
    }, [forceGraph]);
    // TODO: useEvent
    const toggleFullScreen = useCallback(function toggleFullScreen() {
        // @ts-expect-error FIXME: Should be added upstream.
        const element = forceGraph.getContainer().parentElement;
        if (document.fullscreenElement === element) {
            document.exitFullscreen();
        }
        else {
            element.requestFullscreen();
        }
    }, [forceGraph]);
    return {
        isFullScreen,
        toggleFullScreen,
    };
}
//# sourceMappingURL=use-fullscreen.js.map