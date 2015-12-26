// default config file for PC.
var path = require("path");
var webpack = require("webpack");

var BUILD_DEV = JSON.parse(process.env.BUILD_DEV || 'true');

// webpack.config.js
module.exports = {
    context: path.join(__dirname, "./app/public/pc/src/js"),
    entry: {
        sign: './pages/sign.js',
        cart: './pages/cart.js',
        me: './pages/me.js',
        common: './pages/common.js'
    },
    output: {
        path: path.join(__dirname, "./app/public/pc/dist/js"),
        filename: '[name].js'
    },
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

    externals: {
        // require("jquery") is external and available
        //  on the global var jQuery
        jquery: "jQuery"
    },

    plugins: [
        //new webpack.ResolverPlugin(
        //    new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        //),
        new webpack.DefinePlugin({
            __DEV__: BUILD_DEV,
            __PCPREFIX__: "'/pc'"
        })
    ]
};