// var precss = require('precss');

module.exports = {
  entry: './main.js',
  output: {
    path: './',
    filename: 'index.js'
  },
  debug: true,
  devtool: 'source-map',
  devServer:{
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
    extensions: ['', '.js', '.jsx']
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
      }
    ]
  }
}
