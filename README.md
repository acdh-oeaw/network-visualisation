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
<script src="https://unpkg.com/@acdh/network-visualization@latest/lib/network-visualization.umd.js"></script>
```

When using the UMD build, make sure to also include `react` and, if you plan to
use the 3D component, `three`:

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
  src="https://unpkg.com/three@latest/build/three.min.js"
></script>
```

See [`examples/umd/index.html`](examples/umd/index.html) for a basic example how
to use the UMD build.

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

## Live example

You can view a live example of the components in storybook, by either locally
running `npm run storybook`, or
[here](https://acdh-network-visualization.netlify.com).

## Props

### Visualization and Visualization3D

| prop               | type           | default | description |
| ------------------ | -------------- | ------- | ----------- |
| backgroundColor    | string         |         |             |
| dagMode            | string \| null | null    |             |
| graph              | object         |         |             |
| height             | number         |         |             |
| highlightedNodeIds | Set\<string\>  |         |             |
| onNodeClick        | function       |         |             |
| onNodeHover        | function       |         |             |
| onSimulationEnd    | function       |         |             |
| onSimulationTick   | function       |         |             |
| onZoom             | function       |         |             |
| showNeighborsOnly  | bool           | false   |             |
| width              | number         |         |             |

### SelectionControls

Has all props from `<Visualization />`, and adds:

| prop           | type     | default | description |
| -------------- | -------- | ------- | ----------- |
| dimensions     | number   | 2       |             |
| onNodeDeselect | function |         |             |
| onNodeSelect   | function |         |             |
