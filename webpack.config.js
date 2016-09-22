var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var path = require('path');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:3333', // WebpackDevServer host and port
    'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
    './src/main.js' // Your appʼs entry point
  ],
  output: {
    path: './dist/',
    filename: 'index.js'
  },
  debug: true,
  devtool: 'source-map',
  devServer:{
    historyApiFallback: true,
    proxy: {
      '/api/*': {
        target: "http://localhost:5000",
        changeOrigin:true
      }
    },
    port: 3333
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    root: path.resolve('./src')
  },
  module:{
    loaders: [
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, 'src'),
        loaders: ['react-hot','babel-loader'],
      },
      {
        test:   /\.css$/,
        loader: "style-loader!css-loader?modules=true&localIdentName=[name]-[local]-[hash:base64:5]!postcss-loader?sourceMap=inline"
      }
    ]
  },
  postcss: function () {
      return [autoprefixer];
  }
}
