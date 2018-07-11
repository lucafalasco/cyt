import { observable, action } from 'mobx'

class Store {
  @observable width = window.innerWidth
  @observable height = window.innerHeight
  @observable coinsData = []

  updateCoinsData = action(function (data) {
    this.coinsData = data
  })

  handleResize = action(function () {
    this.width = window.innerWidth
    this.height = window.innerHeight
  })
}

const state = new Store()

window.addEventListener('resize', () => state.handleResize())

export default state
