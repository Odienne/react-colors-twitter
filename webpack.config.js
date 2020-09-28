const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
    mode: process.env.NODE_ENV,
    resolve: {
        modules: [path.resolve(__dirname), 'node_modules']
    },
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.[hash].js',
        publicPath: '/'
    },
    devServer: {
        historyApiFallback: true,
        host: '0.0.0.0',
        writeToDisk: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            inject: 'body'
        })
    ],
    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader?modules&importLoaders=true&localIdentName=[path]___[name]__[local]___[hash:base64:5]']
            }
        ]
    }
};

module.exports = config;
