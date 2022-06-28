import { assert } from '@stefanprobst/assert'
import type { ForceGraphInstance } from 'force-graph'
import ForceGraph from 'force-graph'
import {
  createContext,
  forwardRef,
  Fragment,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

export function useForceGraphInstance(element: HTMLElement | null): ForceGraphInstance | null {
  const [forceGraphInstance, setForceGraphInstance] = useState<ForceGraphInstance | null>(null)

  useEffect(() => {
    if (element == null) return

    // TODO: dynamic import for ssr
    // const { default: ForceGraph } = await import('force-graph')
    const instance = ForceGraph()(element)

    /** `graphology` uses `key` instead of `id`. */
    instance.nodeId('key')

    /** Default is `name`. */
    instance.nodeLabel('label')
    instance.linkLabel('label')

    setForceGraphInstance(instance)

    return () => {
      instance._destructor()
    }
  }, [element])

  return forceGraphInstance
}

const ForceGraphContext = createContext<ForceGraphInstance | null>(null)

interface ForceGraphProviderProps {
  children: JSX.Element
}

export const ForceGraphProvider = forwardRef<ForceGraphInstance | null, ForceGraphProviderProps>(
  function ForceGraphProvider(props, forwardedRef): JSX.Element {
    const { children } = props

    const containerRef = useRef<HTMLDivElement>(null)
    const forceGraphInstance = useForceGraphInstance(containerRef.current)
    useImperativeHandle<ForceGraphInstance | null, ForceGraphInstance | null>(forwardedRef, () => {
      return forceGraphInstance
    })

    return (
      <Fragment>
        <div ref={containerRef} />
        <ForceGraphContext.Provider value={forceGraphInstance}>
          {children}
        </ForceGraphContext.Provider>
      </Fragment>
    )
  },
)

export function useForceGraph() {
  const value = useContext(ForceGraphContext)

  assert(value != null, '`useForceGraph` must be nested inside an `ForceGraphProvider`.')

  return value
}
