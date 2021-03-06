// default config file for PC.
var path = require("path");
var webpack = require("webpack");
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var fs = require("fs");

module.exports = function makeWebpackConfig(options) {
    var BUILD = !!options.BUILD;
    var TEST = !!options.TEST;

    var config = {
        context: path.join(__dirname, "./src/js"),
        entry: TEST ? {} : {
            sign: './pages/sign.js',
            'reset-password': './pages/reset-password.js',
            cart: './pages/cart.js',
            me: './pages/me.js',
            index: './pages/index.js',
            cook: './pages/cook.js',
            'cook-list': './pages/cook-list.js',
            eat: './pages/eat.js',
            'eat-list': './pages/eat-list.js',
            '404': './pages/404.js',
            'why-us': './pages/why-us.js',
            'pay-notify': './pages/pay-notify.js'
        },
        output: TEST ? {} : {
            path: path.join(__dirname, "./dist/"),
            publicPath: BUILD ? '' : '/webpackdevserver/pc/dist/',
            filename: BUILD ? '[name].[chunkhash].js' : '[name].js',
            chunkFilename: BUILD ? "[id].[chunkhash].js" : "[id].js"
        },
        devtool: BUILD ? '' : TEST ? 'inline-source-map' : 'source-map',
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /node_modules|errcode\.js/,
                    query: {
                        presets: ['react', 'es2015', 'stage-2']
                    }
                },
                {
                    test: /\.scss/,
                    loader: TEST ? 'null' :
                        ExtractTextPlugin.extract('style', 'css?sourceMap!postcss!sass?sourceMap')
                },
                {
                    test: /\.(?:png|jpg)$/, loader: 'file-loader'
                },
                {
                    test: /\.json$/,
                    loader: 'json'
                }
            ]
        },
        resolve: {
            // you can now require('file') instead of require('file.coffee')
            extensions: ["", '.js']
            //root: [path.join(__dirname, "./app/public/components")]
        },
        plugins: [
            new webpack.DefinePlugin({
                __DEV__: BUILD ? 'false' : 'true',
                __TODO__: BUILD ? '' : 'console.warn("todo: to be completed")',
                __PCPREFIX__: BUILD ? "''" : "'/pc'",

                // http://facebook.github.io/react/downloads.html#npm
                NODE_ENV: BUILD ? 'production' : 'development'
            }),
            new ExtractTextPlugin(BUILD ? "[name].[contenthash].css" : "[name].css", {
                disabled: TEST
            })
        ],
        devServer : {
            contentBase: 'src/',
            proxy: {
                '/pc/dist/*': {
                    target: 'http://localhost:8082/webpackdevserver/',
                    secure: false
                },
                '/*': {
                    target: 'http://localhost:3003/',
                    secure: false
                }

            }
        },

        postcss: function () {
            return [autoprefixer({browsers: ['last 3 versions', '> 3% in CN']})]
        }
    }

    if (!TEST) {
        config.plugins.push(
            new webpack.optimize.CommonsChunkPlugin({
                name: 'webpack-common',
                filename: BUILD ? 'webpack-common.[chunkhash].js' : 'webpack-common.js'
            })
        )
    }

    if (BUILD) {
        config.plugins.push(
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin({
                    comments: false
                }
            )
        )
    }

    return config;
}