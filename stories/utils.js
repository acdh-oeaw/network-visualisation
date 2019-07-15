export const random = n => Math.floor(Math.random() * n)

export const range = n => Array.from(Array(n).keys())

const types = {
  nodes: [
    { id: 'Event', label: 'Event', color: '#006699' },
    { id: 'Institution', label: 'Institution', color: '#990066' },
    { id: 'Person', label: 'Person', color: '#669900' },
    { id: 'Place', label: 'Place', color: '#009966' },
    { id: 'Work', label: 'Work', color: '#660099' },
  ],
  edges: [{ id: 'related to', label: 'related to' }],
}

export const createRandomGraph = (n = 100) => {
  const nodes = range(n).map(id => ({
    id: `n${id}`,
    label: `Node ${id}`,
    type: types.nodes[random(types.nodes.length)].id,
  }))
  const edges = range(n).map(id => ({
    id: `e${id}`,
    label: `Edge ${id}`,
    source: `n${random(n)}`,
    target: `n${random(n)}`,
    type: types.edges[random(types.edges.length)].id,
  }))
  return {
    nodes,
    edges,
    types,
  }
}

export const createRandomDAG = (n = 100) => {
  const nodes = range(n).map(id => ({
    id: `n${id}`,
    label: `Node ${id}`,
    type: types.nodes[random(types.nodes.length)].id,
  }))
  const edges = []
  for (let i = 0; i < n; ++i) {
    for (let j = i + 1; j < n; ++j) {
      if (j % i === 0) {
        edges.push({ id: 'e' + i + j, source: 'n' + i, target: 'n' + j })
      }
    }
  }
  return {
    nodes,
    edges,
    types,
  }
}
