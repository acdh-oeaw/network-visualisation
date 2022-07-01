import { useCallback, useLayoutEffect, useRef } from 'react'

type Fn<TArgs extends Array<unknown>, TResult> = (...args: TArgs) => TResult

/**
 * Should be replaced with upstream `useEvent` once that lands in `react`.
 *
 * @see https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md
 */
export function useEvent<TArgs extends Array<unknown>, TResult>(
  handler: Fn<TArgs, TResult>,
): Fn<TArgs, TResult> {
  const handlerRef = useRef(handler)

  useLayoutEffect(() => {
    handlerRef.current = handler
  })

  return useCallback((...args: TArgs): TResult => {
    return handlerRef.current(...args)
  }, [])
}
