import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import 'tachyons'
import appState from './state'
import App from './containers/app'

import './middleware/index.js'
import './style.css'

ReactDOM.render(
  <Provider appState={appState}>
    <App />
  </Provider>,
  document.getElementById('root')
)
