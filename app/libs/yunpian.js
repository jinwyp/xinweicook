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

yunpianSMS.prototype.sendSMS = function (mobile, text, callback){

    var mobileReg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

    if (!mobileReg.test(mobile)){
        throw new Error ("Yunpian send SMS error, mobile number wrong !");
    }


    var newSMS = {
        apikey : this.config.apikey,
        mobile : mobile || "sample mobile",
        text : text || "sample text"
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
            console.log("========== yunpianSMS sendSMS body:", body);
            var result = {};

            try{
                result = JSON.parse(body);
            }catch (err){
                return  callback(err);
            }

            if(result.code === 0){
                // http://caibaojian.com/regexp-example.html
                var resultSimple = {
                    "code"   : 0,
                    "msg"    : "OK",
                    "result" : {
                        "count" : 1,   //成功发送的短信个数
                        "fee"   : 1,     //扣费条数，70个字一条，超出70个字时按每67字一条计
                        "sid"   : 1097   //短信id；多个号码时以该id+各手机号尾号后8位作为短信id,
                                         //（数据类型：64位整型，对应Java和C#的long，不可用int解析)
                    }
                };

                return callback(null, result);
            }else{
                return  callback(result);
            }
        }

    })
};




yunpianSMS.prototype.sendSMSAsync = Promise.promisify(yunpianSMS.prototype.sendSMS);





