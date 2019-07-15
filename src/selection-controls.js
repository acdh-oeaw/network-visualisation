import React from 'react'
import PropTypes from 'prop-types'

import ErrorBoundary from './error-boundary'
import Fallback from './fallback'
import Visualization from './visualization'
import Visualization3D from './visualization3d'
// const Visualization = React.lazy(() => import('./visualization'));
// const Visualization3D = React.lazy(() => import('./visualization3d'));

class SelectionControls extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      highlightedNodeIds: new Set(),
      selectedNodeIds: new Set(),
    }

    this.onNodeClick = this.onNodeClick.bind(this)
  }

  onNodeClick({ forceGraph, node }) {
    const { onNodeClick, onNodeDeselect, onNodeSelect } = this.props

    onNodeClick(node)

    if (this.state.selectedNodeIds.has(node.id)) {
      this.setState(({ selectedNodeIds }) => ({
        selectedNodeIds: new Set(
          [...selectedNodeIds].filter(id => id !== node.id)
        ),
      }))
      onNodeDeselect(node)
    } else {
      this.setState(({ selectedNodeIds }) => ({
        selectedNodeIds: new Set([node.id, ...selectedNodeIds]),
      }))
      onNodeSelect(node)
    }

    if (forceGraph.centerAt) {
      forceGraph.centerAt(node.x, node.y, 400)
    } else if (forceGraph.cameraPosition) {
      const distance = 100
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z)
      forceGraph.cameraPosition(
        {
          x: node.x * distRatio,
          y: node.y * distRatio,
          z: node.z * distRatio,
        },
        node,
        1000
      )
    }
  }

  render() {
    const {
      backgroundColor,
      dimensions,
      graph,
      height,
      dagMode,
      onNodeHover,
      onSimulationEnd,
      onSimulationTick,
      onZoom,
      showNeighborsOnly,
      width,
    } = this.props

    const { highlightedNodeIds, selectedNodeIds } = this.state

    const VisualizationComponent =
      dimensions === 3 ? Visualization3D : Visualization

    return (
      <ErrorBoundary>
        <React.Suspense fallback={Fallback}>
          <VisualizationComponent
            backgroundColor={backgroundColor}
            graph={graph}
            height={height}
            highlightedNodeIds={highlightedNodeIds}
            dagMode={dagMode}
            onNodeClick={this.onNodeClick}
            onNodeHover={onNodeHover}
            onSimulationEnd={onSimulationEnd}
            onSimulationTick={onSimulationTick}
            onZoom={onZoom}
            selectedNodeIds={selectedNodeIds}
            showNeighborsOnly={Boolean(
              showNeighborsOnly && selectedNodeIds.size
            )}
            width={width}
          />
        </React.Suspense>
      </ErrorBoundary>
    )
  }
}

SelectionControls.propTypes = {
  backgroundColor: PropTypes.string,
  dimensions: PropTypes.oneOf([2, 3]),
  graph: PropTypes.object.isRequired,
  height: PropTypes.number,
  dagMode: PropTypes.oneOf([
    null,
    'lr',
    'rl',
    'td',
    'bu',
    'radialin',
    'radialout',
  ]),
  onNodeHighlight: PropTypes.func,
  onNodeClick: PropTypes.func,
  onNodeDeselect: PropTypes.func,
  onNodeHover: PropTypes.func,
  onNodeSelect: PropTypes.func,
  onSimulationEnd: PropTypes.func,
  onSimulationTick: PropTypes.func,
  onZoom: PropTypes.func,
  showNeighborsOnly: PropTypes.bool,
  width: PropTypes.number,
}

SelectionControls.defaultProps = {
  dimensions: 2,
  onNodeHighlight: () => {},
  onNodeClick: () => {},
  onNodeDeselect: () => {},
  onNodeHover: () => {},
  onNodeSelect: () => {},
  onSimulationEnd: () => {},
  onSimulationTick: () => {},
  onZoom: () => {},
  showNeighborsOnly: false,
}

export default SelectionControls
