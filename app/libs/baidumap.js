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
    url_RouteMatrixAPI : "http://api.map.baidu.com/direction/v1/routematrix?", // http://developer.baidu.com/map/index.php?title=webapi/route-matrix-api
    url_placeAPISearch : "http://api.map.baidu.com/place/v2/search?", // http://developer.baidu.com/map/index.php?title=webapi/guide/webservice-placeapi
    url_placeSuggestionAPI: "http://api.map.baidu.com/place/v2/suggestion?" // http://developer.baidu.com/map/index.php?title=webapi/place-suggestion-api

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
        this.config = _.assign ({}, configBaiduMap, config);
    }

}





/**
 * Created by JinWYP on 15-11-04.
 * http://developer.baidu.com/map/index.php?title=webapi/route-matrix-api
 * Route Matrix API是一套以HTTP形式提供的批量线路查询接口，用于返回多个起点和多个终点间的线路距离和行驶时间
 * 起终点个数最多为5个，即每个请求串最多能查询25条线路信息；
 * 每个ak每天最多查询10万次
 */


baiduMap.prototype.getDistanceFromMultiPoint = function(query, callback){

    // URL范例 http://api.map.baidu.com/direction/v1?mode=driving&origin=清华大学&destination=北京大学&origin_region=北京&destination_region=北京&output=json&ak=E4805d16520de693a3fe707cdc962045

    var originParam = '';
    var destinationParam = '';

    if (typeof query.origins === 'undefined' || !query.origins || !Array.isArray(query.origins) ){
        throw new Error('需要填写起点名称或经纬度');
    }else if (Array.isArray(query.origins)) {
        query.origins.forEach(function(place){

            if (typeof place.lng === 'undefined' || !place.lng || typeof place.lat === 'undefined' || !place.lat){
                throw new Error('需要填写起点名称或经纬度');
            }else{
                if (originParam === ''){
                    originParam = encodeURIComponent(originParam + place.lat + ',' + place.lng);
                }else{
                    originParam = originParam + '|' + encodeURIComponent(place.lat + ',' + place.lng);
                }
            }
        });
    }

    if (typeof query.destinations === 'undefined' || !query.destinations){
        throw new Error('需要填写终点名称或经纬度');
    }else if (typeof query.destinations.lng === 'undefined' || !query.destinations.lng || typeof query.destinations.lat === 'undefined' || !query.destinations.lat) {
        throw new Error('需要填写终点名称或经纬度');
    }else{
        destinationParam = encodeURIComponent(destinationParam + query.destinations.lat + ',' + query.destinations.lng);
    }


    if (typeof query.mode === 'undefined' || !query.mode){
        query.mode = 'driving';    //导航模式，包括：driving（驾车）、walking（步行）、transit（公交）
    }

    if (typeof query.output === 'undefined' || !query.output){
        query.output = 'json';    //表示输出类型，可设置为xml或json，默认为xml。
    }

    if (typeof query.coord_type === 'undefined' || !query.coord_type){
        query.coord_type = 'bd09ll';    //坐标类型，可选参数，默认为bd09ll。允许的值为：bd09ll（百度经纬度坐标）、bd09mc（百度摩卡托坐标）、gcj02（国测局加密坐标）、wgs84（gps设备获取的坐标）。
    }


    var url = configBaiduMap.url_RouteMatrixAPI + 'origins=' + originParam + '&destinations=' + destinationParam + '&mode=' + query.mode + '&output=' + query.output + '&coord_type=' + query.coord_type + '&ak=' + this.config.ak;


    //console.log(url);

    var opts = {
        method: 'GET',
        url: url,
        timeout: 6000
    };

    requestC(opts, function(err, response, body){
        if (err){
            logger.error("BaiduMap Failed Network error:", JSON.stringify(err));
            callback(err);
        }else{
            //console.log ('-- BaiduMap Response Body: ', body);

            var result = {};
            try {
                result = JSON.parse(body) ;
                //console.log ('-- BaiduMap Response Body: ', result.result.elements);
            } catch (error) {
                // handle error
                logger.error("BaiduMap Failed JSON Parse Error:", JSON.stringify(error));
                callback(error);
            }

            if (result.status === 0){
                //0	成功
                //1	服务器内部错误
                //2	请求参数非法
                //3	权限校验失败
                //4	配额校验失败
                //5	Ak不存在或者非法
                //11	起终点信息模糊
                //12	起点或者终点超过5个
                //101	服务禁用
                //102	不通过白名单或者安全码不对

                var distanceArray = [];

                for (var i = 0; i < query.origins.length; i++) {

                    query.origins[i].distance = result.result.elements[i].distance;
                    query.origins[i].duration = result.result.elements[i].duration;

                    distanceArray.push(query.origins[i]);
                }

                callback(null, distanceArray);
            }else{
                logger.error("BaiduMap Failed, Route Matrix API, get result err : " + body + " query:" + JSON.stringify(query) + " URL:" + url);
                callback(null, result);
            }
        }

    });

};


baiduMap.prototype.getDistanceFromMultiPointAsync = Promise.promisify(baiduMap.prototype.getDistanceFromMultiPoint);









/**
 * Place API 是一类简单的HTTP接口，用于返回查询某个区域的某类POI数据，且提供单个POI的详情查询服务，用户可以使用C#、C++、Java等开发语言发送HTTP请求且接收json、xml的数据。
 * http://developer.baidu.com/map/index.php?title=webapi/guide/webservice-placeapi
 * @param  Object   query    [description]
 * @param  Function callback [description]
 * @return {[type]}            [description]
 */
baiduMap.prototype.getPlaceSearch = function(query, callback){

    var querytext = ''; // 检索关键字，周边检索和矩形区域内检索支持多个关键字并集检索，不同关键字间以$符号分隔，最多支持10个关键字检索。如:”银行$酒店”。
    var region = '';

    var scope = 1; // 检索结果详细程度。取值为1 或空，则返回基本信息；取值为2，返回检索POI详细信息
    var page_size = 10; // 范围记录数量，默认为10条记录，最大返回20条。多关键字检索时，返回的记录数为关键字个数*page_size。
    var page_num = 0; // 分页页码，默认为0,0代表第一页，1代表第二页，以此类推。

    if (typeof query.query === 'undefined' || !query.query){
        throw new Error('需要填写查询的区域的关键字');
    }else{
        querytext = encodeURIComponent(query.query);
    }

    if (typeof query.region === 'undefined' || !query.region) {
        throw new Error('需要填写查询的省市名称');
    }else{
        region = encodeURIComponent(query.region);
    }

    if (typeof query.output === 'undefined' || !query.output){
        query.output = 'json';    //表示输出类型，可设置为xml或json，默认为xml。
    }

    var url = configBaiduMap.url_placeAPISearch + 'query=' + querytext + '&region=' + region + '&scope=' + scope + '&page_size=' + page_size + '&page_num=' + page_num + '&output=' + query.output + '&ak=' + this.config.ak;


    //console.log(url);

    var opts = {
        method: 'GET',
        url: url,
        timeout: 6000
    };

    requestC(opts, function(err, response, body){
        if (err){
            logger.error("BaiduMap Failed Network error:", JSON.stringify(err));
            callback(err);
        }else{
            // logger.error ('-- BaiduMap Response Body: ', body);

            var result = {};
            try {
                result = JSON.parse(body) ;
            } catch (error) {
                // handle error
                logger.error("BaiduMap Failed JSON Parse Error:", JSON.stringify(error));
                callback(error);
            }

            if (result.status === 0){
                //0	成功
                //1	服务器内部错误
                //2	请求参数非法
                //3	权限校验失败
                //4	配额校验失败
                //5	Ak不存在或者非法
                //11	起终点信息模糊
                //12	起点或者终点超过5个
                //101	服务禁用
                //102	不通过白名单或者安全码不对

                var placeList = [];

                for (var i = 0; i < result.results.length; i++) {
                    placeList.push(result.results[i]);
                }

                callback(null, placeList);
            }else{
                logger.error("BaiduMap Failed, Place API, get result err : " + body + " query:" + JSON.stringify(query) + " URL:" + url);
                callback(null, result);
            }
        }

    });

};

baiduMap.prototype.getPlaceSearchAsync = Promise.promisify(baiduMap.prototype.getPlaceSearch);






/**
 * Place suggestion API 是一套以HTTP形式提供的匹配用户输入关键字辅助信息、提示接口，可返回json或xml格式的一组建议词条的数据。
 * http://developer.baidu.com/map/index.php?title=webapi/place-suggestion-api
 * @param  Object   query    [description]
 * @param  Function callback [description]
 * @return {[type]}            [description]
 */
baiduMap.prototype.getPlaceSuggestion = function(query, callback){

   var querytext = ''; // 输入建议关键字（支持拼音）
   var region =    ''; // 所属城市/区域名称或代号
   var location =  '';


   if (typeof query.query === 'undefined' || !query.query){
       throw new Error('需要填写查询的区域的关键字');
   }else{
       querytext = encodeURIComponent(query.query);
   }

   if (typeof query.region === 'undefined' || !query.region) {
       throw new Error('需要填写查询的省市名称');
   }else{
       region = encodeURIComponent(query.region);
   }

   if (typeof query.output === 'undefined' || !query.output){
       query.output = 'json';    //表示输出类型，可设置为xml或json，默认为xml。
   }

   var url = configBaiduMap.url_placeSuggestionAPI + 'query=' + querytext + '&region=' + region + '&output=' + query.output + '&ak=' + this.config.ak;


   //console.log(url);

   var opts = {
       method: 'GET',
       url: url,
       timeout: 6000
   };

   requestC(opts, function(err, response, body){
       if (err){
           logger.error("BaiduMap Failed Network error:", JSON.stringify(err));
           callback(err);
       }else{
           //logger.error ('-- BaiduMap Response Body: ', body);

           var result = {};
           try {
               result = JSON.parse(body) ;
           } catch (error) {
               // handle error
               logger.error("BaiduMap Failed JSON Parse Error:", JSON.stringify(error));
               callback(error);
           }

           if (result.status === 0){
               //0	成功
               //1	服务器内部错误
               //2	请求参数非法
               //3	权限校验失败
               //4	配额校验失败
               //5	Ak不存在或者非法
               //11	起终点信息模糊
               //12	起点或者终点超过5个
               //101	服务禁用
               //102	不通过白名单或者安全码不对

               var placeList = [];

               for (var i = 0; i < result.result.length; i++) {
                   placeList.push(result.result[i]);
               }

               callback(null, placeList);
           }else{
               logger.error("BaiduMap Failed, Place Suggestion API, get result err : " + body + " query:" + JSON.stringify(query) + " URL:" + url);
               callback(null, result);
           }
       }

   });

};

baiduMap.prototype.getPlaceSuggestionAsync = Promise.promisify(baiduMap.prototype.getPlaceSuggestion);
