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

const state = new Store()

window.addEventListener('resize', () => state.handleResize())

export default state
