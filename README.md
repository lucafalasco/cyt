# 54705h1n37

54705h1n37 is a real time visualization of Bitcoin transactions all over the world.

Data is retrieved and sent to the application through the blockchain.info [WebSocket API](https://blockchain.info/api/api_websocket).

Transactions are represented with circles, the bigger the circle, the larger the amount of bitcoin exchanged.

Hovering / clicking on the circle gives more information about the transaction.

The project is built with React and MobX, and bootstrapped with Accurapp.
D3 is used for SVG manipulation and transitions.

## Install dependencies:

```sh
yarn
```

## Start development server:

```sh
yarn start
```
head to http://localhost:8000/ to see the app running


## Build for production:

```sh
yarn build
```
Bundled files can be found in `build/`


## Resources
* [BlockChain.info](https://blockchain.info/)
* [React](https://facebook.github.io/react/)
* [D3](https://d3js.org/)
* [MobX](https://github.com/mobxjs/mobx)
* [AccurApp](https://github.com/accurat/accurapp)
