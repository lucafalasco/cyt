# cryptiz

#### ⚠️ could be currently broken due to an [issue](https://github.com/blockcypher/explorer/issues/248) with BlockCypher WS API

cryptiz is a real time visualization of Bitcoin, Litecoin, Dash and Dogecoin transactions all over the world.

Data is retrieved and sent to the application through the BlockCypher [WebSocket API](https://blockcypher.github.io/documentation/#websocket_webhook).

Transactions are represented by color-coded ripples, the bigger the ripple, the larger the amount of coins exchanged.
Very large transactions are highlighted by a "gear-like" pattern.

Hovering / clicking on the ripple gives more information about the transaction.

The project is built with React and MobX.
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

* [BlockCypher](https://www.blockcypher.com/)
* [React](https://facebook.github.io/react/)
* [D3](https://d3js.org/)
* [MobX](https://github.com/mobxjs/mobx)
* [AccurApp](https://github.com/accurat/accurapp)
