import state from '../state'
import { tickerByAsset } from 'coinmarketcap'

const COINS = [
  {
    codeName: 'btc',
    fullName: 'bitcoin',
  },
  {
    codeName: 'ltc',
    fullName: 'litecoin',
  },
  {
    codeName: 'dash',
    fullName: 'dash',
  },
  {
    codeName: 'doge',
    fullName: 'dogecoin',
  },
]

const chains = COINS.map(coin => ({
  coin: coin.codeName,
  ws: new window.WebSocket(`wss://socket.blockcypher.com/v1/${coin.codeName}/main`),
}))

const converts = {}
const data = {}
COINS.forEach(coin => (data[coin.codeName] = []))

async function getConverts() {
  COINS.forEach(async coin => {
    const value = await tickerByAsset(coin.fullName, { convert: 'eur' })
    converts[coin.codeName] = value
  })
}

function addGeoData(data) {
  return {
    ...this,
    longitude: data.longitude,
    latitude: data.latitude,
    city: data.city,
    region: data.region_name,
    country: data.country_name,
    countryCode: data.country_code,
  }
}

async function onOpen(ws, evt) {
  console.log('CONNECTED')
  await getConverts()
  ws.send(JSON.stringify({ event: 'unconfirmed-tx' }))
}

function onClose(ws, evt) {
  console.log('DISCONNECTED')
  ws.close()
}

function onMessage(coin, evt) {
  const json = JSON.parse(evt.data)

  const relayedByIp = json.relayed_by ? json.relayed_by.split(':')[0] : '0.0.0.0'

  // if returned ip is localhost, then it's blockcypher ip
  const ip = relayedByIp !== '127.0.0.1' ? relayedByIp : '104.16.55.3'

  const amount = json.total / 1e8

  const transactionData = {
    ip,
    value: amount,
    valueUSD: converts[coin].price_usd * amount,
    size: json.size,
    hash: json.hash,
  }
  const url = '//freegeoip.net/json/' + transactionData.ip

  window
    .fetch(url)
    .then(response => {
      if (response.status >= 400) {
        throw new Error('Bad response from server')
      }
      return response.json()
    })
    .then(geoData => {
      const transaction = transactionData::addGeoData(geoData)
      if (data[coin].length > 50) {
        data[coin].shift()
      }
      data[coin].push(transaction)
      state.updateWsData(data)
      return geoData
    })
    .catch(errors => {
      console.error(errors)
    })
}

function onError(coin, evt) {
  console.error(`Error retrieving data for coin ${coin}: ${evt.data}`)
}

chains.forEach(chain => {
  chain.ws.onopen = evt => {
    onOpen(chain.ws, evt)
  }
  chain.ws.onclose = evt => {
    onClose(chain.ws, evt)
  }
  chain.ws.onmessage = evt => {
    onMessage(chain.coin, evt)
  }
  chain.ws.onerror = evt => {
    onError(chain.coin, evt)
  }
})
