import React from 'react'
import PropTypes from 'prop-types'

import { geoPath } from 'd3-geo'

export default class GeoPath extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    color: PropTypes.string,
  }

  render() {
    const { data, color, projection } = this.props

    const generateGeoPath = geoPath().projection(projection)

    return (
      <path
        style={{
          fill: color,
        }}
        stroke={color}
        strokeWidth={1}
        id={data.id}
        d={generateGeoPath(data)}
      />
    )
  }
}
