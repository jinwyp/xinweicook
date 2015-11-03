/**
 * Created by jinwyp on 11/3/15.
 */


var requestC = require('request');
var Promise = require("bluebird");
var _       = require('lodash');









var configBaiduMap = {
    ak: "hGHhGxXeioV00csas6otDPM0",  //baidu accesskey

    notify_url : "",

    url_DirectionAPI : "http://api.map.baidu.com/direction/v1?", // http://developer.baidu.com/map/index.php?title=webapi/direction-api
    url_DirectionAPI : "http://api.map.baidu.com/direction/v1/routematrix?", // http://developer.baidu.com/map/index.php?title=webapi/direction-api
    url_getUserOauthCode : "https://open.weixin.qq.com/connect/oauth2/authorize?" //第一步：用户同意授权，获取code  http://mp.weixin.qq.com/wiki/17/c0f37d5704f0b64713d5d2c37b468d75.html

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
    var app = new baiduMap(arguments[0]);
    return app;
}





function baiduMap(config) {

    //default config
    this.config =  _.assign ({}, configBaiduMap);
    if (typeof config === "object"){
        this.config = _.assign ({}, configBaiduMap, config)
    }

}







baiduMap.prototype.getDistance = function(query, callback){

    // URL范例 http://api.map.baidu.com/direction/v1?mode=driving&origin=清华大学&destination=北京大学&origin_region=北京&destination_region=北京&output=json&ak=E4805d16520de693a3fe707cdc962045

    if (typeof query.origin === 'undefined' || !query.origin){
        throw new Error('需要填写起点名称或经纬度');
    }

    if (typeof query.destination === 'undefined' || !query.destination){
        throw new Error('需要填写起点名称或经纬度');
    }

    if (typeof query.mode === 'undefined' || !query.mode){
        query.mode = 'walking';    //导航模式，包括：driving（驾车）、walking（步行）、transit（公交）
    }


    if (typeof query.mode === 'undefined' || !query.mode){
        query.mode = 'walking';    //导航模式，包括：driving（驾车）、walking（步行）、transit（公交）
    }


    //
    //// 使用gcj02坐标.
    //var destinations = req.query.destinations || '';
    ////var warehouse = warehouseCoords[req.query.warehouse || 'xinweioffice'] ;
    //var office = warehouseCoords.xinweioffice;
    //var chj1 = warehouseCoords.caohejing1;
    //
    //var ak = 'SwPFhM6Ari4IlyGW8Okcem2H';
    //
    //var params = 'origins=' + encodeURIComponent(office.lat + ',' + office.lng)
    //    + '|' + encodeURIComponent(chj1.lat + ',' + chj1.lng) +
    //    '&destinations=' + encodeURIComponent(destinations) +
    //    '&ak=' + ak +
    //    '&output=json&mode=walking&coord_type=gcj02&tactics=12';
    //var url = 'http://api.map.baidu.com/direction/v1/routematrix?' + params;
    //
    //console.log(url)
    //request(url, function(err, response, body) {
    //    if (err) {
    //        next(err)
    //    } else {
    //        try {
    //            res.json(JSON.parse(body));
    //        } catch (e) {
    //            next(e);
    //        }
    //    }
    //})
};

