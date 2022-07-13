import { jsx as _jsx } from "react/jsx-runtime";
import { ArrowsExpandIcon as FullScreenIcon } from '@heroicons/react/outline/index.js';
import { useFullScreen } from './use-fullscreen.js';
export function FullScreenControls() {
    const { toggleFullScreen } = useFullScreen();
    return (_jsx("button", { "aria-label": "Toggle fullscreen", onClick: toggleFullScreen, children: _jsx(FullScreenIcon, { width: "1em" }) }));
}
//# sourceMappingURL=fullscreen-controls.js.map