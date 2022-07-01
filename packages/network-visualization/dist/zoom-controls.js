import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MinusCircleIcon as ZoomOutIcon, PlusCircleIcon as ZoomInIcon, SupportIcon as ZoomToFitIcon, } from '@heroicons/react/outline/index.js';
import { Fragment } from 'react';
import { useZoom } from './use-zoom.js';
export function ZoomControls(props) {
    const { zoomIn, zoomOut, zoomToFit } = useZoom(props);
    return (_jsxs(Fragment, { children: [_jsx("button", { "aria-label": "Zoom in", onClick: zoomIn, children: _jsx(ZoomInIcon, { width: "1em" }) }), _jsx("button", { "aria-label": "Zoom out", onClick: zoomOut, children: _jsx(ZoomOutIcon, { width: "1em" }) }), _jsx("button", { "aria-label": "Zoom to fit", onClick: zoomToFit, children: _jsx(ZoomToFitIcon, { width: "1em" }) })] }));
}
//# sourceMappingURL=zoom-controls.js.map