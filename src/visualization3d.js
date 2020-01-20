import React from 'react'
import PropTypes from 'prop-types'
import ForceGraph from '3d-force-graph'
import SpriteText from 'three-spritetext'
import debounce from 'debounce-fn'

import Graph from './graph'
import { mergeTypes } from './utils'
import { NODE_RELATIVE_SIZE, colors } from './constants'

import './global.css'

class Visualization3D extends React.Component {
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
    this.getNodeColor = this.getNodeColor.bind(this)
    this.getNodeLabel = this.getNodeLabel.bind(this)
    this.getNodeRelativeSize = this.getNodeRelativeSize.bind(this)
    this.getNodeValue = this.getNodeValue.bind(this)
    this.getNodeVisibility = this.getNodeVisibility.bind(this)
    this.getTypes = this.getTypes.bind(this)
    this.isNeighborOfSelectedNode = this.isNeighborOfSelectedNode.bind(this)
    this.onWindowResize = this.onWindowResize.bind(this)
    this.shouldExtendNodeThreeObject = this.shouldExtendNodeThreeObject.bind(
      this
    )
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
      graph,
      height,
      highlightedNodeIds,
      nodeRelativeSize,
      nodeSize,
      selectedNodeIds,
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

    if (highlightedNodeIds !== prevProps.highlightedNodeIds) {
      // Avoid stale closure. Probably caused by how `3d-force-graph` method binding
      this.forceGraph.nodeColor(this.getNodeColor)
      this.forceGraph.nodeLabel(this.getNodeLabel)
      this.forceGraph.nodeVal(this.getNodeValue)
      this.forceGraph.nodeVisibility(this.getNodeVisibility)
      this.forceGraph.nodeThreeObjectExtend(this.shouldExtendNodeThreeObject)
      this.forceGraph.nodeThreeObject(this.drawNode)
      this.forceGraph.linkLabel(this.getEdgeLabel)
      this.forceGraph.linkVisibility(this.getEdgeVisibility)
    }

    if (selectedNodeIds !== prevProps.selectedNodeIds) {
      // Avoid stale closure. Probably caused by how `3d-force-graph` method binding
      this.forceGraph.nodeColor(this.getNodeColor)
      this.forceGraph.nodeLabel(this.getNodeLabel)
      this.forceGraph.nodeVal(this.getNodeValue)
      this.forceGraph.nodeVisibility(this.getNodeVisibility)
      this.forceGraph.nodeThreeObjectExtend(this.shouldExtendNodeThreeObject)
      this.forceGraph.nodeThreeObject(this.drawNode)
      this.forceGraph.linkLabel(this.getEdgeLabel)
      this.forceGraph.linkVisibility(this.getEdgeVisibility)
    }

    if (showNeighborsOnly !== prevProps.showNeighborsOnly) {
      // Avoid stale closure. Probably caused by how `3d-force-graph` method binding
      this.forceGraph.nodeColor(this.getNodeColor)
      this.forceGraph.nodeLabel(this.getNodeLabel)
      this.forceGraph.nodeVal(this.getNodeValue)
      this.forceGraph.nodeVisibility(this.getNodeVisibility)
      this.forceGraph.nodeThreeObjectExtend(this.shouldExtendNodeThreeObject)
      this.forceGraph.nodeThreeObject(this.drawNode)
      this.forceGraph.linkLabel(this.getEdgeLabel)
      this.forceGraph.linkVisibility(this.getEdgeVisibility)
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize)
    this.dispose()
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
    this.forceGraph.showNavInfo(false)

    this.resizeCanvas()

    const {
      backgroundColor,
      dagMode,
      dagLevelDistance,
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
      forces,
      velocityDecay,
      warmupTicks,
    } = simulation || {}

    this.forceGraph.backgroundColor(backgroundColor)

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
    this.forceGraph.nodeColor(this.getNodeColor)
    this.forceGraph.nodeLabel(this.getNodeLabel)
    this.forceGraph.nodeRelSize(this.getNodeRelativeSize())
    this.forceGraph.nodeThreeObject(this.drawNode)
    this.forceGraph.nodeThreeObjectExtend(this.shouldExtendNodeThreeObject)
    this.forceGraph.nodeVal(this.getNodeValue)
    this.forceGraph.nodeVisibility(this.getNodeVisibility)

    this.forceGraph.linkColor(() => 'rgba(0, 0, 0, 0.50)')
    this.forceGraph.linkDirectionalParticles(showDirectionality ? 2 : 0)
    // this.forceGraph.linkDirectionalParticleWidth(1)
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

    // `3d-force-graph` does not expose `onZoom`, so we listen for
    // change events on the three orbit controls and calculate a
    // substitute for "zoom-factor" from the position of the
    // perspective camera.
    const debouncedOnZoom = debounce(
      controls => {
        const distance = controls.target.target.distanceTo(
          controls.target.object.position
        )
        onZoom({
          forceGraph: this.forceGraph,
          graph: this.graph,
          zoom: { k: (distance / 1000).toFixed(2) },
        })
      },
      { wait: 250 }
    )
    this.forceGraph.controls().addEventListener('change', debouncedOnZoom)
  }

  dispose() {
    // `3d-force-graph` does not publicly expose a `dispose` method
    // to garbage-collect all Three objects, so this is copied
    // straight from `three-force-graph`.
    const materialDispose = material => {
      if (material instanceof Array) {
        material.forEach(materialDispose)
      } else {
        if (material.map) {
          material.map.dispose()
        }
        material.dispose()
      }
    }
    const deallocate = obj => {
      if (obj.geometry) {
        obj.geometry.dispose()
      }
      if (obj.material) {
        materialDispose(obj.material)
      }
      if (obj.texture) {
        obj.texture.dispose()
      }
      if (obj.children) {
        obj.children.forEach(deallocate)
      }
    }

    const scene = this.forceGraph.scene()
    while (scene.children.length) {
      const obj = scene.children[0]
      scene.remove(obj)
      deallocate(obj)
    }
    scene.dispose()
    this.forceGraph.controls().dispose()
    this.forceGraph.renderer().dispose()
  }

  drawNode(node) {
    // Default node is drawn depending on `shouldExtendNodeThreeObject`

    // Always show label for selected nodes
    if (this.props.selectedNodeIds.has(node.id)) {
      const sprite = new SpriteText(node.label)
      sprite.color = 'rgba(0, 0, 0, 1)'
      sprite.textHeight = 2
      return sprite
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
    if (this.props.selectedNodeIds.has(node.id)) {
      return this.colors.selected
    }
    if (this.props.highlightedNodeIds.has(node.id)) {
      return this.colors.highlighted
    }

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
        return this.nodeSize(node) * this.getNodeRelativeSize()
      }
      if (typeof this.nodeSize === 'string') {
        return node[this.nodeSize] * this.getNodeRelativeSize()
      }
      return this.nodeSize * this.getNodeRelativeSize()
    }
    return node.neighbors.size * this.getNodeRelativeSize()
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

  shouldExtendNodeThreeObject(node) {
    if (!this.props.showNeighborsOnly || this.isNeighborOfSelectedNode(node)) {
      return true
    }
    return false
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

Visualization3D.propTypes = {
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
  showNeighborsOnly: PropTypes.bool,
  simulation: PropTypes.shape({
    alphaDecay: PropTypes.number,
    charge: PropTypes.number,
    cooldownTicks: PropTypes.number,
    cooldownTime: PropTypes.number,
    distance: PropTypes.number,
    forces: PropTypes.array,
    velocityDecay: PropTypes.number,
    warmupTicks: PropTypes.number,
  }),
  width: PropTypes.number,
}

Visualization3D.defaultProps = {
  backgroundColor: 'rgba(255, 255, 255, 0)',
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

export default Visualization3D
