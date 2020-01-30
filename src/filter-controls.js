import React, { useState } from 'react'
import PropTypes from 'prop-types'

const style = document.createElement('style')
style.appendChild(document.createTextNode(''))
document.head.appendChild(style)
const rules = [
  `[data-nerv-filter-controls] {
    display: flex;
    font-family: sans-serif;
    font-size: 12px;
    padding: 0.4rem;
    position: absolute;
  }`,
  `[data-nerv-filter-controls] > button {
    background: white;
    border: 1px solid #ddd;
    cursor: pointer;
    font-family: sans-serif;
    font-size: 12px;
    font-weight: bold;
    letter-spacing: 1px;
    text-transform: uppercase;
  }`,
  `[data-nerv-filter-controls] > button:hover,
  [data-nerv-filter-controls] > button:active {
    background: #ddd;
    color: currentColor;
  }`,
  `[data-nerv-filter-controls] > label {}`,
  `[data-nerv-filter-controls] > input {
    background: white;
    border: 1px solid #ddd;
    border-right: none;
    padding: 0.4rem;
  }`,
]
rules.forEach(rule => style.sheet.insertRule(rule))

const FilterControls = ({ children, graph = {}, ...props }) => {
  const [filteredNodeIds, setFilteredNodeIds] = useState(new Set())
  const [searchTerm, setSearchTerm] = useState('')

  const onSubmit = e => {
    e.preventDefault()

    if (searchTerm) {
      const nodes = Array.isArray(graph.nodes)
        ? graph.nodes
        : Object.values(graph.nodes || {})

      const term = searchTerm.toLowerCase()

      // TODO: filter logic
      const ids = nodes
        .filter(node => node.label && node.label.toLowerCase().includes(term))
        .map(node => node.id)

      setFilteredNodeIds(new Set(ids))
    } else {
      setFilteredNodeIds(new Set())
    }
  }

  return (
    <>
      {typeof children === 'function' ? children({ filteredNodeIds }) : null}
      <form data-nerv-filter-controls onSubmit={onSubmit} {...props}>
        <input
          aria-label="Search term"
          id="nerv-filter-controls"
          onChange={e => setSearchTerm(e.target.value)}
          type="search"
          value={searchTerm}
        />
        <button type="submit">Filter</button>
      </form>
    </>
  )
}

FilterControls.propTypes = {
  children: PropTypes.func,
  graph: PropTypes.shape({
    nodes: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  }),
}

export default FilterControls
