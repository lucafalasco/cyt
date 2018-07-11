const { buildWebpackConfig } = require('webpack-preset-accurapp')
const { customConfig } = require('@webpack-blocks/webpack')

module.exports = buildWebpackConfig([
  customConfig({
    node: { fs: 'empty' },
  }),
])
