const path = require('path')
const _externals = require('externals-dependencies')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: {
    app: './bin/www.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist', 'app'),
    filename: 'server.js'
  },
  resolve: {
    extensions: ['.js']
  },
  target: 'node',
  // 移除掉所有绝对路径的引用，只保留以.开头的，也就是相对路径的引用
  // externals: /^(?![.])./,
  externals: _externals(),
  context: __dirname,
  node: {
    console: true,
    global: true,
    process: true,
    Buffer: true,
    __filename: true,
    __dirname: true,
    setImmediate: true,
    path: true
  },
  module: {
    unknownContextCritical: false,
    rules: [
      {
        test: /\.js/,
        use: ['babel-loader'],
        exclude: [path.join(__dirname, 'node_modules')]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin([
      { from: 'app/views', to: './views' },
      { from: 'app/public', to: './public' },
      { from: 'start.sh', to: '..' }
    ])
  ]
}
