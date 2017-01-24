var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var postcssImport = require('postcss-import');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:3333', // WebpackDevServer host and port
    'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
    'whatwg-fetch',
    './src/main.js' // Your appʼs entry point
  ],
  output: {
    path: './dist/',
    filename: 'index.js'
  },
  plugins: [
    new HtmlWebpackPlugin({template:'./src/index.html'}),
    new webpack.LoaderOptionsPlugin({
      debug: true
    })
  ],
  devtool: 'cheap-module-inline-source-map',
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
    modules:[
      path.join(__dirname, './src'),
      "node_modules"
    ],
    extensions: ['.js', '.jsx','.css']
  },
  module:{
    rules: [
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, 'src'),
        use: ['react-hot-loader','babel-loader']
      },
      {
        test: /\.css$/,
        include: path.join(__dirname, 'node_modules'),
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test:   /\.css$/,
        exclude: path.join(__dirname, 'node_modules'),
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options:{
              sourceMap: true,
              modules:true,
              localIdentName:"[name]-[local]-[hash:base64:5]"
            }
          },
          {
            loader:"postcss-loader",
            options:{
              sourceMap:"inline"
            }
          }
        ]
      }
    ]
  }
}
