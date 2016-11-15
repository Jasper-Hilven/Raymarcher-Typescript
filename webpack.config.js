var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
//var Dashboard = require('webpack-dashboard');
//var DashboardPlugin = require('webpack-dashboard/plugin');
//var dashboard = new Dashboard();


module.exports = {
    quiet: true, // lets WebpackDashboard do its thing
    entry: ["./src/index.ts"],
    output: {
        path: __dirname + '/prod/',
        filename: "index.js"
    },
    devtool: 'source-map',
    devServer: {
        port: 8080,
        contentBase: './prod/'
    },
    resolve: {
        root: path.resolve('./src'),
        extensions: ['', '.ts', '.js']
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin(    {minimize: false, compress: { warnings: false }}),
        new HtmlWebpackPlugin(),
        //new DashboardPlugin(dashboard.setData)
new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }),
    ],
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.less$/, loader: "style!css!less" },
            { test: /\.json$/, loader: "json" },
            { test: /\.tsx?$/, loader: 'awesome-typescript-loader' }
        ]
    },
    node: {
    }
};
