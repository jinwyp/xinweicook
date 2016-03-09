/**
 * Created by jinwyp on 3/9/16.
 */



var _ = require('lodash');
var path = require('path');

module.exports = function(config) {

    var manifest;

    var config = _.merge({
        manifest: 'public/rev-manifest.json',
        prepend: ''
    }, config);


    try {
        manifest = require(path.resolve(process.cwd(), config.manifest));
    } catch(e) {
        manifest = {};
    }

    return function(req, res, next) {
        console.log(manifest)
        console.log(config.manifest)
        console.log(process.cwd())
        console.log(path.resolve(process.cwd(), config.manifest))


        res.locals.rev = function(path) {
            return config.prepend.toString() + '/' + (manifest[path] || path);
        };

        next();
    };
};
