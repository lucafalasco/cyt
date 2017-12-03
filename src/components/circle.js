import React from 'react'
import PropTypes from 'prop-types'
import { select } from 'd3-selection'
import 'd3-transition'

export default class Circle extends React.Component {
  static propTypes = {
    cx: PropTypes.number.isRequired,
    cy: PropTypes.number.isRequired,
    radius: PropTypes.number.isRequired,
    color: PropTypes.string,
    hash: PropTypes.string,
    opacify: PropTypes.bool,
    interactionIsActive: PropTypes.bool,
    onHover: PropTypes.func,
  }

  componentDidMount() {
    const { radius } = this.props
    const selection = select(this._circle)

    selection.transition().duration(500).attr('r', radius)
  }

  componentWillLeave(callback) {
    const selection = select(this._circle)

    selection.transition().duration(500).attr('r', 0).on('end', callback)
  }

  onInteractionStart = () => {
    this.props.onHover(this.props.hash)
  }

  onInteractionEnd = () => {
    this.props.onHover()
  }

  openExternalLink = () => {
    window.open('https://live.blockcypher.com/btc/tx/' + this.props.hash)
  }

  render() {
    const { hash, color, cx, cy, opacify, interactionIsActive } = this.props

    return (
      <circle
        data-for={hash}
        data-tip
        className={`o-${opacify ? 80 : interactionIsActive ? 10 : 60}`}
        fill={opacify ? 'transparent' : color}
        stroke={color}
        strokeWidth="2"
        cx={cx}
        cy={cy}
        r={0}
        ref={c => {
          this._circle = c
        }}
        onMouseEnter={this.onInteractionStart}
        onMouseLeave={this.onInteractionEnd}
        onClick={this.openExternalLink}
      />
    )
  }
}
