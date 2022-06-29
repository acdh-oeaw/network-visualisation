import type { ReactNode } from 'react'

type PanelOrientation = 'horizontal' | 'vertical'

type PanelPosition = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'

const classNames: Record<PanelPosition, string> = {
  'bottom-left': '',
  'bottom-right': '',
  'top-left': '',
  'top-right': '',
}

interface PanelProps {
  children: ReactNode
  /** @default 'horizontal' */
  orientation?: PanelOrientation
  /** @default 'top-right' */
  position?: PanelPosition
}

export function Panel(props: PanelProps): JSX.Element {
  const { children, orientation = 'horizontal', position = 'top-right' } = props

  return (
    <aside className={classNames[position]} data-orientation={orientation} data-position={position}>
      {children}
    </aside>
  )
}
