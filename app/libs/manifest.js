/**
 * Created by jinwyp on 3/9/16.
 */



var _ = require('lodash');
var path = require('path');

module.exports = function(config) {

    var manifest;
    var prepend;

    var config = _.merge({
        manifest: 'public/rev-manifest.json',
        prepend: 'src',
        prependProduction: 'dist',
        debug: true
    }, config);


    try {
        manifest = require(path.resolve(process.cwd(), config.manifest));
    } catch(e) {
        manifest = {};
    }


    if ( config.debug ) {
        prepend = config.prepend;
    }else{
        prepend = config.prependProduction;
    }

    return function(req, res, next) {

        res.locals.rev = function(path) {
            return prepend.toString() + '/' + (manifest[path] || path);
        };

        next();
    };
};
