var sha1 = require('sha1');
var md5     = require('MD5');
var request = require('request');
var xml2js  = require('xml2js');
var _       = require('lodash');











var configAlipay = {
    partner                                   : '2088111042213083', //合作身份者id，以2088开头的16位纯数字
    key                                       : 'iilt312jb1ijgct5ocpxiehw0yyodic0', //安全检验码，以数字和字母组成的32位字符
    seller_email                              : 'steve.ge@me.com', //卖家支付宝帐户 必填
    subject_prefix: '新味 xinweicook: ',


    cacert                                    : 'cacert.pem',//ca证书路径地址，用于curl中ssl校验 请保证cacert.pem文件在当前文件夹目录中
    transport                                 : 'http', //访问模式,根据自己的服务器是否支持ssl访问，若支持请选择https；若不支持请选择http
    input_charset                             : 'utf-8',//字符编码格式 目前支持 gbk 或 utf-8

    sign_type                                 : "MD5", //签名方式 不需修改

    notify_url: 'http://m.xinweicook.com/api/orders/payment/alipay/mobile',

    mobile_return_url: 'http://m.xinweicook.com/mobile/alipay/return',
    website_return_url: '/alipay/return',




    urlAlipayWebsite : 'https://mapi.alipay.com/gateway.do?',
    urlAlipayWap : 'http://wappaygw.alipay.com/service/rest.htm?',


    serviceAlipayWebsite_create_direct_pay_by_user : 'create_direct_pay_by_user',

    serviceAlipayWap_create_direct_pay_by_user : 'alipay.wap.create.direct.pay.by.user',



    create_direct_pay_by_user_return_url      : '/alipay/create_direct_pay_by_user/return_url',
    create_direct_pay_by_user_notify_url      : '/alipay/create_direct_pay_by_user/notify_url',
    refund_fastpay_by_platform_pwd_notify_url : '/alipay/refund_fastpay_by_platform_pwd/notify_url',
    create_partner_trade_by_buyer_notify_url  : '/aplipay/create_partner_trade_by_buyer/notify_url',
    create_partner_trade_by_buyer_return_url  : '/aplipay/create_partner_trade_by_buyer/return_url',

    trade_create_by_buyer_return_url : '/alipay/trade_create_by_buyer/return_url',
    trade_create_by_buyer_notify_url : '/alipay/trade_create_by_buyer/notify_url'
};


//var request_paramsWebsite = [
//    'service=create_direct_pay_by_user',
//    'partner=' + configAlipay.partner, '_input_charset=utf-8',
//    'notify_url=' + configAlipay.notify_url,
//    'return_url=' + configAlipay.return_url,
//    'out_trade_no=' + order_info.order_number,
//    'subject=' + configAlipay.subject_prefix + order_info.order_number,
//    'payment_type=1',
//    'seller_email=' + configAlipay.seller_email,
//    'total_fee=' + _.numberFormat(order_info.total, 2, '.', ''),
//    'show_url=' + base_url + '/order/' + order_info.order_number
//    // , 'extra_common_param=' + order_info.extra_common_param
//];
//var urlWebsite = configAlipay.urlAlipayWebsite + request_paramsWebsite.join("&") + '&sign_type=MD5&sign=' + alipay_sign(request_params);





/**
 * Expose `createApplication()`.
 */

exports = module.exports = createApplication;


/**
 * Create an express application.
 *
 * @return {Function}
 * @api public
 */

function createApplication() {
    var app = new aliPay(arguments[0]);
    return app;
}




function aliPay(config) {

    //default config
    this.config = configAlipay;
    if (typeof config === "object"){
        this.config = _.assign (configAlipay, config)
    }

}









/**
 * 对对象排序
 * @param obj 排序前的对象
 * return 排序后的对象
 */
function signSort(obj){
    var result = {};
    var keys = Object.keys(obj).sort();
    for (var i = 0; i < keys.length; i++){
        result[keys[i]] = obj[keys[i]];
    }
    return result;
}


/**
 * 除去对象中的空值和签名参数
 * @param obj 签名参对象
 * return 去掉空值与签名参数后的新签名参对象
 * 在请求参数列表中,除去 sign、sign_type 两个参数外,其他需要使用到的参数皆是要签名的参数。(个别接口中参数 sign_type 也需要参与签名。)
 */
function signFilter (obj){
    var result = {};

    for (var key in obj){
        if(key == 'sign' || key == 'sign_type' || obj[key] == ''){
            continue;
        }
        else{
            result[key] = obj[key];
        }
    }

    return signSort(result);
}




/**
 * 生成签名结果
 * @param obj 已排序要签名的数组
 * mysign 签名结果字符串
 */
function sign_md5(obj) {
    //把数组所有元素，按照“参数=参数值”的模式用“&”字符拼接成字符串
    var ls = '';
    for(var k in obj){
        ls = ls + k + '=' + obj[k] + '&';
    }
    ls = ls.substring(0, ls.length - 1);

    var mysign = "";

    var sign_type = configAlipay.sign_type;
    if(sign_type == "MD5"){
        mysign = md5( ls + configAlipay.key )
    }else{
        mysign = "";
    }
    return mysign;
}






aliPay.prototype.generateWapCreateDirectPayUrl = function (order) {

    var urlParams = {
        service : 'alipay.wap.create.direct.pay.by.user',
        partner : configAlipay.partner,
        _input_charset : 'utf-8',
        sign_type : 'MD5',

        notify_url : configAlipay.notify_url,
        return_url : configAlipay.mobile_return_url,

        out_trade_no : order.orderNumber,
        subject : order.dishHistory[0].dish.title.zh,
        total_fee : order.totalPrice,
        seller_id : configAlipay.partner,
        out_trade_no : order.orderNumber,

        payment_type : '1'
        //body : order.dishHistory[0].dish.title.zh

    };

    //除去待签名参数数组中的空值和签名参数
    var para_filter = signFilter(urlParams);

    //生成签名结果
    var mysign = sign_md5(para_filter);

    urlParams.sign = mysign;

    urlParams.fullurl = Object.keys(urlParams).map(function (key) {
        return key + "=" + encodeURIComponent(urlParams[key]);
    }).join("&");

    urlParams.fullurl = configAlipay.urlAlipayWebsite + urlParams.fullurl;

    return urlParams

};





exports.middleware = function (req, res, next) {

    if ( req.get('content-type') != 'application/x-www-form-urlencoded'){

        if (req.url == '/api/orders/payment/alipay/mobile' || req.url == '/api/orders/payment/alipay/notify/account') {
            console.log("-------------------- Alipay Body Parser ------------------------", req.headers['content-type']); // 打印 application/x-www-form-urlencoded; text/html; charset=utf-8
            req.headers['content-type'] = 'application/x-www-form-urlencoded';
        }

    }
    next();
};


var mid = function(req,res,next){
    // parse
    var buf = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk){ buf += chunk });
    req.on('end', function(){
        if(buf){
            try{
                var qs = require('querystring');
                var ob = qs.decode(buf);
                req.query = ob;
            }catch (err){
                console.log('taobao body parser fail!');
                console.log(err);
            }
        }
        next();
    });
};
