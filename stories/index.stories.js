import { action } from '@storybook/addon-actions'
import { boolean, number, select, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'
import ExportButton from '../src/export'
import FilterControls from '../src/filter-controls'
import '../src/global.css'
import Legend from '../src/legend'
import SelectionControls from '../src/selection-controls'
import SimulationControls from '../src/simulation-controls'
import ToggleThirdDimension from '../src/toggle-third-dimension'
import Visualization from '../src/visualization'
import Visualization3D from '../src/visualization3d'
import { createRandomDAG, createRandomGraph, types } from './utils'

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
  .add('with fast layouting algorithm', () => (
    <Visualization
      graph={{
        ...createRandomGraph(),
      }}
      onNodeClick={action('onNodeClick')}
      // onNodeHover={action('onNodeHover')}
      onSimulationEnd={action('onSimulationEnd')}
      // onSimulationTick={action('onSimulationTick')}
      onZoom={action('onZoom')}
      simulation={{ fast: true }}
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
  .add('with adjustable layout', () => (
    <Visualization
      graph={{
        ...createRandomGraph(),
      }}
      dagLevelDistance={number('DAG level distance')}
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
        null
      )}
      edgeCurvature={number('Edge curvature', 0)}
      maxLabelLength={number('Max label length')}
      nodeRelativeSize={number('Relative node size', 6)}
      nodeSize={number('Node size')}
      onNodeClick={action('onNodeClick')}
      // onNodeHover={action('onNodeHover')}
      onSimulationEnd={action('onSimulationEnd')}
      // onSimulationTick={action('onSimulationTick')}
      onZoom={action('onZoom')}
      showLabels={boolean('Always show labels', false)}
      simulation={{
        charge: number('Charge'),
        distance: number('Distance'),
        alphaDecay: number('Alpha decay', 0.0228),
        velocityDecay: number('Velocity decay', 0.4),
        warmupTicks: number('Warmup ticks', 0),
        cooldownTicks: number('Cooldown ticks', 15000),
        cooldownTime: number('Cooldown time'),
      }}
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
  .add('with adjustable layout', () => (
    <Visualization3D
      graph={{
        ...createRandomGraph(),
      }}
      dagLevelDistance={number('DAG level distance')}
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
        null
      )}
      edgeCurvature={number('Edge curvature', 0)}
      maxLabelLength={number('Max label length')}
      nodeRelativeSize={number('Relative node size', 6)}
      nodeSize={number('Node size')}
      onNodeClick={action('onNodeClick')}
      // onNodeHover={action('onNodeHover')}
      onSimulationEnd={action('onSimulationEnd')}
      // onSimulationTick={action('onSimulationTick')}
      onZoom={action('onZoom')}
      showLabels={boolean('Always show labels', false)}
      simulation={{
        charge: number('Charge'),
        distance: number('Distance'),
        alphaDecay: number('Alpha decay', 0.0228),
        velocityDecay: number('Velocity decay', 0.4),
        warmupTicks: number('Warmup ticks', 0),
        cooldownTicks: number('Cooldown ticks', 15000),
        cooldownTime: number('Cooldown time'),
      }}
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
  .add('with 2D layout and custom colors', () => (
    <SelectionControls
      colors={{
        highlighted: 'aquamarine',
        selected: 'tomato',
        node: 'royalblue',
      }}
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

storiesOf('SimulationControls', module)
  .add('cyclical', () => (
    <ToggleThirdDimension
      style={{ position: 'absolute', bottom: '0.8rem', left: '0.8rem' }}
    >
      {is3D => {
        const VisualizationComponent = is3D ? Visualization3D : Visualization

        return (
          <SimulationControls
            is3D={is3D}
            style={{ position: 'absolute', bottom: '0.4rem', right: '0.4rem' }}
            ui={{ dagMode: false }}
          >
            {({ charge, distance, showDirectionality }) => (
              <VisualizationComponent
                graph={{
                  ...createRandomGraph(),
                  types,
                }}
                onNodeClick={action('onNodeClick')}
                // onNodeHover={action('onNodeHover')}
                onSimulationEnd={action('onSimulationEnd')}
                // onSimulationTick={action('onSimulationTick')}
                onZoom={action('onZoom')}
                showDirectionality={showDirectionality}
                simulation={{
                  charge,
                  distance,
                }}
              >
                {({ getGraph, getNodeColor, getTypes }) => (
                  <>
                    <ExportButton
                      getGraph={getGraph}
                      getNodeColor={getNodeColor}
                    />
                    <Legend getTypes={getTypes} />
                  </>
                )}
              </VisualizationComponent>
            )}
          </SimulationControls>
        )
      }}
    </ToggleThirdDimension>
  ))
  .add('acyclical', () => (
    <ToggleThirdDimension
      style={{ position: 'absolute', bottom: '0.8rem', left: '0.8rem' }}
    >
      {is3D => {
        const VisualizationComponent = is3D ? Visualization3D : Visualization

        return (
          <SimulationControls
            is3D={is3D}
            options={{ dagMode: 'radialout', showDirectionality: false }}
            style={{ position: 'absolute', bottom: '0.4rem', right: '0.4rem' }}
          >
            {({ charge, dagMode, distance, showDirectionality }) => (
              <VisualizationComponent
                dagMode={dagMode}
                graph={{
                  ...createRandomDAG(),
                  types,
                }}
                onNodeClick={action('onNodeClick')}
                // onNodeHover={action('onNodeHover')}
                onSimulationEnd={action('onSimulationEnd')}
                // onSimulationTick={action('onSimulationTick')}
                onZoom={action('onZoom')}
                showDirectionality={showDirectionality}
                simulation={{
                  charge,
                  distance,
                }}
              >
                {({ getGraph, getNodeColor, getTypes }) => (
                  <>
                    <ExportButton
                      getGraph={getGraph}
                      getNodeColor={getNodeColor}
                    />
                    <Legend getTypes={getTypes} />
                  </>
                )}
              </VisualizationComponent>
            )}
          </SimulationControls>
        )
      }}
    </ToggleThirdDimension>
  ))

storiesOf('Search', module).add('search', () => {
  const graph = {
    ...createRandomGraph(),
    types,
  }
  return (
    <ToggleThirdDimension style={{ bottom: '0.8rem', right: '0.8rem' }}>
      {is3D => {
        return (
          <SimulationControls
            is3D={is3D}
            options={{ showDirectionality: false }}
            style={{ bottom: '0.4rem', right: '3rem' }}
            ui={{ dagMode: false }}
          >
            {({ charge, distance, showDirectionality }) => {
              return (
                <FilterControls
                  graph={graph}
                  style={{ right: '0.4rem', top: '0.4rem' }}
                >
                  {({ filteredNodeIds }) => {
                    const VisualizationComponent = is3D
                      ? Visualization3D
                      : Visualization
                    return (
                      <VisualizationComponent
                        graph={graph}
                        selectedNodeIds={filteredNodeIds}
                        showDirectionality={showDirectionality}
                        showNeighborsOnly={Boolean(filteredNodeIds.size)}
                        simulation={{ charge, distance }}
                      >
                        {({ getGraph, getNodeColor, getTypes }) => {
                          return (
                            <>
                              <ExportButton
                                getGraph={getGraph}
                                getNodeColor={getNodeColor}
                                style={{ bottom: '0.4rem', left: '0.4rem' }}
                              />
                              <Legend
                                getTypes={getTypes}
                                style={{ left: '0.4rem', top: '0.4rem' }}
                              />
                            </>
                          )
                        }}
                      </VisualizationComponent>
                    )
                  }}
                </FilterControls>
              )
            }}
          </SimulationControls>
        )
      }}
    </ToggleThirdDimension>
  )
})
