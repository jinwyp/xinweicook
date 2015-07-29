module.exports = function (req, res, next) {
    // parse
    console.log("--------------------Alipay Body Parser------------------------", req.headers['content-type']); // 打印 application/x-www-form-urlencoded; text/html; charset=utf-8

    if (req.url == '/api/orders/payment/alipay/mobile' && req.get('content-type') != 'application/x-www-form-urlencoded')
        req.headers['content-type'] = 'application/x-www-form-urlencoded';

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


var a = {
    paymentWeixinpay : {
        code_url   : undefined,
        prepay_id  : 'wx201507291424493fb57c4ff60654415824',
        trade_type : 'JSAPI',
        sign       : 'DB50748CB01423AEA8DDF55AD5748BA7',
        nonce_str  : 'CglcZsmsAURjlVON',
        mobileSign : {
            paySign   : 'ED4613F35255A22C600CF789A4373EB4',
            signType  : 'MD5',
            package   : 'prepay_id=wx201507291424493fb57c4ff60654415824',
            nonceStr  : 'CglcZsmsAURjlVON',
            timeStamp : '1438151090',
            appId     : 'wx37a1323e488cef84'
        },
        nativeSign : {
            sign         : '713E9FD6880B523961A3ABB1D8878D1C',
            timeStamp    : '1438151090',
            nonceStr     : 'CglcZsmsAURjlVON',
            packageValue : 'Sign=WXPay',
            prepayId     : 'wx201507291424493fb57c4ff60654415824',
            partnerId    : '1260182401',
            appId        : 'wxc31508f4ded1402b'
        }
    }
}