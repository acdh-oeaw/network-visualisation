import { assert } from '@stefanprobst/assert'
import type { ForceGraphInstance } from 'force-graph'
import ForceGraph from 'force-graph'
import type { ReactNode, RefObject } from 'react'
import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

export function useForceGraphInstance<T extends HTMLElement>(
  ref: RefObject<T>,
): ForceGraphInstance | null {
  const [forceGraphInstance, setForceGraphInstance] = useState<{
    forceGraph: ForceGraphInstance | null
  }>({
    forceGraph: null,
  })

  useEffect(() => {
    const element = ref.current
    if (element == null) return

    // TODO: dynamic import for ssr
    // const { default: ForceGraph } = await import('force-graph')
    const instance = ForceGraph()(element)

    /** `graphology` uses `key` instead of `id`. */
    instance.nodeId('key')

    /** Default is `name`. */
    instance.nodeLabel('label')
    instance.linkLabel('label')

    // @ts-expect-error FIXME: Should be added upstream.
    // @see https://github.com/stefanprobst/force-graph/tree/feat/add-get-container-method
    instance.getContainer = function getContainer(): T {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return element!
    }

    const observer = new ResizeObserver((entries) => {
      const [entry] = entries
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { width, height } = entry!.contentRect
      instance.width(width)
      instance.height(height)
    })

    observer.observe(element)

    setForceGraphInstance({ forceGraph: instance })

    return () => {
      observer.unobserve(element)
      observer.disconnect()
      instance._destructor()
    }
  }, [ref])

  return forceGraphInstance.forceGraph
}

const ForceGraphContext = createContext<ForceGraphInstance | null>(null)

interface ForceGraphProviderProps {
  children?: ReactNode
  id?: string
}

export const ForceGraphProvider = forwardRef<ForceGraphInstance | null, ForceGraphProviderProps>(
  function ForceGraphProvider(props, forwardedRef): JSX.Element {
    const { children, id } = props

    const wrapperRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const forceGraphInstance = useForceGraphInstance(containerRef)
    useImperativeHandle<ForceGraphInstance | null, ForceGraphInstance | null>(forwardedRef, () => {
      return forceGraphInstance
    })

    return (
      <div ref={wrapperRef} data-network-visualization id={id}>
        <div ref={containerRef} data-network-visualization-container />
        {forceGraphInstance != null ? (
          <ForceGraphContext.Provider value={forceGraphInstance}>
            {children}
          </ForceGraphContext.Provider>
        ) : null}
      </div>
    )
  },
)

export function useForceGraph(): ForceGraphInstance {
  const value = useContext(ForceGraphContext)

  assert(value != null, '`useForceGraph` must be nested inside an `ForceGraphProvider`.')

  return value
}
