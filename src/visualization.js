import React from 'react'
import PropTypes from 'prop-types'
import ForceGraph from 'force-graph'
import { forceManyBodyReuse } from 'd3-force-reuse'

import Graph from './graph'
import { mergeTypes } from './utils'
import { NODE_RELATIVE_SIZE, PARTICLE_SIZE, colors } from './constants'

import './global.css'

class Visualization extends React.Component {
  constructor(props) {
    super(props)

    this.containerElementRef = React.createRef()
    this.containerElement = (
      <div
        ref={this.containerElementRef}
        style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}
      />
    )

    this.graph = null
    this.forceGraph = null
    this.types = null

    this.colors = colors
    this.nodeRelativeSize = NODE_RELATIVE_SIZE

    this.drawNode = this.drawNode.bind(this)
    this.getEdgeCurvature = this.getEdgeCurvature.bind(this)
    this.getEdgeLabel = this.getEdgeLabel.bind(this)
    this.getEdgeVisibility = this.getEdgeVisibility.bind(this)
    this.getGraph = this.getGraph.bind(this)
    this.getNodeColor = this.getNodeColor.bind(this)
    this.getNodeLabel = this.getNodeLabel.bind(this)
    this.getNodeRelativeSize = this.getNodeRelativeSize.bind(this)
    this.getNodeValue = this.getNodeValue.bind(this)
    this.getNodeVisibility = this.getNodeVisibility.bind(this)
    this.getTypes = this.getTypes.bind(this)
    this.isNeighborOfSelectedNode = this.isNeighborOfSelectedNode.bind(this)
    this.onWindowResize = this.onWindowResize.bind(this)
  }

  componentDidMount() {
    this.initForceGraph()
    this.initGraph()
    window.addEventListener('resize', this.onWindowResize)
  }

  componentDidUpdate(prevProps) {
    const {
      backgroundColor,
      dagLevelDistance,
      dagMode,
      edgeCurvature,
      graph,
      height,
      highlightedNodeIds,
      nodeRelativeSize,
      nodeSize,
      selectedNodeIds,
      showDirectionality,
      showNeighborsOnly,
      simulation,
      width,
    } = this.props

    if (backgroundColor !== prevProps.backgroundColor) {
      this.forceGraph.backgroundColor(backgroundColor)
    }

    if (graph !== prevProps.graph) {
      this.graph.addGraph(
        {
          nodes: graph.nodes,
          edges: graph.edges,
        },
        graph.replace
      )
      this.types = graph.replace
        ? graph.types
        : mergeTypes(this.types, graph.types)
    }

    if (height !== prevProps.height || width !== prevProps.width) {
      this.resizeCanvas()
    }

    if (highlightedNodeIds !== prevProps.highlightedNodeIds) {
      //
    }

    if (selectedNodeIds !== prevProps.selectedNodeIds) {
      //
    }

    if (showNeighborsOnly !== prevProps.showNeighborsOnly) {
      //
    }

    if (showDirectionality !== prevProps.showDirectionality) {
      this.forceGraph.linkDirectionalParticles(
        showDirectionality ? PARTICLE_SIZE : 0
      )
    }
    if (edgeCurvature !== prevProps.edgeCurvature) {
      this.forceGraph.linkCurvature(this.getEdgeCurvature(edgeCurvature))
    }

    const {
      alphaDecay,
      charge,
      cooldownTicks,
      cooldownTime,
      distance,
      velocityDecay,
      warmupTicks,
    } = simulation || {}

    const prev = prevProps.simulation || {}

    if (alphaDecay != null && alphaDecay !== prev.alphaDecay) {
      this.forceGraph.d3AlphaDecay(alphaDecay) // 0.0228
    }
    if (charge != null && charge !== prev.charge) {
      this.forceGraph.d3Force('charge').strength(charge)
    }
    if (cooldownTicks != null && cooldownTicks !== prev.cooldownTicks) {
      this.forceGraph.cooldownTicks(cooldownTicks) // Infinity
    }
    if (cooldownTime != null && cooldownTime !== prev.cooldownTime) {
      this.forceGraph.cooldownTime(cooldownTime) // 15000
    }
    if (
      dagLevelDistance != null &&
      dagLevelDistance !== prev.dagLevelDistance
    ) {
      this.forceGraph.dagLevelDistance(dagLevelDistance)
    }
    if (distance != null && distance !== prev.distance) {
      this.forceGraph.d3Force('link').distance(distance)
    }
    if (warmupTicks != null && warmupTicks !== prev.warmupTicks) {
      this.forceGraph.warmupTicks(warmupTicks) // 0
    }
    if (velocityDecay != null && velocityDecay !== prev.velocityDecay) {
      this.forceGraph.d3VelocityDecay(velocityDecay) // 0.4
    }

    if (
      nodeRelativeSize != null &&
      nodeRelativeSize !== prevProps.nodeRelativeSize
    ) {
      this.nodeRelativeSize = nodeRelativeSize
    }
    if (nodeSize !== prevProps.nodeSize) {
      this.nodeSize = nodeSize
    }

    if (dagMode !== prevProps.dagMode) {
      this.forceGraph.dagMode(dagMode)
      this.forceGraph.nodeRelSize(this.getNodeRelativeSize())
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize)
    this.forceGraph = null
    this.graph = null
    this.types = null
  }

  initGraph() {
    this.graph = new Graph()

    // this.graph.on(Graph.events.EDGE_ADDED, edge => {});
    // this.graph.on(Graph.events.EDGES_ADDED, edges => {});
    this.graph.on(Graph.events.GRAPH_ADDED, () => {
      this.forceGraph.graphData({
        nodes: this.graph.getNodes(),
        links: this.graph.getEdges(),
      })
    })
    this.graph.on(Graph.events.GRAPH_CLEARED, () => {
      this.forceGraph.graphData({
        nodes: [],
        links: [],
      })
    })
    // this.graph.on(Graph.events.NODE_ADDED, node => {});
    // this.graph.on(Graph.events.NODES_ADDED, nodes => {});

    const { graph } = this.props
    this.graph.addGraph({
      nodes: graph.nodes,
      edges: graph.edges,
    })
    this.types = graph.types
  }

  initForceGraph() {
    this.forceGraph = ForceGraph()(this.containerElementRef.current)

    this.resizeCanvas()

    const {
      backgroundColor,
      dagMode,
      dagLevelDistance,
      edgeCurvature,
      nodeRelativeSize,
      nodeSize,
      onBackgroundClick,
      onNodeClick,
      onSimulationEnd,
      onSimulationTick,
      onZoom,
      showDirectionality,
      simulation,
    } = this.props

    const {
      alphaDecay,
      charge,
      cooldownTicks,
      cooldownTime,
      distance,
      fast,
      forces,
      velocityDecay,
      warmupTicks,
    } = simulation || {}

    this.forceGraph.backgroundColor(backgroundColor)

    // use forceManyBodyReuse for better layout performance
    if (fast) this.forceGraph.d3Force('charge', forceManyBodyReuse())

    if (alphaDecay != null) this.forceGraph.d3AlphaDecay(alphaDecay) // 0.0228
    if (charge != null) this.forceGraph.d3Force('charge').strength(charge)
    if (cooldownTicks != null) this.forceGraph.cooldownTicks(cooldownTicks) // Infinity
    if (cooldownTime != null) this.forceGraph.cooldownTime(cooldownTime) // 15000
    if (dagLevelDistance != null)
      this.forceGraph.dagLevelDistance(dagLevelDistance)
    if (dagMode != null) this.forceGraph.dagMode(dagMode)
    if (distance != null) this.forceGraph.d3Force('link').distance(distance)
    if (Array.isArray(forces)) forces.forEach(this.forceGraph.d3Force)
    if (warmupTicks != null) this.forceGraph.warmupTicks(warmupTicks) // 0
    if (velocityDecay != null) this.forceGraph.d3VelocityDecay(velocityDecay) // 0.4

    if (nodeRelativeSize != null) this.nodeRelativeSize = nodeRelativeSize
    if (nodeSize != null) this.nodeSize = nodeSize

    this.forceGraph.nodeAutoColorBy(node => node.type)
    this.forceGraph.nodeCanvasObject(this.drawNode)
    this.forceGraph.nodeColor(this.getNodeColor)
    this.forceGraph.nodeLabel(this.getNodeLabel)
    this.forceGraph.nodeRelSize(this.getNodeRelativeSize())
    this.forceGraph.nodeVal(this.getNodeValue)
    this.forceGraph.nodeVisibility(this.getNodeVisibility)

    this.forceGraph.linkColor(() => 'rgba(0, 0, 0, 0.15)')
    this.forceGraph.linkCurvature(this.getEdgeCurvature(edgeCurvature))
    this.forceGraph.linkDirectionalParticles(
      showDirectionality ? PARTICLE_SIZE : 0
    )
    this.forceGraph.linkLabel(this.getEdgeLabel)
    this.forceGraph.linkVisibility(this.getEdgeVisibility)

    this.forceGraph.onNodeClick((node, event) => {
      onNodeClick({
        forceGraph: this.forceGraph,
        graph: this.graph,
        node,
        event,
        types: this.types,
      })
    })
    // this.forceGraph.onNodeHover((node, prevNode) => {
    //   onNodeHover({
    //     forceGraph: this.forceGraph,
    //     graph: this.graph,
    //     node,
    //     prevNode,
    //   });
    // });

    this.forceGraph.onBackgroundClick(event => {
      onBackgroundClick({
        event,
      })
    })

    this.forceGraph.onEngineStop(() => {
      onSimulationEnd({
        forceGraph: this.forceGraph,
        graph: this.graph,
      })
    })
    this.forceGraph.onEngineTick(() => {
      onSimulationTick({
        forceGraph: this.forceGraph,
        graph: this.graph,
      })
    })

    this.forceGraph.onZoom(zoom => {
      onZoom({
        forceGraph: this.forceGraph,
        graph: this.graph,
        zoom,
      })
    })
  }

  drawNode(node, ctx, globalScale, isShadowCtx) {
    const { highlightedNodeIds, nodeImage, selectedNodeIds } = this.props

    const padAmount = isShadowCtx / globalScale

    const nodeRelSize = this.getNodeRelativeSize()
    const nodeVal = this.getNodeValue(node)
    const radius =
      Math.sqrt(Math.max(0, nodeVal || 1)) * nodeRelSize + padAmount

    // Draw highlighted ring around highlighted node
    if (highlightedNodeIds.has(node.id)) {
      ctx.beginPath()
      ctx.arc(node.x, node.y, radius * 1.4, 0, 2 * Math.PI, false)
      ctx.fillStyle = this.colors.highlighted
      ctx.fill()
    }

    // Draw highlighted ring around selected node
    if (selectedNodeIds.has(node.id)) {
      ctx.beginPath()
      ctx.arc(node.x, node.y, radius * 1.4, 0, 2 * Math.PI, false)
      ctx.fillStyle = this.colors.selected
      ctx.fill()
    }

    const nodeColor = this.getNodeColor(node) || this.colors.node

    // Draw node
    const img = typeof nodeImage === 'function' && nodeImage(node)
    if (!img) {
      ctx.beginPath()
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false)
      ctx.fillStyle = nodeColor
      ctx.fill()
    } else {
      const size = radius * 2
      ctx.drawImage(img, node.x - size / 2, node.y - size / 2, size, size)
    }

    // Always show label for selected node
    const showLabels =
      typeof this.props.showLabels === 'function'
        ? this.props.showLabels(node)
        : this.props.showLabels
    if (selectedNodeIds.has(node.id) || showLabels) {
      const { label: rawLabel } = node
      const label = this.props.maxLabelLength
        ? rawLabel.slice(0, this.props.maxLabelLength)
        : rawLabel
      const fontSize = Math.max(15 / globalScale, 2.5)
      ctx.font = `${fontSize}px sans-serif`
      const textWidth = ctx.measureText(label).width
      const [width, height] = [textWidth, fontSize].map(n => n + fontSize * 0.2)

      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)'
      ctx.fillRect(node.x - width / 2, node.y - height / 2, width, height)

      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = nodeColor
      ctx.fillText(label, node.x, node.y)
    }
  }

  getEdgeCurvature(curvature) {
    return typeof curvature === 'function'
      ? edge => curvature(edge, this.graph, this.forceGraph)
      : curvature || 0
  }

  getEdgeLabel(edge) {
    if (edge.label) {
      return edge.label
    }
    const { edges: edgeTypes = {} } = this.types || {}
    if (Array.isArray(edgeTypes)) {
      const edgeType = edgeTypes.find(type => type.id === edge.type)
      return edgeType && edgeType.label
    }
    const edgeType = edgeTypes[edge.type]
    return (edgeType && edgeType.label) || edge.type
  }

  getEdgeVisibility(edge) {
    if (
      this.props.showNeighborsOnly &&
      (!this.isNeighborOfSelectedNode(edge.source) ||
        !this.isNeighborOfSelectedNode(edge.target))
    ) {
      return false
    }
    return true
  }

  getGraph() {
    return this.graph
  }

  getNodeColor(node) {
    if (node.color) {
      return node.color
    }
    const { nodes: nodeTypes = {} } = this.types || {}
    if (Array.isArray(nodeTypes)) {
      const nodeType = nodeTypes.find(type => type.id === node.type)
      return (nodeType && nodeType.color) || this.colors.node
    }
    const nodeType = nodeTypes[node.type]
    return (nodeType && nodeType.color) || this.colors.node
  }

  getNodeLabel(node) {
    if (node.label) {
      return node.label
    }
    const { nodes: nodeTypes = {} } = this.types || {}
    const nodeType = nodeTypes[node.type]
    return (nodeType && nodeType.label) || node.type
  }

  getNodeRelativeSize() {
    return this.props.dagMode
      ? this.nodeRelativeSize / 3
      : this.nodeRelativeSize
  }

  getNodeValue(node) {
    if (this.nodeSize) {
      if (typeof this.nodeSize === 'function') {
        return this.nodeSize(node)
      }
      if (typeof this.nodeSize === 'string') {
        return node[this.nodeSize]
      }
      return this.nodeSize
    }
    return node.neighbors.size
  }

  getNodeVisibility(node) {
    if (this.props.showNeighborsOnly && !this.isNeighborOfSelectedNode(node)) {
      return false
    }
    return true
  }

  getTypes() {
    return this.types
  }

  isNeighborOfSelectedNode(node) {
    const { selectedNodeIds } = this.props
    return (
      selectedNodeIds.has(node.id) ||
      Array.from(selectedNodeIds).some(id =>
        this.graph.getNodeNeighbors(id).has(node.id)
      )
    )
  }

  onWindowResize() {
    requestAnimationFrame(() => this.resizeCanvas())
  }

  resizeCanvas() {
    const { width, height } = this.props
    if (width && height) {
      this.forceGraph.width(width)
      this.forceGraph.height(height)
    } else {
      const {
        width,
        height,
      } = this.containerElementRef.current.getBoundingClientRect()
      this.forceGraph.width(width)
      this.forceGraph.height(height)
    }
  }

  render() {
    const { children } = this.props

    return (
      <>
        {this.containerElement}
        {typeof children === 'function'
          ? children({
              getGraph: this.getGraph,
              getNodeColor: this.getNodeColor,
              getTypes: this.getTypes,
            })
          : null}
      </>
    )
  }
}

Visualization.propTypes = {
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
  ]),
  edgeCurvature: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.number,
  ]),
  graph: PropTypes.shape({
    nodes: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    edges: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    types: PropTypes.shape({
      nodes: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
        .isRequired,
      edges: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
        .isRequired,
    }).isRequired,
    replace: PropTypes.bool,
  }).isRequired,
  height: PropTypes.number,
  highlightedNodeIds: PropTypes.object, // Set
  maxLabelLength: PropTypes.number,
  nodeImage: PropTypes.func,
  nodeRelativeSize: PropTypes.number,
  nodeSize: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.number,
  ]),
  onBackgroundClick: PropTypes.func,
  onNodeClick: PropTypes.func,
  onNodeHover: PropTypes.func,
  onSimulationEnd: PropTypes.func,
  onSimulationTick: PropTypes.func,
  onZoom: PropTypes.func,
  selectedNodeIds: PropTypes.object, // Set
  showDirectionality: PropTypes.bool,
  showLabels: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  showNeighborsOnly: PropTypes.bool,
  simulation: PropTypes.shape({
    alphaDecay: PropTypes.number,
    charge: PropTypes.number,
    cooldownTicks: PropTypes.number,
    cooldownTime: PropTypes.number,
    distance: PropTypes.number,
    fast: PropTypes.bool,
    forces: PropTypes.array,
    velocityDecay: PropTypes.number,
    warmupTicks: PropTypes.number,
  }),
  width: PropTypes.number,
}

Visualization.defaultProps = {
  highlightedNodeIds: new Set(),
  onBackgroundClick: () => {},
  onNodeClick: () => {},
  onNodeHover: () => {},
  onSimulationEnd: () => {},
  onSimulationTick: () => {},
  onZoom: () => {},
  showNeighborsOnly: false,
  selectedNodeIds: new Set(),
  showDirectionality: true,
}

export default Visualization
