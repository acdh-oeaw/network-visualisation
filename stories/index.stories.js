import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import {
  withKnobs,
  select,
  boolean,
  // object,
  // button,
} from '@storybook/addon-knobs'

import ExportButton from '../src/export'
import Legend from '../src/legend'
import SelectionControls from '../src/selection-controls'
import Visualization from '../src/visualization'
import Visualization3D from '../src/visualization3d'
import { createRandomGraph, createRandomDAG, types } from './utils'

import '../src/global.css'

storiesOf('Visualization', module)
  .addDecorator(withKnobs)
  .add('with default layout', () => (
    <Visualization
      graph={{
        ...createRandomGraph(),
      }}
      onNodeClick={action('onNodeClick')}
      // onNodeHover={action('onNodeHover')}
      onSimulationEnd={action('onSimulationEnd')}
      // onSimulationTick={action('onSimulationTick')}
      onZoom={action('onZoom')}
    />
  ))
  .add('with DAG layout', () => (
    <Visualization
      graph={{
        ...createRandomDAG(),
      }}
      dagMode={select(
        'DAG Mode',
        {
          Default: null,
          'Left to right': 'lr',
          'Right to left': 'rl',
          'Top down': 'td',
          'Bottom up': 'bu',
          'Radial in': 'radialin',
          'Radial out': 'radialout',
        },
        'lr'
      )}
      onNodeClick={action('onNodeClick')}
      // onNodeHover={action('onNodeHover')}
      onSimulationEnd={action('onSimulationEnd')}
      // onSimulationTick={action('onSimulationTick')}
      onZoom={action('onZoom')}
    />
  ))

storiesOf('Visualization 3D', module)
  .addDecorator(withKnobs)
  .add('with default layout', () => (
    <Visualization3D
      graph={{
        ...createRandomGraph(),
      }}
      onNodeClick={action('onNodeClick')}
      // onNodeHover={action('onNodeHover')}
      onSimulationEnd={action('onSimulationEnd')}
      // onSimulationTick={action('onSimulationTick')}
      onZoom={action('onZoom')}
    />
  ))
  .add('with DAG layout', () => (
    <Visualization3D
      graph={{
        ...createRandomDAG(),
      }}
      dagMode={select(
        'DAG Mode',
        {
          Default: null,
          'Left to right': 'lr',
          'Right to left': 'rl',
          'Top down': 'td',
          'Bottom up': 'bu',
          'Radial in': 'radialin',
          'Radial out': 'radialout',
          'Z axis in': 'zin',
          'Z axis out': 'zout',
        },
        'lr'
      )}
      onNodeClick={action('onNodeClick')}
      // onNodeHover={action('onNodeHover')}
      onSimulationEnd={action('onSimulationEnd')}
      // onSimulationTick={action('onSimulationTick')}
      onZoom={action('onZoom')}
    />
  ))

storiesOf('SelectionControls', module)
  .addDecorator(withKnobs)
  .add('with 2D layout', () => (
    <SelectionControls
      dimensions={Number(select('Dimensions', [2, 3], 2))}
      graph={{
        ...createRandomGraph(),
      }}
      onNodeDeselect={action('onNodeDeselect')}
      onNodeSelect={action('onNodeSelect')}
      // onNodeClick={action('onNodeClick')}
      // onNodeHover={action('onNodeHover')}
      // onSimulationEnd={action('onSimulationEnd')}
      // onSimulationTick={action('onSimulationTick')}
      // onZoom={action('onZoom')}
      showNeighborsOnly={boolean('Show neighbors only', false)}
    />
  ))
  .add('with 3D layout', () => (
    <SelectionControls
      dimensions={Number(select('Dimensions', [2, 3], 3))}
      graph={{
        ...createRandomGraph(),
      }}
      onNodeDeselect={action('onNodeDeselect')}
      onNodeSelect={action('onNodeSelect')}
      // onNodeClick={action('onNodeClick')}
      // onNodeHover={action('onNodeHover')}
      // onSimulationEnd={action('onSimulationEnd')}
      // onSimulationTick={action('onSimulationTick')}
      // onZoom={action('onZoom')}
      showNeighborsOnly={boolean('Show neighbors only', false)}
    />
  ))

storiesOf('Export', module).add('in GraphML or GEXF format', () => (
  <Visualization
    graph={{
      ...createRandomGraph(),
    }}
    onNodeClick={action('onNodeClick')}
    // onNodeHover={action('onNodeHover')}
    onSimulationEnd={action('onSimulationEnd')}
    // onSimulationTick={action('onSimulationTick')}
    onZoom={action('onZoom')}
  >
    {({ getGraph, getNodeColor }) => (
      <ExportButton getGraph={getGraph} getNodeColor={getNodeColor} />
    )}
  </Visualization>
))

storiesOf('Legend', module).add('show node types', () => (
  <Visualization
    graph={{
      ...createRandomGraph(),
      types,
    }}
    onNodeClick={action('onNodeClick')}
    // onNodeHover={action('onNodeHover')}
    onSimulationEnd={action('onSimulationEnd')}
    // onSimulationTick={action('onSimulationTick')}
    onZoom={action('onZoom')}
  >
    {({ getGraph, getNodeColor, getTypes }) => (
      <>
        <ExportButton getGraph={getGraph} getNodeColor={getNodeColor} />
        <Legend getTypes={getTypes} />
      </>
    )}
  </Visualization>
))
