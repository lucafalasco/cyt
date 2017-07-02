import React from 'react'
import PropTypes from 'prop-types'

export default class Line extends React.Component {
  static propTypes = {
    x1: PropTypes.number.isRequired,
    x2: PropTypes.number.isRequired,
    y1: PropTypes.number.isRequired,
    y2: PropTypes.number.isRequired,
  }

  render() {
    const { color, x1, y1, x2, y2 } = this.props

    return (
      <line
        className="o-50"
        stroke={color}
        strokeWidth="1"
        x1={x1}
        x2={x2}
        y1={y1}
        y2={y2}
        ref={c => {
          this._line = c
        }}
      />
    )
  }
}
