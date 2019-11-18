import React from 'react'
import PropTypes from 'prop-types'

const Legend = ({ className, getTypes }) => {
  const [types, setTypes] = React.useState([])
  React.useEffect(() => {
    const types = getTypes() || {}
    const nodeTypes = types.nodes || []
    setTypes(
      Array.isArray(nodeTypes)
        ? nodeTypes
        : Object.values(nodeTypes).reduce((acc, type) => acc.concat(type), [])
    )
  })
  return (
    <ul
      className={className}
      style={{
        position: 'absolute',
        right: 0,
        padding: '0.4rem 0.6rem',
        listStyleType: 'none',
        margin: 0,
        fontFamily: 'sans-serif',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: '1px',
        textTransform: 'uppercase',
      }}
    >
      {Array.isArray(types) &&
        types.map(type => (
          <li key={type.id}>
            <span
              style={{
                display: 'inline-block',
                width: 10,
                height: 10,
                background: type.color,
                marginRight: '0.4rem',
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
