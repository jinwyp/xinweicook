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

    sign_type                                 : "MD5",//签名方式 不需修改

    notify_url: 'http://m.xinweicook.com/api/orders/payment/alipay/mobile',

    mobile_return_url: '/alipay/return',
    website_return_url: '/alipay/return',




    urlAlipayWebsite : 'https://mapi.alipay.com/gateway.do?',
    urlAlipayWap : 'http://wappaygw.alipay.com/service/rest.htm?',


    urlAlipayWebsite_create_direct_pay_by_user : 'https://mapi.alipay.com/gateway.do?',


    urlAlipayWap_create_direct_pay_by_user : 'http://wappaygw.alipay.com/service/rest.htm?',



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




// 签名
// 在请求参数列表中,除去 sign、sign_type 两个参数外,其他需要使用到的参数皆是要签名的参数。(个别接口中参数 sign_type 也需要参与签名。)
function alipay_sign(params) {
    return md5( params.sort().join('&') + configAlipay.key )
}







exports.generateWapCreateDirectPayUrl = function (order) {

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

        payment_type : '1',
        body : order.dishHistory[0].dish.title.zh

    };


    //var request_paramsWap = [
    //    'service=alipay.wap.trade.create.direct',
    //    'format=xml',
    //    'v=2.0',
    //    'partner=' + configAlipay.partner,
    //    'req_id=' + order.order_number,
    //    'sec_id=MD5',
    //    'req_data='+
    //    '<direct_trade_create_req>'+
    //    '<subject>' + order.order_number +'</subject>'+
    //    '<out_trade_no>' + order.order_number +'</out_trade_no>'+
    //    '<total_fee>' + _.numberFormat(order.total, 2, '.', '') + '</total_fee>'
    //    +   '<seller_account_name>' + configAlipay.seller_email + '</seller_account_name>'
    //    +   '<call_back_url>' + configAlipay.mobile_call_back_url + '</call_back_url>'
    //    +   '<notify_url>' + configAlipay.mobile_notify_url + '</notify_url>'
    //    +   '<out_user>' + order.order_user + '</out_user>'
    //    +   '<merchant_url>' + base_url + '/mobile/order/' + order.order_number + '</merchant_url>'
    //    + '</direct_trade_create_req>'
    //];
    //var url = configAlipay.mobile_gateway + request_paramsWap.join("&") + '&sign=' + alipay_sign(request_params);
    //
    //return url

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
            }catch (e){
                console.log('taobao body parser fail!');
                console.log(e);
            }
        }
        next();
    });
};
