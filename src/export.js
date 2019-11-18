import React from 'react'
import PropTypes from 'prop-types'

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

  const nodeAttributes = new Set()
  const edgeAttributes = new Set()

  nodes.forEach(node => {
    const element = doc.createElement('node')

    // x, y, vx, vy, index, __indexColor are internal values
    /* eslint-disable-next-line no-unused-vars */
    const { id, __indexColor, x, y, vx, vy, index, ...attributes } = node

    element.setAttribute('id', id)

    if (node.type) {
      if (!nodeAttributes.has('color')) {
        nodeAttributes.add('color')
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
        if (!nodeAttributes.has(name)) {
          nodeAttributes.add(name)
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
    edgesElement.appendChild(element)

    Object.entries(attributes).forEach(([name, content]) => {
      if (content && typeof content !== 'object') {
        if (!edgeAttributes.has(name)) {
          edgeAttributes.add(name)
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
  })

  graphElement.appendChild(nodesElement)
  graphElement.appendChild(edgesElement)
  graphMlElement.appendChild(graphElement)
  doc.appendChild(graphMlElement)

  const serializer = new XMLSerializer()
  const xml = serializer.serializeToString(doc)

  return [xmlDeclaration, xml].join('\n')
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

  const nodesElement = doc.createElement('nodes')
  const edgesElement = doc.createElement('edges')

  graphElement.appendChild(nodesElement)
  graphElement.appendChild(edgesElement)
  gexfElement.appendChild(graphElement)
  doc.appendChild(gexfElement)

  nodes.forEach(node => {
    const nodeElement = doc.createElement('node')
    nodeElement.setAttribute('id', node.id)
    if (node.label) {
      nodeElement.setAttribute('label', node.label)
    }
    if (node.type) {
      const colorElement = doc.createElement('viz:color')
      colorElement.setAttribute('hex', getNodeColor(node))
      nodeElement.appendChild(colorElement)
    }
    nodesElement.appendChild(nodeElement)
  })

  edges.forEach(edge => {
    const edgeElement = doc.createElement('edge')
    edgeElement.setAttribute('id', edge.id)
    edgeElement.setAttribute('source', edge.source.id || edge.source)
    edgeElement.setAttribute('target', edge.target.id || edge.target)
    edgesElement.appendChild(edgeElement)
  })

  const serializer = new XMLSerializer()
  const xml = serializer.serializeToString(doc)

  return [xmlDeclaration, xml].join('\n')
}

const ExportButton = ({ className, getGraph, getNodeColor }) => {
  const [selected, setSelected] = React.useState('')

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        position: 'absolute',
        padding: '0.4rem',
      }}
    >
      <span
        style={{
          alignItems: 'center',
          display: 'inline-flex',
          position: 'relative',
        }}
      >
        <select
          style={{
            background: 'white',
            border: '1px solid #ddd',
            borderRight: 'none',
            fontSize: 12,
            fontWeight: 'bold',
            letterSpacing: '1px',
            lineHeight: 1.5,
            padding: '0.4rem',
            paddingRight: '1rem',
            textTransform: 'uppercase',
            WebkitAppearance: 'none',
          }}
          onChange={event => setSelected(event.target.value)}
          value={selected}
        >
          <option value="" disabled>
            Export as
          </option>
          <option value="gexf">GEXF</option>
          <option value="graphml">GraphML</option>
        </select>
        <span
          style={{
            marginRight: '0.3rem',
            pointerEvents: 'none',
            position: 'absolute',
            right: 0,
          }}
        >
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
        style={{
          background: 'white',
          border: '1px solid #ddd',
          fontSize: 12,
          fontWeight: 'bold',
          letterSpacing: '1px',
          lineHeight: 1.5,
          padding: '0.4rem 0.6rem',
          textTransform: 'uppercase',
        }}
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
