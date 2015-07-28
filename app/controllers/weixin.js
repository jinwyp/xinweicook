var request = require('request');
var sha1 = require('sha1');

var appsecret = '5e21fb82b13330f462bcf4a008a3670c';
var appID = 'wx37a1323e488cef84';

var access_token = '';
var expires_in = 0;

var ticket = '';
var expires_in_ticket = 0

var noncestr = 'abcdefg';
var timestamp = 0;
var url = 'http://helloworld-mountainmoon.c9.io/'

var xinweiLocation = {
    longitude: 121.460625,
    latitude: 31.189426
}

exports.sayHello = function (req, res) {
    res.send('hello ykc');
};

exports.verifySignature = function (req, res) {
    console.log(req.query);
    res.send(req.query.echostr);
}

exports.getAccessToken = getAccessToken;

/**
 * 普通access_token(与网页授权access_token不同,见http://mp.weixin.qq.com/wiki/17/c0f37d5704f0b64713d5d2c37b468d75.html)
 * 无需用户授权,仅凭appid和secret来调用
 * cb的第二个参数为{expires_in:., access_token:.}
 */
function getAccessToken(cb) {
    if (access_token) {
        cb(null, {access_token: access_token});
        return;
    }
    request('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='
        + appID + '&secret=' + appsecret,
        function (err, res, body) {

            console.log('body:', body);

            body = JSON.parse(body);

            if (!err) {
                access_token = body.access_token;
                expires_in = body.expires_in;
                setTimeout(function () {
                    getAccessToken(function () {})
                }, expires_in - 360); // 离过期10分钟前重新获取
                cb(null, {
                    access_token: access_token,
                    expires_in: expires_in
                })
            } else cb(err)
        })
}

exports.getJsapiTicket = getJsapiTicket;

/**
 * 使用js sdk时要使用的凭证, 可对全部用户使用, 不与单个用户绑定.
 * @param token 使用getAccessToken获取对access_token
 * @param cb 第二个参数为{ticket: ., expires_in: .}
 */
function getJsapiTicket(token, cb) {
    if (ticket) {
        cb(null, {ticket: ticket});
        return;
    }
    request('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + token + '&type=jsapi',
        function (err, res, body) {

            console.log('body:', body);

            body = JSON.parse(body);

            if (!err) {
                ticket = body.ticket;
                expires_in_ticket = body.expires_in;
                setTimeout(function () {
                    getJsapiTicket(function () {})
                }, expires_in - 360); // 离过期10分钟前重新获取
                cb(null, {
                    ticket: ticket,
                    expires_in: expires_in_ticket
                })
            } else cb(err)
        })
}

function makeSignature (jsapi_ticket, noncestr, timestamp, url) {
    var sval = 'jsapi_ticket=' + jsapi_ticket
        + '&noncestr=' + noncestr
        + '&timestamp=' + timestamp
        + '&url=' + url;
    return sha1(sval);
}

function getSignature (cb) {
    getAccessToken(function (err, data) {
        if (!err) {
            getJsapiTicket(data.access_token, function (err, data) {
                if (!err) {
                    timestamp = Math.floor(Date.now() / 1000);
                    var url = req.protocal + '://' + req.hostname + ':' + req.port;
                    var signature = makeSignature(data.ticket, noncestr, timestamp, url);
                    cb(null, {signature: signature})
                } else cb(err);
            })
        }
    })
}


exports.getJsConfig = function getJsConfig (req, res) {
    getSignature(function (err, data) {
        if (err) {
            res.send(500);
            return;
        }
        res.json({
            appId: appID,
            timestamp: timestamp,
            nonceStr: noncestr,
            signature: data.signature,
            longitude: xinweiLocation.longitude,
            latitude: xinweiLocation.latitude
        })
    })
}
