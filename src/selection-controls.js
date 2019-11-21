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
      selectedNodeIds: this.props.selectedNodeIds ? null : new Set(),
    }

    this.onNodeClick = this.onNodeClick.bind(this)
  }

  componentDidUpdate(prevProps) {
    // Switch from controlled to uncontrolled component
    if (prevProps.selectedNodeIds && !this.props.selectedNodeIds) {
      this.setState({
        selectedNodeIds: new Set(),
      })
    }
    // Switch from uncontrolled to controlled component
    else if (!prevProps.selectedNodeIds && this.props.selectedNodeIds) {
      this.setState({
        selectedNodeIds: null,
      })
    }
  }

  isControlledComponent() {
    return !this.state.selectedNodeIds
  }

  onNodeClick({ forceGraph, graph, node, event, types }) {
    const { onNodeClick, onNodeDeselect, onNodeSelect } = this.props

    onNodeClick({ forceGraph, graph, node, event, types })

    if (this.state.selectedNodeIds.has(node.id)) {
      if (!this.isControlledComponent()) {
        this.setState(({ selectedNodeIds }) => ({
          selectedNodeIds: new Set(
            [...selectedNodeIds].filter(id => id !== node.id)
          ),
        }))
      }
      onNodeDeselect(node)
    } else {
      if (!this.isControlledComponent()) {
        this.setState(({ selectedNodeIds }) => ({
          selectedNodeIds: new Set([node.id, ...selectedNodeIds]),
        }))
      }
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
      children,
      dagMode,
      dimensions,
      graph,
      height,
      highlightedNodeIds,
      onBackgroundClick,
      onNodeHover,
      onSimulationEnd,
      onSimulationTick,
      onZoom,
      showNeighborsOnly,
      width,
    } = this.props

    const selectedNodeIds =
      this.props.selectedNodeIds || this.state.selectedNodeIds

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
            onBackgroundClick={onBackgroundClick}
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
          >
            {children}
          </VisualizationComponent>
        </React.Suspense>
      </ErrorBoundary>
    )
  }
}

SelectionControls.propTypes = {
  backgroundColor: PropTypes.string,
  children: PropTypes.func,
  dagMode: PropTypes.oneOf([
    null,
    'lr',
    'rl',
    'td',
    'bu',
    'radialin',
    'radialout',
  ]),
  dimensions: PropTypes.oneOf([2, 3]),
  graph: PropTypes.object.isRequired,
  height: PropTypes.number,
  highlightedNodeIds: PropTypes.object, // Set
  onBackgroundClick: PropTypes.func,
  onNodeClick: PropTypes.func,
  onNodeDeselect: PropTypes.func,
  onNodeHover: PropTypes.func,
  onNodeSelect: PropTypes.func,
  onSimulationEnd: PropTypes.func,
  onSimulationTick: PropTypes.func,
  onZoom: PropTypes.func,
  selectedNodeIds: PropTypes.object, // Set
  showNeighborsOnly: PropTypes.bool,
  width: PropTypes.number,
}

SelectionControls.defaultProps = {
  dimensions: 2,
  highlightedNodeIds: new Set(),
  onBackgroundClick: () => {},
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
