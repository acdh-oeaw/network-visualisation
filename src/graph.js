import EventEmitter from 'events'

class Graph extends EventEmitter {
  constructor(props) {
    super(props)

    this.nodes = new Map()
    this.edges = new Map()
  }

  addGraph({ nodes, edges }, replace) {
    if (replace) {
      this.clear()
    }
    this.addNodes(nodes)
    this.addEdges(edges)
  }

  addEdge(edge) {
    if (!this.edges.has(edge.id)) {
      const newEdge = {
        ...edge,
      }
      this.edges.set(edge.id, newEdge)
      this.addNodeNeighbor(edge.source, edge.target, edge.id)
      this.addNodeNeighbor(edge.target, edge.source, edge.id)
      this.emit(Graph.events.EDGE_ADDED, newEdge)
      return newEdge
    }
    return null
  }

  addEdges(edges) {
    const edgesToAdd = Array.isArray(edges) ? edges : Object.values(edges)
    const edgesAdded = edgesToAdd
      .map(edge => this.addEdge(edge))
      .filter(Boolean)
    if (edgesAdded.length) {
      this.emit(Graph.events.EDGES_ADDED, edgesAdded)
    }
  }

  addNode(node) {
    if (!this.nodes.has(node.id)) {
      const newNode = {
        ...node,
        neighbors: new Set(),
        edges: new Set(),
      }
      this.nodes.set(node.id, newNode)
      this.emit(Graph.events.NODE_ADDED, newNode)
      return newNode
    }
    return null
  }

  addNodes(nodes) {
    const nodesToAdd = Array.isArray(nodes) ? nodes : Object.values(nodes)
    const nodesAdded = nodesToAdd
      .map(node => this.addNode(node))
      .filter(Boolean)
    if (nodesAdded.length) {
      this.emit(Graph.events.NODES_ADDED, nodesAdded)
    }
  }

  getNode(id) {
    return this.nodes.get(id)
  }

  getNodes(ids) {
    return Array.isArray(ids)
      ? Array.from(this.nodes.values()).filter(node => ids.includes(node.id))
      : Array.from(this.nodes.values())
  }

  getEdge(id) {
    return this.edges.get(id)
  }

  getEdges(ids) {
    return Array.isArray(ids)
      ? Array.from(this.edges.values()).filter(edge => ids.includes(edge.id))
      : Array.from(this.edges.values())
  }

  // TODO:
  // createEdge(edge) {}

  // TODO:
  // createNode(node) {}

  addNodeNeighbor(id, neighborId, edgeId) {
    const node = this.nodes.get(id)
    if (node) {
      node.neighbors.add(neighborId)
      node.edges.add(edgeId)
    }
  }

  getNodeNeighbors(id) {
    const node = this.nodes.get(id)
    return node && node.neighbors
  }

  getNodeEdges(id) {
    const node = this.nodes.get(id)
    return node && node.edges
  }

  clear() {
    this.nodes = new Map()
    this.edges = new Map()
    this.emit(Graph.events.GRAPH_CLEARED)
  }
}

Graph.events = {
  EDGE_ADDED: 'EDGE_ADDED',
  EDGES_ADDED: 'EDGES_ADDED',
  GRAPH_CLEARED: 'GRAPH_CLEARED',
  NODE_ADDED: 'NODE_ADDED',
  NODES_ADDED: 'NODES_ADDED',
}

export default Graph
