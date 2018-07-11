import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import 'tachyons'
import state from './state'
import App from './containers/App'

import './middleware/index.js'
import './style.css'

ReactDOM.render(
  <Provider state={state}>
    <App />
  </Provider>,
  document.getElementById('root')
)
