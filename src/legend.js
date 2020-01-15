import React from 'react'
import PropTypes from 'prop-types'

const style = document.createElement('style')
style.appendChild(document.createTextNode(''))
document.head.appendChild(style)
const rules = [
  `[data-nerv-legend] {
    font-family: sans-serif;
    font-size: 12px;
    font-weight: bold;
    letter-spacing: 1px;
    list-style: none;
    margin: 0;
    padding: 0.4rem 0.6rem;
    position: absolute;
    right: 0;
    text-transform: uppercase;
  }`,
  `[data-nerv-legend] > li > span {
    display: inline-block;
    height: 10px;
    margin-right: 0.4rem;
    width: 10px;
  }`,
]
rules.forEach(rule => style.sheet.insertRule(rule))

const Legend = ({ className, getTypes }) => {
  const [types, setTypes] = React.useState([])

  const graphTypes = getTypes() || {}
  const nodeTypes = graphTypes.nodes || []

  React.useEffect(() => {
    setTypes(
      Array.isArray(nodeTypes)
        ? nodeTypes
        : Object.values(nodeTypes).reduce((acc, type) => acc.concat(type), [])
    )
  }, [nodeTypes])

  return (
    <ul data-nerv-legend className={className}>
      {Array.isArray(types) &&
        types.map(type => (
          <li key={type.id}>
            <span
              style={{
                background: type.color,
              }}
            />
            {type.label}
          </li>
        ))}
    </ul>
  )
}

Legend.propTypes = {
  className: PropTypes.string,
  getTypes: PropTypes.func.isRequired,
}

export default Legend
