
angular.module('RDash').filter('keywordfilter', ['$filter', function($filter){
    return function(data, text){
        console.log (text);
        if(typeof text !== 'undefined'){

            var textArr = text.split(' ');
            angular.forEach(textArr, function(test){
                if(test){
                    data = $filter('filter')(data, test);
                }
            });
            return data;
        }else{
            return data;
        }

    }
}]);




angular.module('RDash').filter('tagfilter', ['$filter', function($filter){
    return function(data, text){
        if(typeof text !== 'undefined' && angular.isArray(text)){

            var result = data;
            angular.forEach(text, function(tag){
                if (tag._id === data){
                    result = tag.name.zh;
                }
            });
            return result;
        }else{
            return data;
        }

    }
}]);


angular.module('RDash').filter('dishfilter', ['$filter', function($filter){
    return function(data, text){
        if(typeof text !== 'undefined' && angular.isArray(text)){

            var result = data;
            angular.forEach(text, function(dish){
                if (dish._id === data){
                    result = dish.title.zh;
                }
            });
            return result;
        }else{
            return data;
        }

    }
}]);



angular.module('RDash').filter('warehousefilter', ['$filter', function($filter){
    return function(data){

        if(typeof data === 'string' && data.length > 23){

            var warehouseList = [
                {
                    "_id"                  : "56332187594b09af6e6c7dd2",
                    "name"                 : "xinweioffice",
                    "locationGeoLatitude"  : 31.195693,
                    "locationGeoLongitude" : 121.467155,
                    "displayName"          : {"zh" : "新味办公室", "en" : "Xinwei Office"},
                    "address"              : "中山南二路510号",
                    "deliveryRange"        : 6100,
                    "sortId"               : 1000,
                    "isActivated"          : true
                },
                {
                    "_id"                  : "56332196594b09af6e6c7dd7",
                    "name"                 : "caohejing1",
                    "locationGeoLatitude"  : 31.17546886907618,
                    "locationGeoLongitude" : 121.4051452465212,
                    "displayName"          : {"zh" : "漕河泾仓库", "en" : "Caohejing warehouse"},
                    "address"              : "虹梅路2008号虹梅大楼",
                    "deliveryRange"        : 1500,
                    "sortId"               : 900,
                    "isActivated"          : true
                },
                {
                    "_id"                  : "564ab6de2bde80bd10a9bc60",
                    "name"                 : "lujiazui1",
                    "locationGeoLatitude"  : 31.24232042013846,
                    "locationGeoLongitude" : 121.5277729316883,
                    "displayName"          : {"zh" : "陆家嘴仓库", "en" : "Lujiazui warehouse"},
                    "address"              : "东方路286号",
                    "deliveryRange"        : 2500,
                    "sortId"               : 800,
                    "isActivated"          : true

                }

            ];

            var result = data;
            angular.forEach(warehouseList, function(warehouse){
                if (data === warehouse._id){
                    result = warehouse.displayName.zh;
                }
            });
            return result;
        }else{
            return data;
        }

    }
}]);