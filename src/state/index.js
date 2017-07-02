import { observable, action } from 'mobx'

class Store {
  @observable width = window.innerWidth
  @observable height = window.innerHeight
  @observable wsData = []

  updateWsData = action(function (data) {
    this.wsData = data
  })
  handleResize = action(function () {
    this.width = window.innerWidth
    this.height = window.innerHeight
  })
}

const appState = new Store()

window.addEventListener('resize', () => appState.handleResize())

export default appState
