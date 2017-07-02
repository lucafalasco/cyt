import React from 'react'
import PropTypes from 'prop-types'
import ReactTransitionGroup from 'react-addons-transition-group'
import { inject, observer } from 'mobx-react'
import _ from 'lodash'

import GeoPath from '../components/geo-path'
import Circle from '../components/circle'
import Line from '../components/line'

import ReactTooltip from 'react-tooltip'

import { geoEquirectangular } from 'd3-geo'
import { scaleLinear } from 'd3-scale'
import { feature } from 'topojson-client'

import worldMap from '../lib/world-map.json'

@inject('appState')
@observer
export default class App extends React.Component {
  static propTypes = {
    appState: PropTypes.object,
  }

  state = {
    focusedTransaction: '',
  }

  handleHovering = hash => {
    this.setState({ focusedTransaction: hash })
  }

  render() {
    const data = this.props.appState.wsData
    const { width, height } = this.props.appState
    const { focusedTransaction } = this.state

    const interactionIsActive = Boolean(focusedTransaction)

    const geojson = feature(worldMap, worldMap.objects.countries).features

    const projection = geoEquirectangular()
      .scale(width / 640 * 100)
      .translate([width / 2, height / 2])

    const radiusScale = scaleLinear()
      .domain([0, 500])
      .range([3, 100])
      .clamp(true)

    const map = geojson.map((geoData, i) =>
      <GeoPath
        key={i}
        handleHovering={this.handleHovering}
        chartWidth={width}
        chartHeight={height}
        data={geoData}
        projection={projection}
        color="#00b7ff"
      />
    )

    const transactionData = _.sortBy(data, d => d.value).reverse()

    const ripples = transactionData.map(
      ({ hash, longitude, latitude, value }) =>
        <Circle
          key={hash}
          cx={projection([longitude, latitude])[0]}
          cy={projection([longitude, latitude])[1]}
          radius={radiusScale(value)}
          hash={hash}
          interactionIsActive={interactionIsActive}
          opacify={focusedTransaction === hash}
          onHover={this.handleHovering}
          color="#FF4800"
        />
    )

    const dataLength = data.length
    const lastDataPoint = dataLength > 0 ? data[dataLength - 1] : []

    const lines =
      dataLength > 0 &&
      <g>
        <Line
          x1={projection([lastDataPoint.longitude, lastDataPoint.latitude])[0]}
          x2={projection([lastDataPoint.longitude, lastDataPoint.latitude])[0]}
          y1={0}
          y2={height}
          color="#ffffff"
        />,
        <Line
          x1={0}
          x2={width}
          y1={projection([lastDataPoint.longitude, lastDataPoint.latitude])[1]}
          y2={projection([lastDataPoint.longitude, lastDataPoint.latitude])[1]}
          color="#ffffff"
        />,
      </g>

    const tooltips = transactionData.map(
      ({ hash, ip, city, region, country, size, value }) =>
        <ReactTooltip
          class="tooltip"
          key={hash}
          id={hash}
          type="dark"
          effect="float"
          place="left"
        >
          <div><b>Hash:</b> {hash}</div>
          <div><b>IP:</b> {ip}</div>
          <div>
            <b>Location: </b>
            {city ? city + ', ' : ''}
            {region && region !== city ? region + ', ' : ''}
            {country}
          </div>
          <div><b>Size:</b> {size} byte</div>
          <div><b>Value:</b> {value} BTC</div>
        </ReactTooltip>
    )

    const filter = (
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    )

    return (
      <div className="w-100 h-100">
        <div className="w-100 h-100" ref="_chart">
          <svg className="svg">
            {filter}
            <g className="map">
              {map}
            </g>
            <ReactTransitionGroup
              component="g"
              className="transactions"
              style={{
                filter: interactionIsActive || 'url(#glow)',
              }}
            >
              {ripples}
            </ReactTransitionGroup>
            {lines}
          </svg>
          <div>
            {tooltips}
          </div>
        </div>
      </div>
    )
  }
}
