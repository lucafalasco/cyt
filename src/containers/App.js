import React from 'react'
import PropTypes from 'prop-types'
import ReactTransitionGroup from 'react-addons-transition-group'
import { inject, observer } from 'mobx-react'
import { sortBy, map } from 'lodash'

import ReactTooltip from 'react-tooltip'
import { geoEquirectangular } from 'd3-geo'
import { scaleLinear } from 'd3-scale'
import { feature } from 'topojson-client'
import { ReactComponent as Octocat } from '../assets/octocat.svg'

import worldMap from '../lib/world-map.json'
import { COINS_COLORS } from '../constants'

import GeoPath from '../components/GeoPath'
import Circle from '../components/Circle'

const USDFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

@inject('state')
@observer
export default class App extends React.Component {
  static propTypes = {
    state: PropTypes.object,
  }

  state = {
    focusedTransaction: '',
  }

  handleHovering = hash => {
    this.setState({ focusedTransaction: hash })
  }

  render() {
    const { coinsData, width, height } = this.props.state
    const { focusedTransaction } = this.state

    const interactionIsActive = Boolean(focusedTransaction)

    const geojson = feature(worldMap, worldMap.objects.countries).features

    const projection = geoEquirectangular()
      .scale((width / 640) * 100)
      .translate([width / 2, height / 2])

    const maxUSD = 100000
    const radiusScale = scaleLinear()
      .domain([0, maxUSD])
      .range([5, 70])
      .clamp(true)

    const path = geojson.map((geoData, i) => (
      <GeoPath
        key={i}
        handleHovering={this.handleHovering}
        chartWidth={width}
        chartHeight={height}
        data={geoData}
        projection={projection}
        color="#FFF"
      />
    ))

    const ripples = map(coinsData, (data, coin) => {
      const transactionData = sortBy(data, d => d.value).reverse()
      return transactionData.map(({ hash, longitude, latitude, value, valueUSD }) => {
        return (
          <Circle
            key={hash}
            cx={projection([longitude, latitude])[0]}
            cy={projection([longitude, latitude])[1]}
            radius={radiusScale(valueUSD)}
            exceed={valueUSD > maxUSD}
            hash={hash}
            coin={coin}
            interactionIsActive={interactionIsActive}
            transparent={focusedTransaction === hash}
            onHover={this.handleHovering}
            color={COINS_COLORS[coin]}
          />
        )
      })
    })

    const tooltips = map(coinsData, (data, coin) => {
      const transactionData = sortBy(data, d => d.value).reverse()
      return transactionData.map(({ hash, ip, city, country, size, value, valueUSD }) => (
        <ReactTooltip
          class="tooltip" key={hash} id={hash} type="dark" effect="float"
          place="left">
          <div style={{ color: COINS_COLORS[coin] }}>
            <div>
              <b>Hash:</b> {hash}
            </div>
            <div>
              <b>IP:</b> {ip}
            </div>
            <div>
              <b>Location: </b>
              {city ? `${city}, ` : ''}
              {country}
            </div>
            <div>
              <b>Size:</b> {size} byte
            </div>
            <div>
              <b>Amount:</b> {value} {coin.toUpperCase()}
            </div>
            <div>
              <b>USD:</b> {USDFormatter.format(valueUSD)}
            </div>
          </div>
        </ReactTooltip>
      ))
    })

    return (
      <div className="w-100 h-100 bg-black">
        <div className="w-100 h-100">
          <svg>
            <g className="map">{path}</g>
            <ReactTransitionGroup component="g" className="transactions">
              {ripples}
            </ReactTransitionGroup>
          </svg>
          <div>{tooltips}</div>
          <a
            href="https://github.com/lucafalasco/cyt"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Octocat fill="white" className="absolute top-1 left-1 w2 h2" />
          </a>
        </div>
      </div>
    )
  }
}
