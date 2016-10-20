var HtmlWebpackPlugin = require('html-webpack-plugin');
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
            loaders: ['react-hot', 'babel?presets[]=es2015,presets[]=stage-2,presets[]=react,plugins[]=transform-object-rest-spread', 'eslint'],
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
        }, {
            test: /\.html$/,
            loader: 'html-loader?attrs[]=video:src'
        }, {
            test: /\.mp4$/,
            loader: 'url?limit=10000&mimetype=video/mp4'
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
    postcss: [csswring],
    devtool: 'eval',
    devServer: {
        port: 3000,
        historyApiFallback: true
    }
    // devtool: 'sourcemap'
};

module.exports = config;