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
      selectedNodeIds: new Set(),
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
        selectedNodeIds: new Set(),
      })
    }
  }

  isControlledComponent() {
    return Boolean(this.props.selectedNodeIds)
  }

  onNodeClick({ forceGraph, graph, node, event, types }) {
    const { onNodeClick, onNodeDeselect, onNodeSelect } = this.props

    onNodeClick({ forceGraph, graph, node, event, types })

    if (this.isControlledComponent()) {
      if (this.props.selectedNodeIds.has(node.id)) {
        onNodeDeselect(node)
      } else {
        onNodeSelect(node)
      }
    } else {
      if (this.state.selectedNodeIds.has(node.id)) {
        this.setState(({ selectedNodeIds }) => ({
          selectedNodeIds: new Set(
            [...selectedNodeIds].filter(id => id !== node.id)
          ),
        }))
      } else {
        if (!this.isControlledComponent()) {
          this.setState(({ selectedNodeIds }) => ({
            selectedNodeIds: new Set([node.id, ...selectedNodeIds]),
          }))
        }
      }
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
      dagLevelDistance,
      dimensions,
      edgeCurvature,
      graph,
      height,
      highlightedNodeIds,
      maxLabelLength,
      nodeRelativeSize,
      nodeSize,
      onBackgroundClick,
      onNodeHover,
      onSimulationEnd,
      onSimulationTick,
      onZoom,
      showDirectionality,
      showNeighborsOnly,
      showLabels,
      simulation,
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
            dagMode={dagMode}
            dagLevelDistance={dagLevelDistance}
            edgeCurvature={edgeCurvature}
            graph={graph}
            height={height}
            highlightedNodeIds={highlightedNodeIds}
            maxLabelLength={maxLabelLength}
            nodeRelativeSize={nodeRelativeSize}
            nodeSize={nodeSize}
            onBackgroundClick={onBackgroundClick}
            onNodeClick={this.onNodeClick}
            onNodeHover={onNodeHover}
            onSimulationEnd={onSimulationEnd}
            onSimulationTick={onSimulationTick}
            onZoom={onZoom}
            selectedNodeIds={selectedNodeIds}
            showDirectionality={showDirectionality}
            showNeighborsOnly={Boolean(
              showNeighborsOnly && selectedNodeIds.size
            )}
            showLabels={showLabels}
            simulation={simulation}
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
  dagLevelDistance: PropTypes.number,
  dagMode: PropTypes.oneOf([
    null,
    'lr',
    'rl',
    'td',
    'bu',
    'radialin',
    'radialout',
    'zin',
    'zout',
  ]),
  dimensions: PropTypes.oneOf([2, 3]),
  edgeCurvature: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.number,
  ]),
  graph: PropTypes.object.isRequired,
  height: PropTypes.number,
  highlightedNodeIds: PropTypes.object, // Set
  maxLabelLength: PropTypes.number,
  nodeRelativeSize: PropTypes.number,
  nodeSize: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.number,
  ]),
  onBackgroundClick: PropTypes.func,
  onNodeClick: PropTypes.func,
  onNodeDeselect: PropTypes.func,
  onNodeHover: PropTypes.func,
  onNodeSelect: PropTypes.func,
  onSimulationEnd: PropTypes.func,
  onSimulationTick: PropTypes.func,
  onZoom: PropTypes.func,
  selectedNodeIds: PropTypes.object, // Set
  showDirectionality: PropTypes.bool,
  showLabels: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  showNeighborsOnly: PropTypes.bool,
  simulation: PropTypes.object,
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
