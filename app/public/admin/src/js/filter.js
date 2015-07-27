
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