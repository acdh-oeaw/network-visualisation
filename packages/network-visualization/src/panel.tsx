import type { ReactNode } from 'react'

type PanelOrientation = 'horizontal' | 'vertical'

type PanelPosition = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'

const positions: Record<PanelPosition, string> = {
  'bottom-left': 'bottom left',
  'bottom-right': 'bottom right',
  'top-left': 'top left',
  'top-right': 'top right',
}

interface PanelProps {
  children: ReactNode
  id?: string
  /** @default 'horizontal' */
  orientation?: PanelOrientation
  /** @default 'top-right' */
  position?: PanelPosition
}

export function Panel(props: PanelProps): JSX.Element {
  const { children, id, orientation = 'horizontal', position = 'top-right' } = props

  return (
    <aside data-network-visualization-panel data-orientation={orientation} data-position={positions[position]} id={id}>
      {children}
    </aside>
  )
}
