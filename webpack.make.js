// default config file for PC.
var path = require("path");
var webpack = require("webpack");
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require("xw-html-webpack-plugin");
var ExtractTextPlugin = require('extract-text-webpack-plugin');
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
            path: path.join(__dirname, "./app/public/pc/dist/"),
            publicPath: BUILD ? '' : 'http://localhost:8081/',
            filename: BUILD ? '[name].[hash].js' : '[name].js',
            chunkFilename: BUILD ? "[id].[hash].js" : "[id].js"
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
                },
                {
                    test: /\.scss/,
                    loader: ExtractTextPlugin.extract('style', 'css?sourceMap!postcss!sass?sourceMap')
                },
                {
                    test: /\.(?:png|jpg)$/, loader: 'file-loader'
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
                __PCPREFIX__: "'/pc'"
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'webpack-common',
                filename: BUILD ? 'webpack-common.[hash].js' : 'webpack-common.js'
            }),
            new ExtractTextPlugin(BUILD ? "[name].[contenthash].css" : "[name].css")
        ],
        devServer : {
            contentBase: 'app/public/pc/src'
        },
        postcss: function () {
            return [autoprefixer({browsers: ['last 3 versions', '> 3% in CN']})]
        }
    }

    //var commonFiles = ['cook.nunj', 'cook-list.nunj', 'eat-list.nunj', 'index.nunj']
    //fs.readdirSync('./app/public/pc/src/html/').forEach(function (file) {
    //    // tmp for not react files
    //    if (file.indexOf('includes') != -1) return
    //
    //    if (commonFiles.indexOf(file) != -1) {
    //        config.plugins.push(new HtmlWebpackPlugin({
    //            inject: true,
    //            plainString: true,
    //            chunks: ['webpack-common', 'common'],
    //            template: './app/public/pc/src/html/' + file
    //        }))
    //    } else { // react files
    //        config.plugins.push(new HtmlWebpackPlugin({
    //            inject: true,
    //            plainString: true,
    //            chunks: ['webpack-common', 'common', file.substr(0, file.indexOf('.'))],
    //            template: './app/public/pc/src/html/' + file
    //        }))
    //    }
    //})

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