import {
  MinusCircleIcon as ZoomOutIcon,
  PlusCircleIcon as ZoomInIcon,
  SupportIcon as ZoomToFitIcon,
} from '@heroicons/react/outline/index.js'
import { Fragment } from 'react'

import { useZoom } from './use-zoom.js'

interface ZoomControlsProps {
  /** @default 500 */
  animationDuration?: number
  onZoom?: () => void
  onZoomEnd?: () => void
}

export function ZoomControls(props: ZoomControlsProps): JSX.Element {
  const { zoomIn, zoomOut, zoomToFit } = useZoom(props)

  return (
    <Fragment>
      <button aria-label="Zoom in" onClick={zoomIn}>
        <ZoomInIcon width="1em" />
      </button>
      <button aria-label="Zoom out" onClick={zoomOut}>
        <ZoomOutIcon width="1em" />
      </button>
      <button aria-label="Zoom to fit" onClick={zoomToFit}>
        <ZoomToFitIcon width="1em" />
      </button>
    </Fragment>
  )
}
