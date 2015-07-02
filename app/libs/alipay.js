module.exports = function (req, res, next) {
    // parse
    if (req.url == '/api/orders/payment/alipay/mobile' && req.get('content-type') != 'application/x-www-form-urlencoded')
        req.headers['content-type'] = 'application/x-www-form-urlencoded';
    console.log("-----Alipay Body Parser----", req.headers['content-type']); // 打印 application/x-www-form-urlencoded
    next();
};
