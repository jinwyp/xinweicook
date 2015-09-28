/**
 * Created by jinwyp on 9/28/15.
 */


/**
 * Module dependencies.
 */


var md5     = require('MD5');
var requestC = require('request');







var configKsuDi = {
    username: '13761339935',  //公众账号ID
    password: 'xwcook789', //商户号

    charset : 'utf-8',

    secret: "",
    key: "",


    url_createOrder : "http://www.ksudi.org/shop/shop/order/save/1"


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

    //querystring = querystring + "&key=" + this.config.key ;
    return md5( querystring );
};







ksuDi.prototype.createOrder = function (item, callback){
    var newOrder = {
        username : this.config.username,
        password : this.config.password,
        charset  : this.config.charset,
        signtype : 'MD5',
        //sign     : '',

        rec_addrs : item.address.contactPerson + '/' + item.address.mobile + '/' + item.address.province + '/' + item.address.city + '/' +  item.address.district + '/' + item.address.street + '/' + item.address.address,
        sender : item.address.contactPerson,
        sendtelephone : item.address.mobile,

        //expressnumber : item.expressnumber,
        sendtelephone : item.address.mobile,
        sendtime : moment().format("YYYY-MM-DD HH:mm:ss"),
        receivetime : moment(item.deliveryDateTime).format("YYYY-MM-DD HH:mm:ss"),


        goodsInfo : item.dishHistory[0].dish.title.zh,
        actualcost : '', //实际支付金额
        weight : '',
        order_remark : '',

        cityname : 'item.address.city',
        citycode : 'SHS',  //上海市 SHS 杭州市 HZS

        isadvance : 0,  //是否需要垫付
        //advancecost : 0,  // 垫付金额

        backurl : 'http://m.xinweicook.com/api/orders/delivery/ksudi/notify'  // 回调url



    };


    newOrder.sign = this.sign(newOrder) ;

    console.log(newOrder);

    var opts = {
        url: this.config.url_createOrder,
        method: 'POST',
        ok: newOrder,
        timeout: 10000,
        json : true
    };

    console.log(opts);

    requestC(opts, function(err, response, body){
        console.log('========== KSudi', err);
        if (err) {
            //logger.error('------------------ WeixinPay createUnifiedOrder Error: ', JSON.stringify(err));
            return callback(err);
        }

        console.log('========== KSudi', body);
        //console.log('========== KSudi', response);
        if(body.code === 200 ){
            return callback(null, body);
        }else{

            // 201 用户名或密码错误
            // 202 用户名或密码不能为空
            // 203 密钥错误
            // 204 该快递信息不存在
            // 205 发件地址不能解析！
            // 206 其他错误

            return  callback(body.code);
        }



    })
};


