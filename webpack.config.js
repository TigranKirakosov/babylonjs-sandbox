const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: ['@babel/polyfill', './src/index.ts'],
    devtool: 'inline-source-map',
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'bundle.[hash].js'
    },
    module: {
        rules: [
        {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        },
        {
            test: /\.css/,
            resolve: {
            extensions: ['.css']
            },
            use: [
            'style-loader',
            MiniCssExtractPlugin.loader,
            'css-loader'
            ]
        },
        {
            test: /\.(png|jpe?g|gif|svg|ico)$/i,
            loader: 'file-loader',
            options: {
            name: '[name].[ext]'
            }
        }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new MiniCssExtractPlugin({
            filename: 'style.[hash].css',
            path: path.resolve(__dirname, '/dist')
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, '/dist'),
        compress: true,
        progress: true,
        port: 4499,
        open: true,
        historyApiFallback: true,
        stats: 'minimal'
    }
};
