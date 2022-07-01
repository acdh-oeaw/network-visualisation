import { useEffect, useState } from 'react';
export function useResizeObserver(containerRef) {
    const [rect, setRect] = useState(null);
    useEffect(() => {
        let canceled = false;
        const element = containerRef.current;
        if (element == null)
            return;
        const instance = new ResizeObserver((entries) => {
            if (canceled)
                return;
            const [entry] = entries;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            setRect(entry.contentRect);
        });
        instance.observe(element);
        return () => {
            canceled = true;
            instance.unobserve(element);
            instance.disconnect();
        };
    }, [containerRef]);
    return rect;
}
//# sourceMappingURL=use-resize-observer.js.map