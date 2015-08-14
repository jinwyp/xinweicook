module.exports = function (req, res, next) {

    if (req.url == '/api/orders/payment/alipay/mobile' && req.get('content-type') != 'application/x-www-form-urlencoded'){

        console.log("-------------------- Alipay Body Parser ------------------------", req.headers['content-type']); // 打印 application/x-www-form-urlencoded; text/html; charset=utf-8
        req.headers['content-type'] = 'application/x-www-form-urlencoded';
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
