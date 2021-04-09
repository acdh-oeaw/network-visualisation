# network-visualization

This is a React component to visualize graph data in 2D and 3D. It is based on
[`force-graph`](https://github.com/vasturiano/force-graph) and
[`3d-force-graph`](https://github.com/vasturiano/3d-force-graph), which use
[`d3-force`](https://github.com/d3/d3-force) and
[`d3-force-3d`](https://github.com/vasturiano/d3-force-3d) for the simulation.

## How to install

Install it as a package from NPM:

```sh
npm i @acdh/network-visualization
```

You can also include the UMD build in a `script` tag, and access the components
on the `NetworkVisualization` global:

```html
<script src="network-visualization.umd.js"></script>
```

The UMD build is also available via CDN:

```html
<script src="https://unpkg.com/@acdh/network-visualization@0/lib/network-visualization.umd.js"></script>
```

When using the UMD build, make sure to also include `react` and, if you plan to
use the 3D component, `three` (note that `three` does not follow semantic
versioning, last known working version is 0.126.1):

```html
<script
  crossorigin
  src="https://unpkg.com/react@16/umd/react.production.min.js"
></script>
<script
  crossorigin
  src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"
></script>
<script
  crossorigin
  src="https://unpkg.com/three@0.126.1/build/three.min.js"
></script>
```

See the [`examples folder`](examples/umd/) for how to use the UMD build.

## How to use

The package exports three components: the basic `<Visualization />` and
`<Visualization3D />` components, and a `<SelectionControls />` component that
wraps the visualization components and handles selecting/deselecting nodes in
the graph.

For a 2D visualization:

```js
import React from 'react'
import { Visualization } from '@acdh/network-visualization'

const MyComponent = props => (
  <div style={{ position: 'relative', width: '600px', height: '600px' }}>
    <Visualization
      graph={{
        nodes: [
          { id: 'n1', label: 'Node 1', type: 't1' },
          { id: 'n2', label: 'Node 2', type: 't2' },
          { id: 'n3', label: 'Node 3', type: 't2' },
        ],
        edges: [
          { id: 'e1', label: 'Edge 1', source: 'n1', target: 'n2', type: 'r1' },
          { id: 'e2', label: 'Edge 2', source: 'n1', target: 'n3', type: 'r1' },
        ],
        types: {
          nodes: [
            { id: 't1', label: 'Category 1', color: '#006699' },
            { id: 't2', label: 'Category 2', color: '#669900' },
          ],
          edges: [{ id: 'r1', label: 'Relation 1', color: '#990066' }],
        },
      }}
    />
  </div>
)
```

The `graph` prop is the only required prop. It must include the graph's nodes
and edges, as well as a `types` object describing the node and edge types. All
entities in the graph can have an optional `label` and a `color`, where labels
and colors defined on individual nodes/edges take precedence over labels and
colors defined for node types/edge types.

Note that `nodes`, `edges`, `types.nodes` and `types.edges` can be provided as
arrays, or as objects mapped by `id`, e.g.:

```js
{
  nodes: {
    n1: {
      id: 'n1'
    },
    n2: {
      id: 'n2',
    },
  },
}
```

When the graph data changes during the lifetime of the component, by default new
nodes and edges will be _added_ to the previously provided graph. If you want to
_replace_ a graph, you can add the `replace` property to the graph object:

```diff
 {
   nodes: [],
   edges: [],
   types: {
     edges: [],
     nodes: []
   },
+  replace: true,
 }
```

## Selection controls

Click interactions which allow selecting/deselecting nodes can be added with the
`<SelectionControls />` component:

```js
import React from 'react'
import { SelectionControls as Visualization } from '@acdh/network-visualization'

const MyComponent = props => (
  <div style={{ position: 'relative', width: '600px', height: '600px' }}>
    <Visualization dimensions={3} graph={props.graph} />
  </div>
)
```

By default, `SelectionControls` is an uncontrolled component, i.e. it holds the
state of selected nodes internally. It is possible to switch it to a controlled
component by providing a `Set` of ids with the `selectedNodeIds` prop.

## Live example

You can view a live example of the components in storybook, by either locally
running `npm run storybook`, or
[here](https://acdh-network-visualization.netlify.com).

## Props

### Visualization and Visualization3D

| prop               | type           | default          | description                                                                                                     |
| ------------------ | -------------- | ---------------- | --------------------------------------------------------------------------------------------------------------- |
| backgroundColor    | string         |                  | Canvas color                                                                                                    |
| dagMode            | string \| null | null             | Layout mode for directed acyclical graphs                                                                       |
| graph              | object         |                  | Graph data, see above for the expected format                                                                   |
| height             | number         | container height | Canvas height                                                                                                   |
| highlightedNodeIds | Set\<string\>  |                  | Ids of highlighted nodes                                                                                        |
| onNodeClick        | function       |                  | Event callback fired when clicking on a node. Receives an object with `{ node, graph, forceGraph }` as argument |
| onSimulationEnd    | function       |                  | Event callback fired when simulation ends                                                                       |
| onSimulationTick   | function       |                  | Event callback fired every simulation tick                                                                      |
| onZoom             | function       |                  | Event callback fired on every zoom/pan interaction                                                              |
| selectedNodeIds    | Set\<string\>  |                  | Ids of selected nodes                                                                                           |
| showNeighborsOnly  | bool           | false            | Only how neighbors of selected nodes                                                                            |
| width              | number         | container width  | Canvas width                                                                                                    |

### SelectionControls

Has all props from `<Visualization />`, and adds:

| prop           | type     | default | description                                                                     |
| -------------- | -------- | ------- | ------------------------------------------------------------------------------- |
| dimensions     | number   | 2       | 2D or 3D layout                                                                 |
| onNodeDeselect | function |         | Event callback fired when node deselected. Receives the node object as argument |
| onNodeSelect   | function |         | Event callback fired when node selected. Receives the node object as argument   |
