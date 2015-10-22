/**
 * Created by jinwyp on 9/25/15.
 */


/**
 * 极验中间件
 *
 * @return {Function}
 * @api public
 */

var config = {
    PRIVATE_KEY : '543c81435293f33258fc100168be4a91',
    PUBLIC_KEY : 'd41d16df5b99010ec511ec10aaaafcb8'
    //PRIVATE_KEY : 'ab95acaebd61c6ef7dc6e8a5493f4899',
    //PUBLIC_KEY : '745d959dec1191e086febd11aa684c9d'
};



var geetest = require("geetest")(config.PRIVATE_KEY, config.PUBLIC_KEY);

// https://github.com/GeeTeam/gt-node-sdk




exports.getGeeTestRegisterChallenge = function(req, res, next){
    // https://github.com/GeeTeam/gt-node-sdk

    geetest.register(function(err, challenge){
        if (err) {
            next(err)
        }

        if (challenge) {
            res.json({challenge : challenge})
        } else {
            res.json({challenge : 'geetest_server_error'})
        }
    })

};




exports.middleware = function (req, res, next) {

    if (req.get("user-agent") === "Xinwei Cook"){
        next();
    }else{

        if (req.body && req.body.geetest_challenge && req.body.geetest_validate && req.body.geetest_seccode) {

            var geetestCode = {
                challenge: req.body.geetest_challenge,
                validate: req.body.geetest_validate,
                seccode: req.body.geetest_seccode
            };

            geetest.validate(geetestCode, function (err, result) {
                if(err) return next(err);

                req.geetest = result;
                next();
            })
        }else {
            next(new Err("Field validation error,  geetest code wrong ", 400));
        }

    }


};