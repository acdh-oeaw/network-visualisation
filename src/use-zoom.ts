import { useCallback, useEffect } from 'react'

import { animationDuration as defaultAnimationDuration } from './config'
import { useForceGraph } from './force-graph.js'
import { noop } from './noop.js'
import { useEvent } from './use-event.js'

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
    animationDuration = defaultAnimationDuration,
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
  const zoomIn = useCallback(
    function zoomIn(): void {
      const zoom = forceGraph.zoom()
      forceGraph.zoom(zoom + 0.25, animationDuration)
    },
    [forceGraph],
  )

  // TODO: useEvent
  const zoomOut = useCallback(
    function zoomOut(): void {
      const zoom = forceGraph.zoom()
      forceGraph.zoom(zoom - 0.25, animationDuration)
    },
    [forceGraph],
  )

  // TODO: useEvent
  const zoomToFit = useCallback(
    function zoomToFit(): void {
      forceGraph.zoomToFit(animationDuration)
    },
    [forceGraph],
  )

  return {
    zoomIn,
    zoomOut,
    zoomToFit,
  }
}
