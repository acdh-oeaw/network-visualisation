import {
  MinusCircleIcon as ZoomOutIcon,
  PlusCircleIcon as ZoomInIcon,
  SupportIcon as ZoomToFitIcon,
} from '@heroicons/react/outline'
import { Fragment } from 'react'

import { useZoom } from './use-zoom'

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
        <ZoomInIcon />
      </button>
      <button aria-label="Zoom out" onClick={zoomOut}>
        <ZoomOutIcon />
      </button>
      <button aria-label="Zoom to fit" onClick={zoomToFit}>
        <ZoomToFitIcon />
      </button>
    </Fragment>
  )
}
