/**
 * Created by jinwyp on 9/28/15.
 */


/**
 * Module dependencies.
 */


var md5     = require('MD5');
var requestC = require('request');




// 状态: 待抢单(waitForConfirm) 待取件(waitForPick) 送件中(shipping) 已完成(finished) 已取消(canceled)


var configKsuDi = {
    username: '13761339935',  //账号ID
    //password: 'xwcook789', //密码
    password: 'e9a6a3f282d3b49e1a0061b06ace2296', //密码

    charset : 'utf-8',

    secret: "",
    key: "",


    //url_notify : "http://172.17.124.14:3003/api/administrator/order/delivery/ksudi/notify",
    url_notify : "http://m.xinweicook.com/api/administrator/order/delivery/ksudi/notify",


    url_createOrder : "http://web.ksudi.com/shop/order/save/1",
    url_searchOrder : "http://web.ksudi.com/shop/order/query/1"

    //url_createOrder : "http://www.ksudi.org/shop/order/save/1",

    //url_createOrder : "http://192.168.1.72/shop/shop/order/save/1",
    //url_searchOrder : "http://192.168.1.72/shop/shop/order/query/1"



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
        this.config = _.assign ({}, configKsuDi, config)
    }

}



ksuDi.prototype.sign = function(obj){

    var signTarget = _.pick(obj, [
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







ksuDi.prototype.createOrder = function (item, callback){
    var newOrder = {
        username : this.config.username,
        password : this.config.password,
        charset  : this.config.charset,
        signtype : 'MD5',
        //sign     : '',

        //recaddrs : item.address.contactPerson + '/' + item.address.mobile + '/' + item.address.province + ' ' + item.address.city + ' ' +  item.address.district + ' ' + item.address.street + ' ' + item.address.address,
        recaddrs : item.address.contactPerson + '/' + item.address.mobile + '/' + item.address.city + item.address.district + item.address.street + item.address.address,
        sender : '新味',
        sendtelephone : '13761339935', // 客服电话
        sendaddress : '徐汇区中山南二路510号3楼',

        expressnumber : item.orderNumber,

        //sendtime : moment(item.deliveryDateTime).format("YYYY-MM-DD HH:mm:ss"), //预约寄件时间
        //send_time : moment().unix(),
        //receivetime : moment(item.deliveryDateTime).format("YYYY-MM-DD HH:mm:ss"),
        //receive_time : moment().unix(),  //预约送件时间


        goodsInfo : item.dishHistory[0].dish.title.zh,
        actualcost : 0, //实际支付金额
        weight : 5,
        //order_remark : '',

        cityname : item.address.city,
        citycode : 'SHS',  //上海市 SHS 杭州市 HZS

        isadvance : 0,  //是否需要垫付
        //advancecost : 0,  // 垫付金额

        backurl : this.config.url_notify  // 回调url


    };

    if (typeof item.expressComment !== 'undefined' && item.expressComment != ''){
        newOrder.order_remark = item.expressComment
    }

    newOrder.sign = this.sign(newOrder) ;

    //console.log(newOrder);

    var opts = {
        url: this.config.url_createOrder,
        method: 'POST',
        form: newOrder
        //headers: {
        //    "content-type": "application/json"
        //},
        //body: JSON.stringify(newOrder),

        //timeout: 10000,
        //json : newOrder
    };

    //console.log(opts);

    requestC(opts, function(err, response, body){
        //console.log('========== KSudi', err);
        if (err) {
            //logger.error('------------------ WeixinPay createUnifiedOrder Error: ', JSON.stringify(err));
            return callback(err);
        }

        //console.log('========== KSudi', response);
        //console.log('========== KSudi', body);

        logger.error('========== KSudi createOrder: ', body);
        var result = {};

        try{
            result = JSON.parse(body);


            if(result.code === 200 || result.code === '200'){

                // 300 接受订单成功
                // 400 确认收货成功
                // 500 订单完成

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

        }catch (err){
            return  callback(err);
        }

    })
};






ksuDi.prototype.searchOrder = function (item, callback){
    var newOrder = {
        username : this.config.username,
        password : this.config.password,
        charset  : this.config.charset,
        signtype : 'MD5',
        //sign     : '',
        flag : 0,
        expressnumber : item.orderNumber
        //expressnumber : '201510191123322463939'

    };

    //if (typeof item.express !== 'undefined' && item.express.number != ''){
    //    newOrder.runningnumber = item.express.number
    //}

    newOrder.sign = this.sign(newOrder) ;

    //console.log(newOrder);

    var opts = {
        url: this.config.url_searchOrder,
        method: 'POST',
        form: newOrder
        //headers: {
        //    "content-type": "application/json"
        //},
        //body: JSON.stringify(newOrder),

        //timeout: 10000,
        //json : newOrder
    };

    //console.log(opts);

    requestC(opts, function(err, response, body){
        //console.log('========== KSudi', err);
        if (err) {
            return callback(err);
        }

        //console.log('========== KSudi', response);
        //console.log('========== KSudi', body);

        logger.error('========== KSudi searchOrder: ', body);

        var result = {};

        try{
            result = JSON.parse(body);

            if(result.code === 200 || result.code === '200' ){

                // 300 接受订单成功
                // 400 确认收货成功
                // 500 订单完成

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

        }catch (err){
            return  callback(err);
        }

    })
};
