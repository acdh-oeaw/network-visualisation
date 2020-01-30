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
  }`,
  `[data-nerv-simulation-controls] > input[type="number"] {
    width: 4em;
  }`,
  `[data-nerv-simulation-controls] > span {
    alignItems: center;
    display: inline-flex;
    position: relative;
  }`,
  `[data-nerv-simulation-controls] > span > select {
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
  `[data-nerv-simulation-controls] > span > select:hover,
  [data-nerv-simulation-controls] > span > select:focus {
    background: #ddd;
  }`,
  `[data-nerv-simulation-controls] > span > span {
    align-self: center;
    margin-right: 0.3rem;
    pointer-events: none;
    position: absolute;
    right: 0;
  }`,
]
rules.forEach(rule => style.sheet.insertRule(rule))

const defaults = {
  charge: -50,
  dagMode: null,
  distance: 20,
  showDirectionality: true,
}

const dagModes = [
  { label: 'Default', value: '' },
  { label: 'Left to right', value: 'lr' },
  { label: 'Right to left', value: 'rl' },
  { label: 'Top down', value: 'td' },
  { label: 'Bottom up', value: 'bu' },
  { label: 'Radial in', value: 'radialin' },
  { label: 'Radial out', value: 'radialout' },
]
const dagModes3d = [
  { label: 'Z in', value: 'zin' },
  { label: 'Z out', value: 'zout' },
]

const getOption = (options, key) => {
  if (options[key] !== undefined) {
    return options[key]
  }
  return defaults[key]
}

const SimulationControls = ({
  children,
  is3D = false,
  options = {},
  ui = {},
  ...props
}) => {
  const [charge, setCharge] = useState(getOption(options, 'charge'))
  const [dagMode, setDagMode] = useState(getOption(options, 'dagMode'))
  const [distance, setDistance] = useState(getOption(options, 'distance'))
  const [showDirectionality, setShowDirectionality] = useState(
    getOption(options, 'showDirectionality')
  )

  const setValue = (_value, cb) => {
    const value = parseInt(_value, 10)
    if (Number.isInteger(value)) {
      cb(value)
    }
  }

  const modes = is3D ? [...dagModes, ...dagModes3d] : dagModes

  return (
    <>
      {typeof children === 'function'
        ? children({ charge, distance, showDirectionality, dagMode })
        : null}

      <form data-nerv-simulation-controls {...props}>
        {ui.charge !== false ? (
          <>
            <label htmlFor="nerv-charge">Charge</label>
            <input
              id="nerv-charge"
              onChange={e => setValue(e.target.value, setCharge)}
              type="number"
              value={charge}
            />
          </>
        ) : null}

        {ui.distance !== false ? (
          <>
            <label htmlFor="nerv-distance">Distance</label>
            <input
              id="nerv-distance"
              onChange={e => setValue(e.target.value, setDistance)}
              type="number"
              value={distance}
            />
          </>
        ) : null}

        {ui.dagMode !== false ? (
          <>
            <label htmlFor="nerv-dag-mode">Mode</label>
            <span>
              <select
                id="nerv-dag-mode"
                onChange={e => setDagMode(e.target.value || null)}
                value={dagMode}
              >
                {modes.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
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
          </>
        ) : null}

        {ui.showDirectionality !== false ? (
          <>
            <input
              id="nerv-directionality"
              checked={showDirectionality}
              onChange={e => setShowDirectionality(e.target.checked)}
              type="checkbox"
            />
            <label htmlFor="nerv-directionality">Show directionality</label>
          </>
        ) : null}
      </form>
    </>
  )
}

SimulationControls.propTypes = {
  children: PropTypes.func,
  is3D: PropTypes.bool,
  options: PropTypes.shape({
    charge: PropTypes.number,
    dagMode: PropTypes.oneOf([
      null,
      'lr',
      'rl',
      'td',
      'bu',
      'radialin',
      'radialout',
      'zin',
      'zout',
    ]),
    distance: PropTypes.number,
    showDirectionality: PropTypes.bool,
  }),
  ui: PropTypes.shape({
    charge: PropTypes.bool,
    dagMode: PropTypes.bool,
    distance: PropTypes.bool,
    showDirectionality: PropTypes.bool,
  }),
}

export default SimulationControls
