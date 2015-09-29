/**
 * Module dependencies.
 */


var Promise  = require ("bluebird");
var requestC = require('request');
var _       = require('lodash');




// 基本配置
var configYunpain = {
    text: "",
    mobile: "",
    //extend : 001,
    //uid : 10001,

    apikey: "4aba5d380c442c3729c1bbc5035527dd",

    url_sendSMS : "http://yunpian.com/v1/sms/send.json"

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
    var app = new yunpianSMS(arguments[0]);
    return app;
}





function yunpianSMS(config) {

    //default config
    this.config = _.assign ({}, configYunpain);
    if (typeof config === "object"){
        this.config = _.assign ({}, configYunpain, config)
    }

}







// 发短信 https://www.yunpian.com/api/sms.html

yunpianSMS.prototype.sendSMS = function (item, callback){
    var newSMS = {
        apikey : this.config.apikey,
        mobile : item.mobile || "sample mobile",
        text : item.text || "sample mobile"
    };


    //console.log("========== WeixinPay createUnifiedOrder:", newOrder);
    var opts = {
        method: 'POST',
        url: this.config.url_sendSMS,
        form: newSMS,
        timeout: 5000
    };

    requestC(opts, function(err, response, body){
        //console.log("========== yunpianSMS sendSMS error:", err);

        if (err) {
            return callback(err);
        }else{
            //console.log("========== yunpianSMS sendSMS body json:", json);
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
        }

    })
};




