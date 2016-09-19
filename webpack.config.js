var autoprefixer = require('autoprefixer');
var path = require('path');

module.exports = {
  entry: './src/main.js',
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
    inline:true,
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
        exclude: /node_modules/,
        loader: 'babel',
        query:{
          presets: ['es2015','react']
        }
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
