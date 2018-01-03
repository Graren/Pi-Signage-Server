const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')
console.log(path.join(__dirname, 'dist'))
const config = {
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    'react-hot-loader/patch',
    'babel-polyfill',
    './src/index.js'
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.(s(as|cs)s)$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader'
            },
            {
              loader: 'sass-loader'
            }
          ],
          fallback: 'style-loader'
        })
      },
      {
        test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/', // where the fonts will go
              publicPath: '/' // override the default path
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        // use: ['babel-loader', 'eslint-loader']
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.css']
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.SourceMapDevToolPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    publicPath: '/',
    historyApiFallback: true,
    hot: true
  }
}

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({ sourceMap: true }),
    new ExtractTextPlugin({
      filename: 'bundle.css',
      disable: false
    }),
    new webpack.optimize.AggressiveMergingPlugin({
      minSizeReduce: 1,
      moveToParents: true
    })
  )
} else {
  config.plugins.push(new ExtractTextPlugin({ disable: true }))
  config.output.devtoolModuleFilenameTemplate = function (info) {
    return 'file:///' + encodeURI(info.absoluteResourcePath)
  }
  config.output.devtoolFallbackModuleFilenameTemplate = function (info) {
    return 'file:///' + encodeURI(info.absoluteResourcePath) + '?' + info.hash
  }
}

module.exports = config
