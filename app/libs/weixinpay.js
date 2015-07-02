var util = require('./weixinutil');
var md5 = require('MD5');
var request = require('request');
var xml2js = require('xml2js');



// 基本配置
var wxpay_config = {
    appid: conf.weixinpay.appid,
    mch_id: conf.weixinpay.mch_id,
    secret: conf.weixinpay.secret,
    key: conf.weixinpay.key
};





// 签名
var sign = function(obj){
    var querystring = Object.keys(obj)
        .filter(function (key) {
            return obj[key] !== undefined && obj[key] !== '' && key !== 'sign';
        })
        .sort()
        .map(function (key) {
            return key + "=" + obj[key];
        })
        .join("&");

    querystring = querystring + "&key=" + wxpay_config.key ;

    return md5( querystring ).toUpperCase();
};





// 统一下单 https://pay.weixin.qq.com/wiki/doc/api/app.php?chapter=9_1

exports.createUnifiedOrder = function (item, callback){

    var newOrder = {
        appid: wxpay_config.appid,
        mch_id: wxpay_config.mch_id,
        //device_info : "WEB",
        nonce_str: util.generateNonceString(),

        out_trade_no: item.out_trade_no,
        total_fee: item.total_fee || 1,
        spbill_create_ip: item.ip || "192.168.1.1", //终端IP APP和网页支付提交用户端ip，Native支付填调用微信支付API的机器IP。
        notify_url: item.weixin_notify_url || "http://www.xinweicook.com/wxpay/notify",
        trade_type: item.trade_type || 'NATIVE', //JSAPI，NATIVE，APP，WAP
        openid: item.openid || "", //trade_type=JSAPI，此参数必传，用户在商户appid下的唯一标识。下单前需要调用【网页授权获取用户信息】接口获取到用户的Openid
        product_id : item.product_id, //trade_type=NATIVE，此参数必传。此id为二维码中包含的商品ID，商户自行定义。

        body:  item.body, //商品描述
        detail:  item.detail, //商品详情

        attach: item.attach, //附加数据，在查询API和支付通知中原样返回，该字段主要用于商户携带订单的自定义数据
        goods_tag : item.goods_tag, //商品标记，代金券或立减优惠功能的参数，说明详见代金券或立减优惠
        fee_type : item.fee_type || "CNY" //符合ISO 4217标准的三位字母代码，默认人民币：CNY，其他值列表详见货币类型

    };
    newOrder.sign = sign (newOrder) ;

    for(var key in newOrder){
        console.log(key);
        newOrder[key] = newOrder[key].toString();
    }
    var opts = {
        method: 'POST',
        url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
        body: util.buildXML(newOrder),
        timeout: 3000
    };

    request(opts, function(err, response, body){
        console.log("---------:", err);
        console.log("---------:", response.statusCode);
        console.log("---------:", body);

        if (err) {
           return callback(err);
        }else{
            xml2js.parseString(body, {trim: true, explicitArray: false, explicitRoot:false }, function (err, json) {
                console.log("---------:", json);
                if(json && json.xml && json.xml.prepay_id && json.xml.sign == sign(json.xml)){
                    return callback(null, {
                        prepay_id: json.xml.prepay_id,
                        out_trade_no: out_trade_no
                    });
                }else{
                    return  callback("invalid prepay_id");
                }
            })
        }

    })
};
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
