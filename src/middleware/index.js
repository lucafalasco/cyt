import appState from '../state'

const WS_URI = 'wss://ws.blockchain.info/inv'
const websocket = new window.WebSocket(WS_URI)
const data = []

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

function onOpen(evt) {
  console.log('CONNECTED')
  websocket.send(JSON.stringify({ op: 'unconfirmed_sub' }))
}

function onClose(evt) {
  console.log('DISCONNECTED')
  websocket.close()
}

function onMessage(evt) {
  const json = JSON.parse(evt.data)
  const transactionData = {
    ip: json.x.relayed_by !== '127.0.0.1' ? json.x.relayed_by : '104.16.55.3', // if returned ip is localhost, then it's blockchain.info ip
    value: json.x.out.reduce(function (a, b) {
      return a + b.value / 1e8
    }, 0),
    size: json.x.size,
    hash: json.x.hash,
  }
  const url = '//freegeoip.net/json/' + transactionData.ip

  window
    .fetch(url)
    .then(function (response) {
      if (response.status >= 400) {
        throw new Error('Bad response from server')
      }
      return response.json()
    })
    .then(function (geoData) {
      const transaction = transactionData::addGeoData(geoData)
      if (data.length > 50) {
        data.shift()
      }
      data.push(transaction)
      appState.updateWsData(data)
      return geoData
    })
    .catch(errors => {
      console.error(errors)
    })
}

function onError(evt) {
  console.error('Error retrieving data: ', evt.data)
}

websocket.onopen = function (evt) {
  onOpen(evt)
}
websocket.onclose = function (evt) {
  onClose(evt)
}
websocket.onmessage = function (evt) {
  onMessage(evt)
}
websocket.onerror = function (evt) {
  onError(evt)
}
