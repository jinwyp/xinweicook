
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