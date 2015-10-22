// default config file for PC.
var path = require("path");
var webpack = require("webpack");

var BUILD_DEV = JSON.parse(process.env.BUILD_DEV || 'true');

var jsSrcDir = path.join(__dirname, "./public/pc/src/js-es6");
var jsDevBuildDir = path.join(__dirname, "./public/pc/src/js");
var jsProBuildDir = path.join(__dirname, "./public/pc/dist/js");

var jsBuildDir = jsProBuildDir;

if (BUILD_DEV) {
    jsBuildDir = jsDevBuildDir;
}

// webpack.config.js
module.exports = {
    context: jsSrcDir,
    entry: './main.js',
    output: {
        path: jsBuildDir,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel-loader', exclude: /(node_modules|bower_components)/}
        ]
    },

    resolve: {
        // you can now require('file') instead of require('file.coffee')
        extensions: ["", '.js'],
        root: [path.join(__dirname, "./public/components")]
    },

    plugins: [
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        ),
        new webpack.DefinePlugin({
            __DEV__: BUILD_DEV
        })
    ]
};