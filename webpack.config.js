var HtmlWebpackPlugin = require('html-webpack-plugin');
var autoprefixer = require('autoprefixer-core');
var csswring = require('csswring');
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var config = {
    entry: ['webpack/hot/dev-server', './src/js/app.js'],
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].[hash].js',
        publicPath: '/'
    },
    eslint: {
        reporter: require("eslint-friendly-formatter"),
        // reporter: require("eslint/lib/formatters/stylish")
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loaders: ['react-hot', 'babel', 'eslint'],
            exclude: /node_modules/
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
            ],
            path: path.resolve(__dirname, './img'),
        }, {
            test: /\.json$/,
            loader: 'json'
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'body' // Inject all scripts into the body
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('dev')
            }
        })
    ],
    resolve: {
        root: [
            path.resolve('./src')
        ]
    },
    postcss: [autoprefixer, csswring],
    devtool: 'eval'
    // devtool: 'sourcemap'
};

module.exports = config;
