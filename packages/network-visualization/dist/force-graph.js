import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { assert } from '@stefanprobst/assert';
import ForceGraph from 'force-graph';
import { createContext, forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState, } from 'react';
export function useForceGraphInstance(ref) {
    const [forceGraphInstance, setForceGraphInstance] = useState({
        forceGraph: null,
    });
    useEffect(() => {
        const element = ref.current;
        if (element == null)
            return;
        // TODO: dynamic import for ssr
        // const { default: ForceGraph } = await import('force-graph')
        const instance = ForceGraph()(element);
        /** `graphology` uses `key` instead of `id`. */
        instance.nodeId('key');
        /** Default is `name`. */
        instance.nodeLabel('label');
        instance.linkLabel('label');
        instance.nodeAutoColorBy('type');
        instance.linkAutoColorBy('type');
        // @ts-expect-error FIXME: Should be added upstream.
        // @see https://github.com/stefanprobst/force-graph/tree/feat/add-get-container-method
        instance.getContainer = function getContainer() {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return element;
        };
        const observer = new ResizeObserver((entries) => {
            const [entry] = entries;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const { width, height } = entry.contentRect;
            instance.width(width);
            instance.height(height);
        });
        observer.observe(element);
        setForceGraphInstance({ forceGraph: instance });
        return () => {
            observer.unobserve(element);
            observer.disconnect();
            instance._destructor();
        };
    }, [ref]);
    return forceGraphInstance.forceGraph;
}
const ForceGraphContext = createContext(null);
export const ForceGraphProvider = forwardRef(function ForceGraphProvider(props, forwardedRef) {
    const { children, id } = props;
    const wrapperRef = useRef(null);
    const containerRef = useRef(null);
    const forceGraphInstance = useForceGraphInstance(containerRef);
    useImperativeHandle(forwardedRef, () => {
        return forceGraphInstance;
    });
    return (_jsxs("div", { ref: wrapperRef, "data-network-visualization": true, id: id, children: [_jsx("div", { ref: containerRef, "data-network-visualization-container": true }), forceGraphInstance != null ? (_jsx(ForceGraphContext.Provider, { value: forceGraphInstance, children: children })) : null] }));
});
export function useForceGraph() {
    const value = useContext(ForceGraphContext);
    assert(value != null, '`useForceGraph` must be nested inside an `ForceGraphProvider`.');
    return value;
}
//# sourceMappingURL=force-graph.js.map