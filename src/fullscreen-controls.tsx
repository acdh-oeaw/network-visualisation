import { DesktopComputerIcon as FullScreenIcon } from '@heroicons/react/outline/index.js'

import { useFullScreen } from './use-fullscreen.js'

export function FullScreenControls(): JSX.Element {
  const { toggleFullScreen } = useFullScreen()

  return (
    <button aria-label="Toggle fullscreen" onClick={toggleFullScreen}>
      <FullScreenIcon />
    </button>
  )
}
