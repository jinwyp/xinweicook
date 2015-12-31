// default config file for PC.
var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var fs = require("fs");

module.exports = function makeWebpackConfig(options) {
    var BUILD = !!options.BUILD;

    var config = {
        context: path.join(__dirname, "./app/public/pc/src/js"),
        entry: {
            sign: './pages/sign.js',
            cart: './pages/cart.js',
            me: './pages/me.js',
            common: './pages/common.js'
        },
        output: {
            path: path.join(__dirname, "./app/public/pc/dist/js"),
            publicPath: BUILD ? '' : 'http://localhost: 8081',
            filename: BUILD ? '[name].[hash].js' : '[name].bundle.js'
        },
        devtool: 'source-map',
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    query: {
                        presets: ['react', 'es2015', 'stage-2']
                    }
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
                __DEV__: BUILD ? 'true' : 'false',
                __PCPREFIX__: "'/pc'"
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'webpack-common',
                filename: 'webpack-common.[hash].js'
            })
        ],
        devServer : {
            // empty for now
        }
    }

    var commonFiles = ['cook.nunj', 'cook-list.nunj', 'eat-list.nunj', 'index.nunj']
    fs.readdirSync('./app/public/pc/src/html/').forEach(function (file) {
        // tmp for not react files
        if (commonFiles.indexOf(file) != -1) {
            config.plugins.push(new HtmlWebpackPlugin({
                chunks: ['webpack-common', 'common'],
                template: './app/public/pc/src/html/' + file,
                hash: BUILD // todo: duplicate?
            }))
        } else { // react files
            config.plugins.push(new HtmlWebpackPlugin({
                chunks: ['webpack-common', 'common', file.substr(0, file.indexOf('.'))],
                template: './app/public/pc/src/html/' + file,
                hash: BUILD
            }))
        }
    })

    if (BUILD) {
        config.plugins.push(new webpack.optimize.UglifyJsPlugin())
    }

    return config;
}

//// default config file for PC.
//var path = require("path");
//var webpack = require("webpack");
//
//var BUILD_DEV = JSON.parse(process.env.BUILD_DEV || 'true');
//
//// webpack.config.js
//module.exports = {
//    context: path.join(__dirname, "./app/public/pc/src/js"),
//    entry: {
//        sign: './pages/sign.js',
//        cart: './pages/cart.js',
//        me: './pages/me.js',
//        common: './pages/common.js'
//    },
//    output: {
//        path: path.join(__dirname, "./app/public/pc/dist/js"),
//        filename: '[name].js'
//    },
//    module: {
//        loaders: [
//            {
//                test: /\.js$/,
//                loader: 'babel-loader',
//                exclude: /node_modules/,
//                query: {
//                    presets: ['react', 'es2015', 'stage-2']
//                }
//            }
//        ]
//    },
//
//    resolve: {
//        // you can now require('file') instead of require('file.coffee')
//        extensions: ["", '.js']
//        //root: [path.join(__dirname, "./app/public/components")]
//    },
//
//    externals: {
//        // require("jquery") is external and available
//        //  on the global var jQuery
//        jquery: "jQuery"
//    },
//
//    plugins: [
//        //new webpack.ResolverPlugin(
//        //    new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
//        //),
//        new webpack.DefinePlugin({
//            __DEV__: BUILD_DEV,
//            __PCPREFIX__: "'/pc'"
//        })
//    ]
//};