import { useFullScreen } from './use-fullscreen'

export function FullScreenControls(): JSX.Element {
  const { isFullScreen, toggleFullScreen } = useFullScreen()

  return <button aria-label="Toggle fullscreen" onClick={toggleFullScreen}></button>
}
