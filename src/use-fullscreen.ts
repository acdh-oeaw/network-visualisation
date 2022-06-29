import { useEffect, useState } from 'react'

import { useForceGraph } from './force-graph'

interface UseFullScreenResult {
  isFullScreen: boolean
  toggleFullScreen: () => void
}

export function useFullScreen(): UseFullScreenResult {
  const forceGraph = useForceGraph()
  const [isFullScreen, setIsFullScreen] = useState(false)

  useEffect(() => {
    if (!document.fullscreenEnabled) return

    function onToggleFullScreen(): void {
      const element = forceGraph.getContainer()

      setIsFullScreen(document.fullscreenElement === element)
    }

    document.addEventListener('fullscreenchange', onToggleFullScreen)

    return (): void => {
      document.removeEventListener('fullscreenchange', onToggleFullScreen)
    }
  }, [forceGraph])

  // TODO: memoize
  function toggleFullScreen(): void {
    const element = forceGraph.getContainer()

    if (document.fullscreenElement === element) {
      document.exitFullscreen()
    } else {
      element.requestFullscreen()
    }
  }

  const service = {
    isFullScreen,
    toggleFullScreen,
  }

  return service
}
