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
    transparent: PropTypes.bool,
    interactionIsActive: PropTypes.bool,
    onHover: PropTypes.func,
  }

  componentDidMount() {
    const { radius } = this.props
    const selection = select(this._circle)

    selection
      .transition()
      .duration(500)
      .attr('r', radius)
  }

  componentWillLeave(callback) {
    const selection = select(this._circle)

    selection
      .transition()
      .duration(500)
      .attr('r', 0)
      .on('end', callback)
  }

  onInteractionStart = () => {
    this.props.onHover(this.props.hash)
  }

  onInteractionEnd = () => {
    this.props.onHover()
  }

  openExternalLink = () => {
    // window.open(`https://live.blockcypher.com/${this.props.coin}/tx/${this.props.hash}`)
    window.open(`https://blockchain.info/tx/${this.props.hash}`)
  }

  render() {
    const { hash, color, exceed, cx, cy, transparent, interactionIsActive } = this.props

    return (
      <circle
        data-for={hash}
        data-tip
        className={`o-${transparent ? 80 : interactionIsActive ? 10 : 80} pointer`}
        fill={transparent ? 'transparent' : color}
        stroke={color}
        strokeDasharray={exceed ? [2, 5] : 0}
        strokeWidth={exceed ? 10 : 3}
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
