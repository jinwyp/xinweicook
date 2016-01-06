/**
 * Created by jinwyp on 9/28/15.
 */


/**
 * Module dependencies.
 */


var md5     = require('MD5');
var requestC = require('request');
var Promise = require("bluebird");



// 状态: 待抢单(waitForConfirm) 待取件(waitForPick) 送件中(shipping) 已完成(finished) 已取消(canceled)


var configKsuDi = {
    //username: '13761339935',  //账号ID
    username: '15900634317',  //新账号ID
    //password: 'xwcook789', //密码
    password: 'e9a6a3f282d3b49e1a0061b06ace2296', //密码

    charset : 'utf-8',

    secret: "",
    key: "0d84a55290b37bfd3ba4623a5b5c22d6",


    //url_notify : "http://172.17.124.14:3003/api/administrator/order/delivery/ksudi/notify",
    url_notify : "http://m.xinweicook.com/api/administrator/order/delivery/ksudi/notify",


    url_createPartTimeOrder : "http://web.ksudi.com/shop/order/save/1",
    url_searchPartTimeOrder : "http://web.ksudi.com/shop/order/query/1",

    url_createFullTimeOrder : "http://web.ksudi.com/shop/order/save/2",
    url_searchFullTimeOrder : "http://web.ksudi.com/shop/order/query/3"

    //url_createPartTimeOrder : "http://www.ksudi.org/shop/order/save/1",

    //url_createPartTimeOrder : "http://192.168.1.72/shop/shop/order/save/1",
    //url_searchPartTimeOrder : "http://192.168.1.72/shop/shop/order/query/1"



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
    var app = new ksuDi(arguments[0]);
    return app;
}





function ksuDi(config) {

    //default config
    this.config = _.assign ({}, configKsuDi);
    if (typeof config === "object"){
        this.config = _.assign ({}, configKsuDi, config);
    }

}



ksuDi.prototype.sign = function(obj, flag){

    var signTarget = {};


    if (flag === 'fulltime'){
        signTarget = _.pick(obj, [
            'login_name',
            'ksudi_key',
            'time',
            'city_name',
            'customer_express_no',
            'is_urgent',

            'memo',
            'send_time',
            'send_name',
            'send_telephone',
            'send_address',
            'weight'

        ]);
    }else{

        signTarget = _.pick(obj, [
            'recaddrs',
            'username',
            'password',
            'charset',

            'expressnumber',
            'flag',
            'goodsInfo',
            'signtype',
            'actualcost',
            'sender',
            'sendtelephone',
            'sendaddress',
            'cityname',
            'citycode',
            'isadvance',
            'backurl'


        ]);
    }

    //console.log(signTarget);

    var querystring = Object.keys(signTarget)
        .filter(function (key) {
            return signTarget[key] !== undefined && signTarget[key] !== '' && key !== 'sign';
        })
        .sort()
        .map(function (key) {
            return key + "=" + signTarget[key];
        })
        .join("&");

    //console.log(querystring);
    return md5( querystring );
};







ksuDi.prototype.createPartTimeOrder = function (item, callback){
    var newOrder = {
        username : this.config.username,
        password : 'xwcook789',
        charset  : this.config.charset,
        signtype : 'MD5',
        //sign     : '',

        //recaddrs : item.address.contactPerson + '/' + item.address.mobile + '/' + item.address.province + ' ' + item.address.city + ' ' +  item.address.district + ' ' + item.address.street + ' ' + item.address.address,
        recaddrs : item.address.contactPerson + '/' + item.address.mobile + '/' + item.address.city + item.address.district + item.address.street.replace(/\//, '') + item.address.address.replace(/\//, ''),
        sender : '新味',
        sendtelephone : '15900634317', // 客服电话
        sendaddress : '徐汇区中山南二路510号3楼',

        expressnumber : item.orderNumber,

        //sendtime : moment(item.deliveryDateTime).format("YYYY-MM-DD HH:mm:ss"), //预约寄件时间
        //send_time : moment().unix(),
        //receivetime : moment(item.deliveryDateTime).format("YYYY-MM-DD HH:mm:ss"),
        //receive_time : moment().unix(),  //预约送件时间


        goodsInfo : item.dishHistory[0].dish.title.zh,
        actualcost : 0, //实际支付金额
        weight : 3,
        //order_remark : '',

        cityname : item.address.city,
        citycode : 'SHS',  //上海市 SHS 杭州市 HZS

        isadvance : 0,  //是否需要垫付
        //advancecost : 0,  // 垫付金额

        backurl : this.config.url_notify  // 回调url

    };

    if (typeof item.expressComment !== 'undefined' && item.expressComment != ''){
        newOrder.order_remark = item.expressComment;
    }

    newOrder.sign = this.sign(newOrder, '') ;

    var opts = {
        url: this.config.url_createPartTimeOrder,
        method: 'POST',
        form: newOrder
        //headers: {
        //    "content-type": "application/json"
        //},
        //body: JSON.stringify(newOrder),

        //timeout: 10000,
        //json : newOrder
    };


    requestC(opts, function(err, response, body){
        //console.log('========== KSudi', err);
        if (err) {
            //logger.error('------------------ WeixinPay createUnifiedOrder Error: ', JSON.stringify(err));
            return callback(err);
        }

        //console.log('========== KSudi', body);

        //logger.error('========== KSudi createOrder: ', body);
        var result = {};

        try{
            result = JSON.parse(body);
        }catch (error){
            return  callback(error);
        }

        if(result.code === 200 || result.code === '200'){

            // 300 接受订单成功
            // 400 确认收货成功
            // 500 订单完成
            // 600 保存订单成功
            return callback(null, result);
        }else{
            // 200 成功
            // 201 用户名或密码错误
            // 202 用户名或密码不能为空
            // 203 密钥错误
            // 204 该快递信息不存在
            // 205 发件地址不能解析！
            // 206 其他错误
            return  callback(result);
        }


    });
};

ksuDi.prototype.createPartTimeOrderAsync = Promise.promisify(ksuDi.prototype.createPartTimeOrder);








ksuDi.prototype.searchPartTimeOrder = function (item, callback){
    var newOrder = {
        username : this.config.username,
        password : this.config.password,
        charset  : this.config.charset,
        signtype : 'MD5',
        //sign     : '',
        flag : 0,
        expressnumber : item.orderNumber
        //expressnumber : '201510211430126337709'

    };

    //if (typeof item.express !== 'undefined' && item.express.number != ''){
    //    newOrder.runningnumber = item.express.number
    //}

    newOrder.sign = this.sign(newOrder, '') ;

    var opts = {
        url: this.config.url_searchPartTimeOrder,
        method: 'POST',
        form: newOrder
        //headers: {
        //    "content-type": "application/json"
        //},
        //body: JSON.stringify(newOrder),

        //timeout: 10000,
        //json : newOrder
    };


    requestC(opts, function(err, response, body){
        //console.log('========== KSudi', err);
        if (err) {
            return callback(err);
        }

        //console.log('========== KSudi', response);
        //console.log('========== KSudi', body);

        //logger.error('========== KSudi searchPartTimeOrder: ', body);

        var result = {};

        try{
            result = JSON.parse(body);

        }catch (error){
            return  callback(error);
        }


        if(result.code === 200 || result.code === '200' ){

            // 兼职系统状态
            // 300 接受订单成功
            // 400 确认收货成功
            // 500 订单完成

            // 300 待取件
            // 400 待签收
            // 500 已完成


            // 专职系统状态
            // 1401	待取件
            // 1402	派送中
            // 1403	已签收
            // 1404	取消
            // 1405	关单
            // 1406	待抢单
            // 1407	支付中

            return callback(null, result);
        }else{
            // 200 成功
            // 201 用户名或密码错误
            // 202 用户名或密码不能为空
            // 203 密钥错误
            // 204 该快递信息不存在
            // 205 快递信息不存在
            // 206 参数不能为空
            // 207 密钥错误

            return  callback(result);
        }

    });
};


ksuDi.prototype.searchPartTimeOrderAsync = Promise.promisify(ksuDi.prototype.searchPartTimeOrder);






















ksuDi.prototype.createFullTimeOrder = function (item, callback){

    var recieveAddress = {
        receive_name: item.address.contactPerson,
        receive_telephone: item.address.mobile,
        receive_address: item.address.city + item.address.district + item.address.street.replace(/\//, '') + item.address.address.replace(/\//, '')
    };

    var newOrder = {
        login_name : this.config.username,
        ksudi_key : this.config.key,

        is_urgent : 1, // 平台专人配送填"1"，快递公司配送填"2"

        express_addressee_list : [],
        send_name : '新味',
        send_telephone : '15900634317', // 客服电话
        send_address : '徐汇区中山南二路510号3楼',

        city_name : item.address.city,
        customer_express_no : item.orderNumber,

        time : moment().format("YYYY-MM-DD HH:mm:ss"), // 请求时间戳 19位的发送请求时间，格式为"yyyy-MM-dd HH:mm:ss"
        //send_time : moment(item.deliveryDateTime).format("YYYY-MM-DD HH:mm:ss"), //预约寄件时间 19位的预约快递员的取件时间，当前时间之后的2小时到72小时 之间，格式为"yyyy-MM-dd HH:mm"

        weight : 2

        //backurl : this.config.url_notify  // 回调url

    };

    //newOrder.express_addressee_list.push(recieveAddress);

    newOrder['express_addressee_list[0].receive_name'] = item.address.contactPerson;
    newOrder['express_addressee_list[0].receive_telephone'] = item.address.mobile;
    newOrder['express_addressee_list[0].receive_address'] = item.address.city + item.address.district + item.address.street.replace(/\//, '') + item.address.address.replace(/\//, '');


    if (typeof item.expressComment !== 'undefined' && item.expressComment != ''){
        newOrder.memo = item.expressComment;
    }

    newOrder.sign = this.sign(newOrder, 'fulltime') ;

    var opts = {
        url: this.config.url_createFullTimeOrder,
        method: 'POST',
        form: newOrder
        //'proxy':'http://localhost:8899/'
        //headers: {
        //    "content-type": "application/json"
        //},
        //body: JSON.stringify(newOrder),

        //timeout: 5000,
        //json : newOrder
    };

    //console.log(newOrder);

    requestC(opts, function(err, response, body){
        //console.log('========== KSudi', err);
        if (err) {
            //logger.error('------------------ WeixinPay createUnifiedOrder Error: ', JSON.stringify(err));
            return callback(err);
        }

        console.log('========== KSudi', body);

        //logger.error('========== KSudi createOrder: ', body);
        var result = {};

        try{
            result = JSON.parse(body);
        }catch (error){
            return  callback(error);
        }

        //200 下单成功
        //401 请求错误-账户错误
        //402 请求错误-签名错误
        //403 请求错误-请求时间异常
        //404 请求错误-账户余额不足
        //411 请求错误-快件信息错误
        //421 请求错误-寄件信息错误
        //422 请求错误-寄件地址无法解析
        //423 请求错误-预约时间错误
        //431 请求错误-收件信息错误
        //432 请求错误-收件地址无法解析
        //433 请求错误-收件地址数量错误
        //400 请求错误-其他
        //500 系统繁忙

        if(result.code === 200){
            result.msg = '下单成功';
            return callback(null, result);
        }else{
            result.msg = '快速递专职下单失败';
            return  callback(result);
        }


    });
};

ksuDi.prototype.createFullTimeOrderAsync = Promise.promisify(ksuDi.prototype.createFullTimeOrder);


