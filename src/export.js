import React from 'react'
import PropTypes from 'prop-types'

const style = document.createElement('style')
style.appendChild(document.createTextNode(''))
document.head.appendChild(style)
const rules = [
  `[data-nerv-export] {
    display: inline-flex;
    position: absolute;
    padding: 0.4rem;
  }`,
  `[data-nerv-export] > span {
    alignItems: center;
    display: inline-flex;
    position: relative;
  }`,
  `[data-nerv-export] > span > select {
    background: white;
    border: 1px solid #ddd;
    cursor: pointer;
    font-family: sans-serif;
    font-size: 12px;
    font-weight: bold;
    letter-spacing: 1px;
    line-height: 1.5;
    padding: 0.4rem;
    padding-right: 1.2rem;
    text-transform: uppercase;
    -webkit-appearance: none;
  }`,
  `[data-nerv-export] > span > select:hover,
  [data-nerv-export] > span > select:focus {
    background: #ddd;
  }`,
  `[data-nerv-export] > span > span {
    align-self: center;
    margin-right: 0.3rem;
    pointer-events: none;
    position: absolute;
    right: 0;
  }`,
  `[data-nerv-export] > button {
    background: white;
    border: 1px solid #ddd;
    border-left: none;
    cursor: pointer;
    font-family: sans-serif;
    font-size: 12px;
    font-weight: bold;
    letter-spacing: 1px;
    line-height: 1.5;
    padding: 0.4rem 0.6rem;
    text-transform: uppercase;
  }`,
  `[data-nerv-export] > button:hover {
    background: #ddd;
  }`,
  `[data-nerv-export] > button[disabled] {
    cursor: not-allowed;
  }`,
]
rules.forEach(rule => style.sheet.insertRule(rule))

const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8"?>'

const createGraphMLAttribute = ({ doc, parent, name, type = 'node' }) => {
  const attribute = doc.createElement('key')
  attribute.setAttribute('id', name)
  attribute.setAttribute('for', type)
  attribute.setAttribute('attr.name', name)
  attribute.setAttribute('attr.type', 'string')
  parent.appendChild(attribute)
}

const addGraphMLAttribute = ({ doc, name, content, element }) => {
  const data = doc.createElement('data')
  data.setAttribute('key', name)
  const text = doc.createTextNode(content)
  data.appendChild(text)
  element.appendChild(data)
}

export const convertToGraphML = ({ nodes, edges, getNodeColor }) => {
  const doc = new Document()

  const graphMlElement = doc.createElement('graphml')
  graphMlElement.setAttribute('xmlns', 'http://graphml.graphdrawing.org/xmlns')
  graphMlElement.setAttribute(
    'xmlns:xsi',
    'http://www.w3.org/2001/XMLSchema-instance'
  )
  graphMlElement.setAttribute(
    'xsi:schemaLocation',
    'http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd'
  )

  const graphElement = doc.createElement('graph')
  graphElement.setAttribute('id', 'graph')
  graphElement.setAttribute('edgedefault', 'directed')

  const nodesElement = doc.createElement('nodes')
  const edgesElement = doc.createElement('edges')

  const seenNodeAttributes = new Set()
  const seenEdgeAttributes = new Set()

  nodes.forEach(node => {
    const element = doc.createElement('node')

    // x, y, vx, vy, index, __indexColor are internal values
    /* eslint-disable-next-line no-unused-vars */
    const { id, __indexColor, x, y, vx, vy, index, ...attributes } = node

    element.setAttribute('id', id)

    if (node.type) {
      if (!seenNodeAttributes.has('color')) {
        seenNodeAttributes.add('color')
        createGraphMLAttribute({ doc, parent: graphMlElement, name: 'color' })
      }
      addGraphMLAttribute({
        doc,
        name: 'color',
        content: getNodeColor(node),
        element,
      })
    }

    Object.entries(attributes).forEach(([name, content]) => {
      if (content && typeof content !== 'object') {
        if (!seenNodeAttributes.has(name)) {
          seenNodeAttributes.add(name)
          createGraphMLAttribute({ doc, parent: graphMlElement, name })
        }
        addGraphMLAttribute({ doc, name, content, element })
      }
    })

    nodesElement.appendChild(element)
  })

  edges.forEach(edge => {
    const element = doc.createElement('edge')

    // index, __indexColor are internal values
    /* eslint-disable-next-line no-unused-vars */
    const { id, source, target, __indexColor, index, ...attributes } = edge

    element.setAttribute('id', id)
    element.setAttribute('source', source.id || source)
    element.setAttribute('target', target.id || target)

    Object.entries(attributes).forEach(([name, content]) => {
      if (content && typeof content !== 'object') {
        if (!seenEdgeAttributes.has(name)) {
          seenEdgeAttributes.add(name)
          createGraphMLAttribute({
            doc,
            parent: graphMlElement,
            name,
            type: 'edge',
          })
        }
        addGraphMLAttribute({ doc, name, content, element })
      }
    })

    edgesElement.appendChild(element)
  })

  graphElement.appendChild(nodesElement)
  graphElement.appendChild(edgesElement)
  graphMlElement.appendChild(graphElement)
  doc.appendChild(graphMlElement)

  const serializer = new XMLSerializer()
  const xml = serializer.serializeToString(doc)

  return [xmlDeclaration, xml].join('\n')
}

const createGexfAttribute = ({ doc, parent, name, type = 'node' }) => {
  const attribute = doc.createElement('attribute')
  attribute.setAttribute('id', `${type}${name}`)
  attribute.setAttribute('title', name)
  attribute.setAttribute('type', 'string')
  parent.appendChild(attribute)
}

const addGexfAttribute = ({ doc, name, content, element, type = 'node' }) => {
  const data = doc.createElement('attvalue')
  data.setAttribute('for', `${type}${name}`)
  data.setAttribute('value', content)
  element.appendChild(data)
}

export const convertToGexf = ({ nodes, edges, getNodeColor }) => {
  const doc = new Document()

  const gexfElement = doc.createElement('gexf')
  gexfElement.setAttribute('xmlns', 'http://www.gexf.net/1.3draft')
  gexfElement.setAttribute('version', '1.3')
  gexfElement.setAttribute(
    'xmlns:xsi',
    'http://www.w3.org/2001/XMLSchema-instance'
  )
  gexfElement.setAttribute(
    'xsi:schemaLocation',
    'http://www.gexf.net/1.3draft/gexf.xsd'
  )
  gexfElement.setAttribute('xmlns:viz', 'http://www.gexf.net/1.3draft/viz')

  const graphElement = doc.createElement('graph')
  graphElement.setAttribute('mode', 'static')
  graphElement.setAttribute('defaultedgetype', 'directed')

  const nodeAttributes = doc.createElement('attributes')
  nodeAttributes.setAttribute('class', 'node')
  const edgeAttributes = doc.createElement('attributes')
  edgeAttributes.setAttribute('class', 'edge')
  graphElement.appendChild(nodeAttributes)
  graphElement.appendChild(edgeAttributes)

  const nodesElement = doc.createElement('nodes')
  const edgesElement = doc.createElement('edges')
  graphElement.appendChild(nodesElement)
  graphElement.appendChild(edgesElement)

  gexfElement.appendChild(graphElement)
  doc.appendChild(gexfElement)

  const seenNodeAttributes = new Set()
  const seenEdgeAttributes = new Set()

  nodes.forEach(node => {
    const element = doc.createElement('node')

    // x, y, vx, vy, index, __indexColor are internal values
    /* eslint-disable-next-line no-unused-vars */
    const { id, __indexColor, x, y, vx, vy, index, ...attributes } = node

    element.setAttribute('id', id)

    if (node.type) {
      const colorElement = doc.createElement('viz:color')
      colorElement.setAttribute('hex', getNodeColor(node))
      element.appendChild(colorElement)
    }

    const attrs = Object.entries(attributes)
    if (attrs.length) {
      const attributesElement = doc.createElement('attvalues')

      attrs.forEach(([name, content]) => {
        if (content && typeof content !== 'object') {
          if (!seenNodeAttributes.has(name)) {
            seenNodeAttributes.add(name)
            createGexfAttribute({ doc, parent: nodeAttributes, name })
          }
          addGexfAttribute({ doc, name, content, element: attributesElement })
        }
      })

      element.appendChild(attributesElement)
    }

    nodesElement.appendChild(element)
  })

  edges.forEach(edge => {
    const element = doc.createElement('edge')

    // index, __indexColor are internal values
    /* eslint-disable-next-line no-unused-vars */
    const { id, source, target, __indexColor, index, ...attributes } = edge

    element.setAttribute('id', id)
    element.setAttribute('source', source.id || source)
    element.setAttribute('target', target.id || target)

    if (attributes.length) {
      const attributesElement = doc.createElement('attvalues')

      Object.entries(attributes).forEach(([name, content]) => {
        if (content && typeof content !== 'object') {
          if (!seenEdgeAttributes.has(name)) {
            seenEdgeAttributes.add(name)
            createGraphMLAttribute({
              doc,
              parent: edgeAttributes,
              name,
              type: 'edge',
            })
          }
          addGraphMLAttribute({
            doc,
            name,
            content,
            element: attributesElement,
            type: 'edge',
          })
        }
      })

      element.appendChild(attributesElement)
    }

    edgesElement.appendChild(element)
  })

  const serializer = new XMLSerializer()
  const xml = serializer.serializeToString(doc)

  return [xmlDeclaration, xml].join('\n')
}

const ExportButton = ({ className, getGraph, getNodeColor }) => {
  const [selected, setSelected] = React.useState('')

  return (
    <div data-nerv-export className={className}>
      <span>
        <select
          onChange={event => setSelected(event.target.value)}
          value={selected}
        >
          <option value="" disabled>
            Export as
          </option>
          <option value="gexf">GEXF</option>
          <option value="graphml">GraphML</option>
        </select>
        <span>
          <svg viewBox="0 0 16 16" width="1em" height="1em">
            <polyline
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              points="5 8 8 11 11 8"
            />
          </svg>
        </span>
      </span>
      <button
        disabled={!selected}
        onClick={() => {
          const graph = getGraph()

          let xml

          switch (selected) {
            case 'gexf': {
              xml = convertToGexf({
                edges: graph.edges,
                nodes: graph.nodes,
                getNodeColor,
              })

              break
            }
            case 'graphml': {
              xml = convertToGraphML({
                edges: graph.edges,
                nodes: graph.nodes,
                getNodeColor,
              })
              break
            }
            default:
          }

          if (xml) {
            const blob = new Blob([xml], { type: 'text/xml' })
            const url = window.URL.createObjectURL(blob)
            const anchor = document.createElement('a')
            anchor.setAttribute('href', url)
            anchor.setAttribute('download', `graph.${selected}`)
            document.body.appendChild(anchor)
            anchor.click()
            document.body.removeChild(anchor)
          }
        }}
      >
        Download
      </button>
    </div>
  )
}

ExportButton.propTypes = {
  className: PropTypes.string,
  getGraph: PropTypes.func.isRequired,
  getNodeColor: PropTypes.func.isRequired,
}

export default ExportButton
