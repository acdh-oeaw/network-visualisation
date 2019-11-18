import React from 'react'
import PropTypes from 'prop-types'
import ForceGraph from 'force-graph'

import Graph from './graph'
import { NODE_RELATIVE_SIZE, colors } from './constants'

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
    this.getEdgeLabel = this.getEdgeLabel.bind(this)
    this.getEdgeVisibility = this.getEdgeVisibility.bind(this)
    this.getGraph = this.getGraph.bind(this)
    this.getNodeColor = this.getNodeColor.bind(this)
    this.getNodeLabel = this.getNodeLabel.bind(this)
    this.getNodeRelativeSize = this.getNodeRelativeSize.bind(this)
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
      dagMode,
      graph,
      height,
      highlightedNodeIds,
      selectedNodeIds,
      showNeighborsOnly,
      width,
    } = this.props

    if (backgroundColor !== prevProps.backgroundColor) {
      this.forceGraph.backgroundColor(backgroundColor)
    }

    if (dagMode !== prevProps.dagMode) {
      this.forceGraph.dagMode(dagMode)
      this.forceGraph.nodeRelSize(this.getNodeRelativeSize())
    }

    if (graph !== prevProps.graph) {
      this.graph.addGraph(
        {
          nodes: graph.nodes,
          edges: graph.edges,
        },
        graph.replace
      )
      this.types = graph.types || this.types
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
      onNodeClick,
      onSimulationEnd,
      onSimulationTick,
      onZoom,
    } = this.props

    this.forceGraph.backgroundColor(backgroundColor)

    this.forceGraph.dagMode(dagMode)

    this.forceGraph.nodeAutoColorBy(node => node.type)
    this.forceGraph.nodeCanvasObject(this.drawNode)
    this.forceGraph.nodeColor(this.getNodeColor)
    this.forceGraph.nodeLabel(this.getNodeLabel)
    this.forceGraph.nodeRelSize(this.getNodeRelativeSize())
    this.forceGraph.nodeVal(node => node.neighbors.size)
    this.forceGraph.nodeVisibility(this.getNodeVisibility)

    this.forceGraph.linkDirectionalParticles(2)
    this.forceGraph.linkLabel(this.getEdgeLabel)
    this.forceGraph.linkVisibility(this.getEdgeVisibility)

    this.forceGraph.onNodeClick(node => {
      onNodeClick({
        forceGraph: this.forceGraph,
        graph: this.graph,
        node,
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
    const nodeVal = node.neighbors.size
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
    if (selectedNodeIds.has(node.id)) {
      const { label } = node
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
  dagMode: PropTypes.oneOf([
    null,
    'lr',
    'rl',
    'td',
    'bu',
    'radialin',
    'radialout',
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
  nodeImage: PropTypes.func,
  onNodeClick: PropTypes.func,
  onNodeHover: PropTypes.func,
  onSimulationEnd: PropTypes.func,
  onSimulationTick: PropTypes.func,
  onZoom: PropTypes.func,
  selectedNodeIds: PropTypes.object, // Set
  showNeighborsOnly: PropTypes.bool,
  width: PropTypes.number,
}

Visualization.defaultProps = {
  highlightedNodeIds: new Set(),
  onNodeClick: () => {},
  onNodeHover: () => {},
  onSimulationEnd: () => {},
  onSimulationTick: () => {},
  onZoom: () => {},
  showNeighborsOnly: false,
  selectedNodeIds: new Set(),
}

export default Visualization
