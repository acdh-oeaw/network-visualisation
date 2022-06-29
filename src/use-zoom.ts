import { useEffect, useMemo } from 'react'

import { useForceGraph } from './force-graph'
import { noop } from './noop'
import { useEvent } from './use-event'

interface UseZoomParams {
  /** @default 500 */
  animationDuration?: number
  onZoom?: () => void
  onZoomEnd?: () => void
}

interface UseZoomResult {
  zoomIn: () => void
  zoomOut: () => void
  zoomToFit: () => void
}

export function useZoom(params?: UseZoomParams): UseZoomResult {
  const {
    animationDuration = 500,
    onZoom: _onZoom = noop,
    onZoomEnd: _onZoomEnd = noop,
  } = params ?? {}

  const forceGraph = useForceGraph()
  const onZoom = useEvent(_onZoom)
  const onZoomEnd = useEvent(_onZoomEnd)

  useEffect(() => {
    forceGraph.onZoom(onZoom)
  }, [forceGraph, onZoom])

  useEffect(() => {
    forceGraph.onZoomEnd(onZoomEnd)
  }, [forceGraph, onZoomEnd])

  // TODO: useEvent
  const service = useMemo(() => {
    function zoomIn(): void {
      const zoom = forceGraph.zoom()
      forceGraph.zoom(zoom + 0.25, animationDuration)
    }

    function zoomOut(): void {
      const zoom = forceGraph.zoom()
      forceGraph.zoom(zoom - 0.25, animationDuration)
    }

    function zoomToFit(): void {
      forceGraph.zoomToFit(animationDuration)
    }

    return {
      zoomIn,
      zoomOut,
      zoomToFit,
    }
  }, [forceGraph])

  return service
}
