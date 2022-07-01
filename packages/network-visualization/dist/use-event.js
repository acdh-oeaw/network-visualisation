import { useCallback, useLayoutEffect, useRef } from 'react';
/**
 * Should be replaced with upstream `useEvent` once that lands in `react`.
 *
 * @see https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md
 */
export function useEvent(handler) {
    const handlerRef = useRef(handler);
    useLayoutEffect(() => {
        handlerRef.current = handler;
    });
    return useCallback((...args) => {
        return handlerRef.current(...args);
    }, []);
}
//# sourceMappingURL=use-event.js.map