/**
 * Module dependencies.
 */

var sha1 = require('sha1');
var md5     = require('MD5');
var requestC = require('request');
var Promise = require("bluebird");
var xml2js  = require('xml2js');
var _       = require('lodash');



var util = {
    buildXML : function(json){
        var builder = new xml2js.Builder();
        return builder.buildObject(json);
    },
    parseXML : function(xml, fn){
        var parser = new xml2js.Parser({ trim:true, explicitArray:false, explicitRoot:false });
        parser.parseString(xml, fn);
    },
    generateNonceString2 : function(length){
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var maxPos = chars.length;
        var noceStr = "";
        for (var i = 0; i < (length || 32); i++) {
            noceStr += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return noceStr;
    },

    generateNonceString : function(len, type) {
        var chars, l, result, x, _i;
        len = len ? len : 16;
        type = type ? type : 'azAZ09';
        chars = {
            all: '~!@#$%^&*()_+=-[]\;/.,<>?:{}|0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz',
            azAZ09: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz',
            az09: '0123456789abcdefghiklmnopqrstuvwxyz',
            easy: '3478ABEFHKMNPQRSTWXTacdefghikmnpstwxy',
            num: '0123456789',
            en: 'ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'
        };
        chars = chars[type].split('');
        result = '';
        l = chars.length;
        for (x = _i = 0; 0 <= len ? _i < len : _i > len; x = 0 <= len ? ++_i : --_i) {
            result += chars[Math.floor(Math.random() * l)];
        }
        return result;
    }
};







var configWeiXinPay = {
    appid: "",  //公众账号ID
    mch_id: "", //商户号

    secret: "",
    key: "",

    notify_url : "",

    url_createUnifiedOrder : "https://api.mch.weixin.qq.com/pay/unifiedorder",
    url_getUserOauthCode : "https://open.weixin.qq.com/connect/oauth2/authorize?", //第一步：用户同意授权，获取code  http://mp.weixin.qq.com/wiki/17/c0f37d5704f0b64713d5d2c37b468d75.html
    url_getUserOpenId : "https://api.weixin.qq.com/sns/oauth2/access_token?", //第二步：通过code换取网页授权access_token
    url_getUserRefreshAccessToken : "https://api.weixin.qq.com/sns/oauth2/refresh_token?", //第三步：刷新access_token（如果需要）
    url_getUserInfo : "https://api.weixin.qq.com/cgi-bin/user/info?", //获取用户基本信息（包括UnionID机制） http://mp.weixin.qq.com/wiki/14/bb5031008f1494a59c6f71fa0f319c66.html
    url_getDeveloperAccessToken : "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&",
    url_getDeveloperTicket : "https://api.weixin.qq.com/cgi-bin/ticket/getticket?"


};



/**
 * Expose `createApplication()`.
 */

module.exports = createApplication;


/**
 * Create an express application.
 *
 * @return {Function}
 * @api public
 */

function createApplication() {
    var app = new weiXinPay(arguments[0]);
    return app;
}





function weiXinPay(config) {

    //default config
    this.config =  _.assign ({}, configWeiXinPay);
    if (typeof config === "object"){
        this.config = _.assign ({}, configWeiXinPay, config)
    }

}





weiXinPay.prototype.util = util;





// 统一下单 https://pay.weixin.qq.com/wiki/doc/api/app.php?chapter=9_1

weiXinPay.prototype.createUnifiedOrder = function (item, callback){
    var newOrder = {
        appid: this.config.appid,  //微信分配的公众账号ID
        mch_id: this.config.mch_id, //微信支付分配的商户号
        //device_info : "WEB", //终端设备号(门店号或收银设备ID)，注意：PC网页或公众号内支付请传"WEB"
        nonce_str: util.generateNonceString(),
        notify_url: item.notify_url || this.config.notify_url,

        out_trade_no: item.out_trade_no || "sample out_trade_no", //商户系统内部的订单号,32个字符内、可包含字母, 其他说明见商户订单号
        total_fee: item.total_fee || 10000,
        spbill_create_ip: item.ip || "192.168.1.1", //终端IP APP和网页支付提交用户端ip，Native支付填调用微信支付API的机器IP。

        trade_type: item.trade_type || 'JSAPI', // JSAPI，NATIVE，APP，WAP
        openid: item.openid || "", // trade_type=JSAPI，此参数必传，用户在商户appid下的唯一标识。下单前需要调用【网页授权获取用户信息】接口获取到用户的Openid
        //product_id : item.product_id || "sample product_id", // trade_type=NATIVE，此参数必传。此id为二维码中包含的商品ID，商户自行定义。

        body:  item.body || "sample body 商品描述" //商品描述 商品或支付单简要描述

        // 上面为必填 下面为选填
//        detail:  item.detail || "sample detail" , //商品详情 商品名称明细列表
//        attach: item.attach || "sample attach"  // 附加数据，在查询API和支付通知中原样返回，该字段主要用于商户携带订单的自定义数据
        //goods_tag : item.goods_tag, //商品标记，代金券或立减优惠功能的参数，说明详见代金券或立减优惠
        //fee_type : item.fee_type || "CNY" //符合ISO 4217标准的三位字母代码，默认人民币：CNY，其他值列表详见货币类型

    };
    newOrder.sign = this.sign (newOrder) ;

    //下面处理buildXML toString() 方法报错
    for(var key in newOrder){
        newOrder[key] = newOrder[key].toString();
    }

    //console.log("========== WeixinPay createUnifiedOrder:", newOrder);
    var opts = {
        method: 'POST',
        url: configWeiXinPay.url_createUnifiedOrder,
        body: util.buildXML(newOrder),
        timeout: 10000
    };

    requestC(opts, function(err, response, body){
        console.log("========== WeixinPay createUnifiedOrder error:", err);

        if (err) {
            logger.error('------------------ WeixinPay createUnifiedOrder Error: ', JSON.stringify(err));
           return callback(err);
        }else{
            xml2js.parseString(body, {trim: true, explicitArray: false, explicitRoot:false }, function (err, json) {
                console.log("========== WeixinPay createUnifiedOrder body json:", json);
                if(json && json.return_code === "SUCCESS" && json.result_code === "SUCCESS" && json.prepay_id ){
                    return callback(null, {
                        return_code: json.return_code,
                        return_msg: json.return_msg,
                        result_code: json.result_code,
                        trade_type: json.trade_type, //调用接口提交的交易类型，取值如下：JSAPI，NATIVE，APP，详细说明见参数规定
                        prepay_id: json.prepay_id,  //微信生成的预支付回话标识，用于后续接口调用中使用，该值有效期为2小时
                        code_url: json.code_url, //trade_type为NATIVE是有返回，可将该参数值生成二维码展示出来进行扫码支付
                        nonce_str: json.nonce_str,
                        sign: json.sign,
                        out_trade_no: newOrder.out_trade_no
                    });
                }else{
                    return  callback("WeixinPay invalid prepay_id and " + json.return_msg + " and " + json.err_code);
                }
            })
        }

    })
};







weiXinPay.prototype.getUserOauthUrl = function(redirectUrl, state){

    // URL范例 https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirect
    var url = configWeiXinPay.url_getUserOauthCode + 'appid=' + this.config.appid + '&redirect_uri=' + encodeURIComponent(redirectUrl) + '&response_type=code' + '&scope=snsapi_base' + '&state=' + encodeURIComponent(state) + '#wechat_redirect';
    //logger.error('Get User Oauth Code Url: ', url);
    return url
};




weiXinPay.prototype.getUserOpenId = function(code, callback){

    if (!code || code.length === 0){
        throw new Error ("Weixin Pay OpenId code format wrong,  code is null");
    }

    var url = configWeiXinPay.url_getUserOpenId + 'appid=' + this.config.appid + '&secret=' + this.config.secret + '&code=' + code + '&grant_type=authorization_code';

    var opts = {
        method: 'GET',
        url: url,
        timeout: 6000
    };

    //通过code换取网页授权access_token
    //文档 http://mp.weixin.qq.com/wiki/17/c0f37d5704f0b64713d5d2c37b468d75.html
    requestC(opts, function(err, response, body){
        if (err){
            logger.error("OpenID Failed Network error:", JSON.stringify(err));
            callback(err)
        }else{
            // 文档 http://mp.weixin.qq.com/wiki/17/c0f37d5704f0b64713d5d2c37b468d75.html?pass_ticket=6IvwAVhR%2FWeMtWuwTT9MV5GZXhHy0ore6FJqabCe%2BqU%3Dhttp://mp.weixin.qq.com/wiki/17/c0f37d5704f0b64713d5d2c37b468d75.html?pass_ticket=6IvwAVhR%2FWeMtWuwTT9MV5GZXhHy0ore6FJqabCe%2BqU%3D
//            logger.error ('-- WeixinPay user OpenID: ', body);
            var result = {};
            try {
                result = JSON.parse(body) ;
            } catch (err) {
                // handle error
                logger.error("OpenID Failed JSON Parse Error:", JSON.stringify(err));
                callback(err)
            }

            if (typeof result.errcode === 'undefined'){
                //logger.error("OpenID Success: " + body );
                callback(null, result)
            }else{
                logger.error("OpenID Failed, get errcode : " + body );
                callback(null, result)
            }
        }

    });

};







weiXinPay.prototype.getUserInfo = function(user, callback){

    if (typeof user.access_token === 'undefined' && !user.access_token ){
        throw new Error ("Weixin access_token wrong");
    }

    if (typeof user.openid === 'undefined' && !user.openid ){
        throw new Error ("Weixin OpenId wrong");
    }

    var url = configWeiXinPay.url_getUserInfo + 'access_token=' + user.access_token + '&openid=' + user.openid + '&lang=zh_CN';

    var opts = {
        method: 'GET',
        url: url,
        timeout: 6000
    };

    //通过 access_token 获取用户基本信息（包括UnionID机制）
    //文档 http://mp.weixin.qq.com/wiki/14/bb5031008f1494a59c6f71fa0f319c66.html

    requestC(opts, function(err, response, body){
        if (err){
            logger.error("UserInfo Failed Network error:", JSON.stringify(err));
            callback(err)

        }else{
            var result = {};
            try {
                result = JSON.parse(body) ;

            } catch (err) {
                // handle error
                logger.error("Weixin getUserInfo JSON Parse Error:", JSON.stringify(err));
                callback(err)
            }

            if (typeof result.errcode === 'undefined'){
                callback(null, result)
            }else{
                logger.error("Weixin getUserInfo error : " + body );
                callback(null, result)
            }

        }

    });

};

weiXinPay.prototype.getUserInfoAsync = Promise.promisify(weiXinPay.prototype.getUserInfo);











weiXinPay.prototype.sign2 = function(obj){
    var querystring = Object.keys(obj)
        .filter(function (key) {
            return obj[key] !== undefined && obj[key] !== '' && key !== 'sign';
        })
        .sort()
        .map(function (key) {
            return key + "=" + obj[key];
        })
        .join("&");

    querystring = querystring + "&key=" + this.config.key ;
    return md5( querystring ).toUpperCase();
};

weiXinPay.prototype.sign = function(obj){
    var str = Object.keys(obj).filter(function (key) {
        return obj[key] !== undefined && obj[key] !== '' && key !== 'sign';
    }).sort().map(function (key) {
        return key + "=" + obj[key];
    }).join("&");
    str = md5(str+"&key="+this.config.key).toUpperCase();
    console.log("========== WeixinPay key:",  this.config.key);
    return str;
}


weiXinPay.prototype.signSha1 = function(obj){
    var querystring = Object.keys(obj)
        .filter(function (key) {
            return obj[key] !== undefined && obj[key] !== '' && key !== 'sign';
        })
        .sort()
        .map(function (key) {
            return key + "=" + obj[key];
        })
        .join("&");

    querystring = 'jsapi_ticket=' + obj.jsapi_ticket
        + '&noncestr=' + obj.noncestr
        + '&timestamp=' + obj.timestamp
        + '&url=' + obj.url;

    return sha1( querystring );
};









weiXinPay.prototype.responseNotify = function(res, isSuccess){

    resSuccessObj= {
        return_code : "SUCCESS",
        return_msg : "OK"
    };
    resFailObj= {
        return_code : "FAIL",
        return_msg : ""
    };

    if (isSuccess){
        res.send ( util.buildXML( resSuccessObj ) );
    }else{
        res.send ( util.buildXML( resFailObj ) )
    }
};



createApplication.parserNotifyMiddleware = function (req, res, next) {

    if (req.get('content-type') === 'text/xml'){
        console.log("--------------------WeixinPay Body Parser------------------------", req.headers['content-type']); // 打印 text/xml

        if ('GET' == req.method || 'HEAD' == req.method) {
            return next();
        }

        var data = '';
        req.setEncoding('utf8');

        req.on('data', function(chunk) {
            data += chunk;
        });
        req.on('end', function() {
            req.rawBody = data;

            xml2js.parseString(data, {trim: true, explicitArray: false, explicitRoot:false }, function (err, json) {
                //console.log ('--------------- weixin notify err: ', err);
                //console.log ('--------------- weixin notify body: ', json);
                if (err){
                    next (err)
                }else{
                    req.body = json;
                    next();
                }
            })

        });
    }
};









weiXinPay.prototype.getDeveloperAccessToken = function( callback){

    var url = configWeiXinPay.url_getDeveloperAccessToken + 'appid=' + this.config.appid + '&secret=' + this.config.secret;

    var opts = {
        method: 'GET',
        url: url,
        timeout: 6000
    };

    requestC(opts, function(err, response, body){
        if (err){
            callback(err)
        }else{
            // 文档 http://mp.weixin.qq.com/wiki/15/54ce45d8d30b6bf6758f68d2e95bc627.html
            // {"access_token":"ACCESS_TOKEN","expires_in":7200}

            var result = {};
            try {
                result = JSON.parse(body) ;

            } catch (err) {
                // handle error
                logger.error("Weixin Developer AccessToken JSON Parse Error:", JSON.stringify(err));
                callback(err)
            }

            if (typeof result.errcode === 'undefined'){
                callback(null, result)
            }else{
                logger.error("Weixin Developer AccessToken error : " + body );
                callback(null, result)
            }
        }

    });

};

weiXinPay.prototype.getDeveloperAccessTokenAsync = Promise.promisify(weiXinPay.prototype.getDeveloperAccessToken);



weiXinPay.prototype.getDeveloperJsapiTicket = function(access_token, callback){

    // 文档 http://mp.weixin.qq.com/wiki/15/54ce45d8d30b6bf6758f68d2e95bc627.html
    // {"access_token":"ACCESS_TOKEN","expires_in":7200}

    if (typeof access_token === 'undefined' && !access_token) {

        throw new Error ("Weixin Developer access_token wrong");
    }

    // GET方式请求获得jsapi_ticket
    var options = {
        method: 'GET',
        url: configWeiXinPay.url_getDeveloperTicket + 'access_token=' + access_token + '&type=jsapi',
        timeout: 6000
    };


    requestC(options, function(err, response, body){
        //console.log(err)
        //console.log(body)

        if (err){
            callback(err)
        }else{
            var result = {};
            try {
                result = JSON.parse(body) ;

            } catch (err) {
                // handle error
                logger.error("Weixin Developer JsapiTicket JSON Parse Error:", JSON.stringify(err));
                callback(err)
            }

            if (typeof result.errcode === 'undefined' || result.errcode == 0){
                callback(null, result)
            }else{
                logger.error("Weixin Developer JsapiTicket error : " + body );
                callback(null, result)
            }
        }
    });



};

weiXinPay.prototype.getDeveloperJsapiTicketAsync = Promise.promisify(weiXinPay.prototype.getDeveloperJsapiTicket);












/*

// 支付结果通用通知
exports.notify = function (req, res){
    req.rawBody = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) {
        req.rawBody += chunk
    });
    req.on('end', function() {
        xml2js.parseString(req.rawBody, {
            trim: true,
            explicitArray: false
        }, function (err, json) {
            var return_code = 'FAIL';
            async.waterfall([
                function(callback){
                    if(json && json.xml && json.xml.result_code && json.xml.result_code == 'SUCCESS' && json.xml.sign == sign(json.xml)){
                        return_code = 'SUCCESS';
                        callback(null, json.xml.attach);
                    }else{
                        callback('FAIL');
                    }
                },
                function(order_number, callback){
                    models.OrderModel.Order.findOne({order_number: order_number, status: config.order_status[1]}, function(err, order){
                        if(order){
                            order.payment = {en: 'Wechat Pay', zh: '微信支付'};
                            order.status = config.order_status[2];
                            order.save(function(err, order_info){
                                if (!err) {
                                    mailgun_route.order_ready(order_info);
                                };
                                return callback(null, null);
                            })
                        }else{
                            callback(null, null);
                        }
                    })
                }
            ], function(err, result){
                var result = buildXml({
                    return_code: return_code
                });
                res.send(result);
            })
        })
    });
};

*/














/*


// 订单生成后 前端跳转
var getopenidUrl = exports.getopenidUrl = function(order_number){
    return 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+wxpay_config.appid+'&redirect_uri='+encodeURIComponent('http://www.xinweicook.com/wxpay/getopenid')+'&response_type=code&scope=snsapi_base&state='+order_number+'#wechat_redirect';
}

// 取 openid, 调用统一下单, 获得 prepay_id, 生成前端需要的 json, 跳转到支付页面
exports.getopenid = function (req, res){
    var code = req.query.code;
    var order_number = req.query.state;
    if(!code || code.length == 0){
        return res.redirect('/mobile/order/'+order_number);
    }
    var url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+wxpay_config.appid+'&secret='+wxpay_config.secret+'&code='+code+'&grant_type=authorization_code';
    var opts = {
        method: 'GET'
        , url: url
        , timeout: 3000
    }
    request(opts, function(err, resp, body){
        try {
            body = JSON.parse(body);
        }
        catch (e) {
            return res.redirect('/mobile/order/'+order_number);
        }
        var openid = body.openid;
        async.waterfall([
            function(callback){
                if(!openid||openid.length==0){
                    return callback("invalid openid");
                }
                models.OrderModel.Order.findOne({order_number: order_number}, function(err, order){
                    callback(err, order);
                })
            },
            function(order, callback){
                if(!order){
                    return callback("no order");
                }
                var item = {
                    order_number: order_number
                    , total: order.total
                    , ip: req.ip
                    , openid: openid
                }
                unifiedorder(item, function(err, item){
                    callback(err, item);
                })
            },
        ], function(err, item){
            if(err){
                console.error(err);
                return res.redirect('/mobile/order/'+order_number);
            }
            var data = {
                "appId" : wxpay_config.appid,
                "timeStamp": genTimestamp(),
                "nonceStr" : utils.random_str(),
                "package" : "prepay_id="+item.prepay_id,
                "signType" : "MD5"
            };
            console.log("wechat data");
            console.log(data);
            data.paySign = sign(data);
            data = {
                data: data,
                order_number: order_number,
                out_trade_no: item.out_trade_no
            };
            res.redirect('/wxpay/page?showwxpaytitle=1&data='+encodeURIComponent(JSON.stringify(data)));
        })
    })
}

// 支付页
exports.page = function (req, res){
    var data = {
        title: "新味 cook - 微信支付"
        , data: req.query.data
    }
    res.render('mobile/wxpay_page', data)
}

// 查询并跳转订单页
exports.check = function (req, res){
    var order_number = req.query.order_number;
    var out_trade_no = req.query.out_trade_no;
    async.waterfall([
        function(callback){
            orderquery(out_trade_no, callback)
        },
        function(trade_state, callback){
            models.OrderModel.Order.findOne({order_number: order_number, status: config.order_status[1]}, function(err, order){
                if(order){
                    order.payment = {en: 'Wechat Pay', zh: '微信支付'};
                    order.status = config.order_status[2];
                    order.save(function(err, order_info){
                        if (!err) {
                            mailgun_route.order_ready(order_info);
                        };
                        return callback(null, null);
                    })
                }else{
                    callback(null, null);
                }
            })
        }
    ], function(err, result){
        res.redirect("/mobile/order/"+order_number);
    })

}





// 查询订单
var orderquery = exports.orderquery = function (out_trade_no, callback){
    var obj = {
        appid: wxpay_config.appid
        , mch_id: wxpay_config.mch_id
        , nonce_str: utils.random_str()
        // , transaction_id: transaction_id
        , out_trade_no: out_trade_no
    };
    obj.sign = sign(obj);
    for(var key in obj){
        obj[key] = obj[key].toString();
    }
    var xml = buildXml(obj);
    var opts = {
        method: 'POST'
        , url: 'https://api.mch.weixin.qq.com/pay/orderquery'
        , body: xml
        , timeout: 3000
    }
    request(opts, function(err, resp, body){
        xml2js.parseString(body, {
            trim: true,
            explicitArray: false
        }, function (err, json) {
            if(json && json.xml && json.xml.trade_state && json.xml.trade_state == 'SUCCESS' && json.xml.sign == sign(json.xml)){
                callback(null, json.xml.trade_state);
            }else{
                callback("wechat pay failed");
            }
        })
    })
}
*/





