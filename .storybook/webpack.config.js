const path = require('path');

module.exports = {
    output: {
        publicPath: "/img/"
    },
    node: {
        fs: "empty"
    },
    module: {
        loaders: [
            {
                test: /.scss$/,
                loaders: ["style", "css", "sass"],
                include: path.resolve(__dirname, '../')
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file?name=src/fonts/[name].[ext]'
            },
            {
                test: /\.html$/,
                loader: 'html-loader?attrs[]=video:src'
            },
            {
                test: /\.mp4$/,
                loader: 'url?limit=10000&mimetype=video/mp4'
            },
            {
                test: /\.(png|jpg|svg)$/,
                loader: 'file?name=[path]/[name].[ext]'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    }
}