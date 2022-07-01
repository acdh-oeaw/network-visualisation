import { jsx as _jsx } from "react/jsx-runtime";
const positions = {
    'bottom-left': 'bottom left',
    'bottom-right': 'bottom right',
    'top-left': 'top left',
    'top-right': 'top right',
};
export function Panel(props) {
    const { children, id, orientation = 'horizontal', position = 'top-right' } = props;
    return (_jsx("aside", { "data-network-visualization-panel": true, "data-orientation": orientation, "data-position": positions[position], id: id, children: children }));
}
//# sourceMappingURL=panel.js.map