import React, { useState } from 'react'
import PropTypes from 'prop-types'

const style = document.createElement('style')
style.appendChild(document.createTextNode(''))
document.head.appendChild(style)
const rules = [
  `[data-nerv-3d-toggle] {
    background: white;
    border: 1px solid #ddd;
    cursor: pointer;
    font-family: sans-serif;
    font-size: 12px;
    font-weight: bold;
    letter-spacing: 1px;
    line-height: 1.5;
    padding: 0.4rem;
    position: absolute;
    text-transform: uppercase;
  }`,
  `[data-nerv-3d-toggle]:hover,
  [data-nerv-3d-toggle]:active {
    background: #ddd;
    color: currentColor;
  }`,
]
rules.forEach(rule => style.sheet.insertRule(rule))

const ToggleThirdDimension = ({ children, ...props }) => {
  const [is3D, setis3D] = useState(false)

  return (
    <>
      {typeof children === 'function' ? children(is3D) : null}
      <button
        data-nerv-3d-toggle
        onClick={() => setis3D(is3D => !is3D)}
        {...props}
      >
        {is3D ? '2D' : '3D'}
      </button>
    </>
  )
}

ToggleThirdDimension.propTypes = {
  children: PropTypes.func,
}

export default ToggleThirdDimension
