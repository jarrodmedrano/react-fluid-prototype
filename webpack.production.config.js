var HtmlWebpackPlugin = require('html-webpack-plugin')
var autoprefixer      = require('autoprefixer-core');
var csswring          = require('csswring');
var webpack           = require('webpack');
var path              = require('path');
var fs                = require('fs');
var UnminifiedWebpackPlugin = require('unminified-webpack-plugin');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var nodeExternals = require('webpack-node-externals');

var config = {
  entry: './src/js/app.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].[hash].js'
  },
    externals: [nodeExternals({
        // this WILL include `jquery` and `webpack/hot/dev-server` in the bundle, as well as `lodash/*`
    })],
  module: {
    preLoaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'eslint'
    }],
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel?presets[]=es2015,presets[]=stage-2,presets[]=react,plugins[]=transform-object-rest-spread',
    }, {
      test: /\.scss$/,
      loader: 'style!css!postcss!sass'
    }, {
      test: /\.woff$|\.ttf$|\.wav$|\.mp3$/,
      loader: 'file'
    }, {
      test: /\.jpe?g$|\.gif$|\.png$|\.svg$/,
      loaders: [
        'url?limit=8192&hash=sha512&digest=hex&name=[hash].[ext]',
        'image?bypassOnDebug&optimizationLevel=7&interlaced=false'
      ]
    }, {
        test: /\.json$/,
        loader: 'json'
    }
    , {
        test: /\.html$/,
        loader: 'html-loader?attrs[]=video:src'
    }, {
        test: /\.mp4$/,
        loader: 'url?limit=10000&mimetype=video/mp4'
    }]
  },
  postcss: [autoprefixer, csswring],
  plugins: [

    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'body' // Inject all scripts into the body
    }),
    // removes a lot of debugging code in React
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),

    // keeps hashes consistent between compilations
    new webpack.optimize.OccurenceOrderPlugin(),
     new CommonsChunkPlugin({
          name: 'vendors',
     }),

    // minifies your code
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new UnminifiedWebpackPlugin()
  ]
    ,
    resolve: {
        root: [
            path.resolve('./src')
        ]
    },
};

module.exports = config;
