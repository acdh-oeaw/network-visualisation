import React, { useState } from 'react'
import PropTypes from 'prop-types'

const style = document.createElement('style')
style.appendChild(document.createTextNode(''))
document.head.appendChild(style)
const rules = [
  `[data-nerv-simulation-controls] {
    align-items: center;
    display: flex;
    padding: 0.4rem;
    position: absolute;
    bottom: 0;
    right: 0;
  }`,
  `[data-nerv-simulation-controls] > label {
    font-family: sans-serif;
    font-size: 12px;
    font-weight: bold;
    letter-spacing: 1px;
    margin-right: 0.4rem;
    text-transform: uppercase;
  }`,
  `[data-nerv-simulation-controls] > input {
    background: white;
    border: 1px solid #ddd;
    margin-right: 0.4rem;
    padding: 0.4rem;
    width: 4em;
  }`,
]
rules.forEach(rule => style.sheet.insertRule(rule))

const defaults = {
  charge: -50,
  distance: 20,
}

const SimulationControls = ({ children, options = {}, ...props }) => {
  const [charge, setCharge] = useState(options.charge || defaults.charge)
  const [distance, setDistance] = useState(
    options.distance || defaults.distance
  )

  const setValue = (_value, cb) => {
    const value = parseInt(_value, 10)
    if (Number.isInteger(value)) {
      cb(value)
    }
  }

  return (
    <>
      {typeof children === 'function' ? children({ charge, distance }) : null}
      <form data-nerv-simulation-controls {...props}>
        <label htmlFor="nerv-charge">Charge</label>
        <input
          id="nerv-charge"
          onChange={e => setValue(e.target.value, setCharge)}
          type="number"
          value={charge}
        />

        <label htmlFor="nerv-distance">Distance</label>
        <input
          id="nerv-distance"
          onChange={e => setValue(e.target.value, setDistance)}
          type="number"
          value={distance}
        />
      </form>
    </>
  )
}

SimulationControls.propTypes = {
  children: PropTypes.func,
  options: PropTypes.shape({
    charge: PropTypes.number,
    distance: PropTypes.number,
  }),
}

export default SimulationControls
