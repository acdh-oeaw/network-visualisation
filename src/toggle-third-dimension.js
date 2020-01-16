import React, { useState } from 'react'
import PropTypes from 'prop-types'

const style = document.createElement('style')
style.appendChild(document.createTextNode(''))
document.head.appendChild(style)
const rules = [
  `[data-nerv-3d-toggle] {
    position: relative;
    z-index: 10;
  }`,
]
rules.forEach(rule => style.sheet.insertRule(rule))

const ToggleThirdDimension = ({ children, ...props }) => {
  const [is3D, setis3D] = useState(false)

  return (
    <>
      <button
        data-nerv-3d-toggle
        onClick={() => setis3D(is3D => !is3D)}
        {...props}
      >
        {is3D ? '2D' : '3D'}
      </button>
      {typeof children === 'function' ? children(is3D) : null}
    </>
  )
}

ToggleThirdDimension.propTypes = {
  children: PropTypes.func,
}

export default ToggleThirdDimension
