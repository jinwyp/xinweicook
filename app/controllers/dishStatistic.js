/**
 * Created by jinwyp on 11/24/15.
 */



var warehouseObj = {
    "xinweioffice" : {$nin : [ObjectId('56332196594b09af6e6c7dd7'), ObjectId('564ab6de2bde80bd10a9bc60'), ObjectId('56c41a9e632771df68dbae0b')]},
    "lujiazui1" : ObjectId('564ab6de2bde80bd10a9bc60'),
    "caohejing1" : ObjectId('56332196594b09af6e6c7dd7'),
    "pujiangzhen1" : ObjectId('56c41a9e632771df68dbae0b')
};



exports.dishStatisticByStockLast7Day = function(req, res, next) {

    var query = {};



    if (typeof req.query._id !== 'undefined' && req.query._id !== '') {
        query._id = req.query._id;
    }

    if (typeof req.query.cookingType !== 'undefined' && req.query.cookingType !== '') {
        query.cookingType = req.query.cookingType;
    }

    if (typeof req.query.sideDishType !== 'undefined' && req.query.sideDishType !== '') {
        query.sideDishType = req.query.sideDishType;
    }

    if (typeof req.query.isPublished !== 'undefined' && req.query.isPublished !== '') {
        query.isPublished = req.query.isPublished;
    }


    //pipeline.push(
    //    { "$match":matchList}
    //);

    var timeNow = moment();
    var today = moment(timeNow.clone().format("YYYY-MM-DD 00:00:00"));
    var yesterday = today.clone().subtract(1, 'days');
    var dayBeforeYesterday2 = today.clone().subtract(2, 'days');
    var last3Day = today.clone().subtract(3, 'days');
    var last7Day = today.clone().subtract(7, 'days');
    var last15Day = today.clone().subtract(15, 'days');
    var last30Day = today.clone().subtract(30, 'days');
    var last60Day = today.clone().subtract(60, 'days');
    var last90Day = today.clone().subtract(90, 'days');


    var pipelineTotal = [];
    var pipelineToday = [];
    var pipelineYesterday = [];
    var pipelineDayBeforeYesterday = [];
    var pipelineLast3Day = [];
    var pipelineLast7Day = [];
    var pipelineLast15Day = [];
    var pipelineLast30Day = [];
    var pipelineLast60Day = [];
    var pipelineLast90Day = [];

    var pipelinePerDay = [];
    var pipelinePerWeek = [];


    var group = { "$group": {
        "_id": '$dish',
        "dishSaleQuantity": { "$sum": "$quantity" },
        "dishList": { "$push": { "_id": "$dish", "dish": "$dish", "user": "$user", "order": "$order", "quantity": "$quantity",  "isPlus": "$isPlus" , "createdAt": "$createdAt", "remark": "$remark" } }
    }};

    // Sorting pipeline
    var sort =  { "$sort": { "dishSaleQuantity": 1 } };

    // Optionally limit results
    var limit =  { "$limit": 3000 };

    /*

     // Sorting pipeline
     pipelineTotal.push (
     { "$sort": { "dishSaleQuantity": 1 } }
     );

     // Optionally limit results
     pipelineTotal.push (
     { "$limit": 1000 }
     );
     */

    var matchQueryWarehouse  = '';

    if (typeof req.query.showForWarehouse !== 'undefined' && req.query.showForWarehouse !== '') {

        matchQueryWarehouse = warehouseObj[req.query.showForWarehouse];
    }else{
        matchQueryWarehouse = {$nin : [ObjectId('564ab6de2bde80bd10a9bc61')]};
    }

    // Grouping pipeline
    pipelineTotal.push (
        { "$match":{
            "warehouse" : matchQueryWarehouse,
            "isPlus" : false,
            "remark": { $ne: "adminOperation" }
        }}, group, sort, limit
    );

    pipelineToday.push (
        { "$match":{
            "warehouse" : matchQueryWarehouse,
            "isPlus" : false,
            "createdAt": { "$gte": today.toDate() },
            "remark": { $ne: "adminOperation" }
        }}, group, sort, limit
    );

    pipelineYesterday.push (
        { "$match":{
            "warehouse" : matchQueryWarehouse,
            "isPlus" : false,
            "createdAt": { "$gte": yesterday.toDate(), "$lt": today.toDate() },
            "remark": { $ne: "adminOperation" }
        }}, group, sort, limit
    );

    pipelineDayBeforeYesterday.push (
        { "$match":{
            "warehouse" : matchQueryWarehouse,
            "isPlus" : false,
            "createdAt": { "$gte": dayBeforeYesterday2.toDate(), "$lt": yesterday.toDate() },
            "remark": { $ne: "adminOperation" }
        }}, group, sort, limit
    );

    pipelineLast3Day.push (
        { "$match":{
            "warehouse" : matchQueryWarehouse,
            "isPlus" : false,
            "createdAt": { "$gte": last3Day.toDate(), "$lt": today.toDate() },
            "remark": { $ne: "adminOperation" }
        }}, group, sort, limit
    );

    pipelineLast7Day.push (
        { "$match":{
            "warehouse" : matchQueryWarehouse,
            "isPlus" : false,
            "createdAt": { "$gte": last7Day.toDate(), "$lt": today.toDate() },
            "remark": { $ne: "adminOperation" }
        }}, group, sort, limit
    );

    pipelineLast15Day.push (
        { "$match":{
            "warehouse" : matchQueryWarehouse,
            "isPlus" : false,
            "createdAt": { "$gte": last15Day.toDate(), "$lt": today.toDate() },
            "remark": { $ne: "adminOperation" }
        }}, group, sort, limit
    );

    pipelineLast30Day.push (
        { "$match":{
            "warehouse" : matchQueryWarehouse,
            "isPlus" : false,
            "createdAt": { "$gte": last30Day.toDate(), "$lt": today.toDate() },
            "remark": { $ne: "adminOperation" }
        }}, group, sort, limit
    );

    pipelineLast60Day.push (
        { "$match":{
            "warehouse" : matchQueryWarehouse,
            "isPlus" : false,
            "createdAt": { "$gte": last60Day.toDate(), "$lt": today.toDate() },
            "remark": { $ne: "adminOperation" }
        }}, group, sort, limit
    );

    pipelineLast90Day.push (
        { "$match":{
            "warehouse" : matchQueryWarehouse,
            "isPlus" : false,
            "createdAt": { "$gte": last90Day.toDate(), "$lt": today.toDate() },
            "remark": { $ne: "adminOperation" }
        }}, group, sort, limit
    );


    pipelinePerDay.push (
        { "$match":{
            "warehouse" : matchQueryWarehouse,
            "isPlus" : false,
            "remark" : models.inventory.constantRemark().userOrder
        }},

        { $project :{
            _id : 1,
            createdAt : 1,
            user : 1,
            order: 1,
            dish : 1,
            quantity : 1,
            isPlus : 1,
            remark : 1,

            year: { $year: {$add:["$createdAt",28800000]} }, //28800000 = 8*60*60*1000
            month: { $month: {$add:["$createdAt",28800000]}  },
            day: { $dayOfMonth: {$add:["$createdAt",28800000]}  },
            hour: { $hour: {$add:["$createdAt",28800000]}  },
            minutes: { $minute: {$add:["$createdAt",28800000]}  },
            dayOfYear: { $dayOfYear: {$add:["$createdAt",28800000]}  },
            dayOfWeek: { $dayOfWeek: {$add:["$createdAt",28800000]}  },
            week: { $week: {$add:["$createdAt",28800000]}  }


        }},

        { "$group": {
            "_id": {dish:'$dish', day : "$day", month : "$month", year : "$year"},

            "dishSaleQuantity": { "$sum": "$quantity" },
            "dishList": { "$push": { "_id": "$dish", "dish": "$dish", "user": "$user", "order": "$order", "quantity": "$quantity",  "isPlus": "$isPlus" , "createdAt": "$createdAt", "remark": "$remark"  } }
        }},

        { $project :{
            _id : 0,
            "dish" : "$_id.dish",
            "day" : "$_id.day",
            "month" : "$_id.month",
            "year" : "$_id.year",
            "dishSaleQuantity": 1,
            "dishList": 1

        }},

        { "$sort": { "year" : -1, "month": -1, "day": -1 } },
        { "$limit": 2000 }
    );


    pipelinePerWeek.push (
        { "$match":{
            "warehouse" : matchQueryWarehouse,
            "isPlus" : false,
            "remark" : models.inventory.constantRemark().userOrder
        }},

        { $project :{
            _id : 1,
            createdAt : 1,
            user : 1,
            order: 1,
            dish : 1,
            quantity : 1,
            isPlus : 1,
            remark : 1,

            year: { $year: {$add:["$createdAt",28800000]} }, //28800000 = 8*60*60*1000
            month: { $month: {$add:["$createdAt",28800000]}  },
            day: { $dayOfMonth: {$add:["$createdAt",28800000]}  },
            hour: { $hour: {$add:["$createdAt",28800000]}  },
            minutes: { $minute: {$add:["$createdAt",28800000]}  },
            dayOfYear: { $dayOfYear: {$add:["$createdAt",28800000]}  },
            dayOfWeek: { $dayOfWeek: {$add:["$createdAt",28800000]}  },
            week: { $week: {$add:["$createdAt",28800000]}  }
        }},

        { "$group": {
            "_id": {dish:'$dish', week : "$week"},

            "dishSaleQuantity": { "$sum": "$quantity" },
            "dishList": { "$push": { "_id": "$dish", "dish": "$dish", "user": "$user", "order": "$order", "quantity": "$quantity",  "isPlus": "$isPlus" , "createdAt": "$createdAt", "remark": "$remark"  } }
        }},

        { $project :{
            _id : 0,
            "dish" : "$_id.dish",
            "week" : "$_id.week",
            "dishSaleQuantity": 1,
            "dishList": 1
        }},

        { "$sort": { "week": -1 } },
        { "$limit": 2000 }
    );


    

    if (typeof req.query.createdAt !== 'undefined' && req.query.createdAt !== '') {
        var date = JSON.parse(req.query.createdAt);
        pipelinePerDay[0]["$match"].createdAt = {};
        pipelinePerWeek[0]["$match"].createdAt = {};

        if (date['$gte']){
            pipelinePerDay[0]["$match"].createdAt['$gte'] = new Date(date['$gte']);
            pipelinePerWeek[0]["$match"].createdAt['$gte'] = new Date(date['$gte']);
        }
        if (date['$lte']) {
            pipelinePerDay[0]["$match"].createdAt['$lte'] = new Date(date['$lte']);
            pipelinePerWeek[0]["$match"].createdAt['$lte'] = new Date(date['$lte']);
        }
    }


    var dishHashListTotal = {};
    var dishHashListToday = {};
    var dishHashListYesterday = {};
    var dishHashListDayBeforeYesterday = {};
    var dishHashListLast3Day = {};
    var dishHashListLast7Day = {};
    var dishHashListLast15Day = {};
    var dishHashListLast30Day = {};
    var dishHashListLast60Day = {};
    var dishHashListLast90Day = {};
    var dishHashListPerDay = {};
    var dishHashListPerWeek = {};

    var promiseList = [
        models.dish.find(query).lean().execAsync(),
        models.inventory.aggregateAsync( pipelineTotal),
        models.inventory.aggregateAsync( pipelineToday),
        models.inventory.aggregateAsync( pipelineYesterday),
        models.inventory.aggregateAsync( pipelineDayBeforeYesterday),
        models.inventory.aggregateAsync( pipelineLast3Day),
        models.inventory.aggregateAsync( pipelineLast7Day),
        models.inventory.aggregateAsync( pipelineLast15Day),
        models.inventory.aggregateAsync( pipelineLast30Day),
        models.inventory.aggregateAsync( pipelineLast60Day),
        models.inventory.aggregateAsync( pipelineLast90Day),
        models.inventory.aggregateAsync( pipelinePerDay),
        models.inventory.aggregateAsync( pipelinePerWeek)
    ];

    Promise.all(promiseList).spread(function(resultDish, resultInventroyTotal, resultInventroyToday, resultInventroyYesterday, resultInventroyDayBeforeYesterday, resultInventroyLast3Day, resultInventroyLast7Day, resultInventroyLast15Day, resultInventroyLast30Day, resultInventroyLast60Day, resultInventroyLast90Day, resultInventroyPerDay, resultInventroyPerWeek){

        if (resultDish && resultDish.length > 0 && resultInventroyTotal.length > 0 && resultInventroyPerDay.length > 0) {

            resultInventroyTotal.forEach(function(dishInventory){
                dishHashListTotal[dishInventory._id.toString()] = dishInventory;
            });

            resultInventroyToday.forEach(function(dishInventory){
                dishHashListToday[dishInventory._id.toString()] = dishInventory;
            });

            resultInventroyYesterday.forEach(function(dishInventoryYesterday){
                dishHashListYesterday[dishInventoryYesterday._id.toString()] = dishInventoryYesterday;
            });

            resultInventroyDayBeforeYesterday.forEach(function(dishInventory){
                dishHashListDayBeforeYesterday[dishInventory._id.toString()] = dishInventory;
            });

            resultInventroyLast3Day.forEach(function(dishInventory){
                dishHashListLast3Day[dishInventory._id.toString()] = dishInventory;
            });

            resultInventroyLast7Day.forEach(function(dishInventory){
                dishHashListLast7Day[dishInventory._id.toString()] = dishInventory;
            });

            resultInventroyLast15Day.forEach(function(dishInventory){
                dishHashListLast15Day[dishInventory._id.toString()] = dishInventory;
            });

            resultInventroyLast30Day.forEach(function(dishInventory){
                dishHashListLast30Day[dishInventory._id.toString()] = dishInventory;
            });

            resultInventroyLast60Day.forEach(function(dishInventory){
                dishHashListLast60Day[dishInventory._id.toString()] = dishInventory;
            });

            resultInventroyLast90Day.forEach(function(dishInventory){
                dishHashListLast90Day[dishInventory._id.toString()] = dishInventory;
            });


            resultInventroyPerDay.forEach(function(dishInventoryPerDay){
                if (typeof dishHashListPerDay[dishInventoryPerDay.dish.toString()] === "undefined"){
                    dishHashListPerDay[dishInventoryPerDay.dish.toString()] = [];
                }
                dishHashListPerDay[dishInventoryPerDay.dish.toString()].push(dishInventoryPerDay);

            });

            resultInventroyPerWeek.forEach(function(dishInventoryPerWeek){
                if (typeof dishHashListPerWeek[dishInventoryPerWeek.dish.toString()] === "undefined"){
                    dishHashListPerWeek[dishInventoryPerWeek.dish.toString()] = [];
                }
                dishHashListPerWeek[dishInventoryPerWeek.dish.toString()].push(dishInventoryPerWeek);

            });


            // 整合数据
            resultDish.forEach(function(dishOne){

                if (typeof dishHashListTotal[dishOne._id.toString()] !== "undefined"){

                    dishOne.salesTotal = dishHashListTotal[dishOne._id.toString()].dishSaleQuantity;
//                    dishOne.salesTotalInventory = dishHashListTotal[dishOne._id.toString()];

                    dishOne.salesDaily = dishHashListPerDay[dishOne._id.toString()];
                    dishOne.salesWeek = dishHashListPerWeek[dishOne._id.toString()];
                }

                if (typeof dishHashListToday[dishOne._id.toString()] !== "undefined"){
                    dishOne.salesToday = dishHashListToday[dishOne._id.toString()].dishSaleQuantity;
//                    dishOne.salesTodayInventory = dishHashListToday[dishOne._id.toString()];
                }

                if (typeof dishHashListYesterday[dishOne._id.toString()] !== "undefined"){
                    dishOne.salesYesterday = dishHashListYesterday[dishOne._id.toString()].dishSaleQuantity;
//                    dishOne.salesYesterdayInventory = dishHashListYesterday[dishOne._id.toString()];
                }

                if (typeof dishHashListDayBeforeYesterday[dishOne._id.toString()] !== "undefined"){
                    dishOne.salesDayBeforeYesterday = dishHashListDayBeforeYesterday[dishOne._id.toString()].dishSaleQuantity;
//                    dishOne.salesDayBeforeYesterdayInventory = dishHashListDayBeforeYesterday[dishOne._id.toString()];
                }

                if (typeof dishHashListLast3Day[dishOne._id.toString()] !== "undefined"){
                    dishOne.salesLast3Day = dishHashListLast3Day[dishOne._id.toString()].dishSaleQuantity;
//                    dishOne.salesLast3DayInventory = dishHashListLast3Day[dishOne._id.toString()];
                }

                if (typeof dishHashListLast7Day[dishOne._id.toString()] !== "undefined"){
                    dishOne.salesLast7Day = dishHashListLast7Day[dishOne._id.toString()].dishSaleQuantity;
//                    dishOne.salesLast7DayInventory = dishHashListLast7Day[dishOne._id.toString()];
                }

                if (typeof dishHashListLast15Day[dishOne._id.toString()] !== "undefined"){
                    dishOne.salesLast15Day = dishHashListLast15Day[dishOne._id.toString()].dishSaleQuantity;
//                    dishOne.salesLast15DayInventory = dishHashListLast15Day[dishOne._id.toString()];
                }

                if (typeof dishHashListLast30Day[dishOne._id.toString()] !== "undefined"){
                    dishOne.salesLast30Day = dishHashListLast30Day[dishOne._id.toString()].dishSaleQuantity;
//                    dishOne.salesLast30DayInventory = dishHashListLast30Day[dishOne._id.toString()];
                }

                if (typeof dishHashListLast60Day[dishOne._id.toString()] !== "undefined"){
                    dishOne.salesLast60Day = dishHashListLast60Day[dishOne._id.toString()].dishSaleQuantity;
//                    dishOne.salesLast60DayInventory = dishHashListLast60Day[dishOne._id.toString()];
                }

                if (typeof dishHashListLast90Day[dishOne._id.toString()] !== "undefined"){
                    dishOne.salesLast90Day = dishHashListLast90Day[dishOne._id.toString()].dishSaleQuantity;
//                    dishOne.salesLast90DayInventory = dishHashListLast90Day[dishOne._id.toString()];
                }


            });


            res.status(200).json(resultDish);

        }else{
            res.status(200).json([]);
        }
    }).catch(next);



};

















exports.dishDailySales = function(req, res, next) {

    var query = {};

    if (typeof req.query._id !== 'undefined' && req.query._id !== '') {
        query._id = req.query._id;
    }

    if (typeof req.query.cookingType !== 'undefined' && req.query.cookingType !== '') {
        query.cookingType = req.query.cookingType;
    }

    if (typeof req.query.sideDishType !== 'undefined' && req.query.sideDishType !== '') {
        query.sideDishType = req.query.sideDishType;
    }

    if (typeof req.query.isPublished !== 'undefined' && req.query.isPublished !== '') {
        query.isPublished = req.query.isPublished;
    }


    var matchQueryWarehouse  = '';

    if (typeof req.query.showForWarehouse !== 'undefined' && req.query.showForWarehouse !== '') {

        matchQueryWarehouse = warehouseObj[req.query.showForWarehouse];
    }else{
        matchQueryWarehouse = {$nin : [ObjectId('564ab6de2bde80bd10a9bc61')]};
    }


    var dishIdList = [];
    var dishHash = {};

    var pipelinePerDay = [];
    var pipelinePerDeliveryDay = [];

    var match = {
        "warehouse" : matchQueryWarehouse,
        "isPlus" : false,
        "remark" : models.inventory.constantRemark().userOrder,
        "deliveryDateTime" : { $exists: true}
    };

    if (typeof req.query.createdAt !== 'undefined' && req.query.createdAt !== '') {
        var date = JSON.parse(req.query.createdAt);
        match.createdAt = {};
        if (date['$gte']) match.createdAt['$gte'] = new Date(date['$gte']);
        if (date['$lte']) match.createdAt['$lte'] = new Date(date['$lte']);
    }

    models.dish.find(query).lean().execAsync().then(function(resultDishList) {

        dishIdList = resultDishList.map(function (dish) {
            dishHash[dish._id.toString()] = dish;
            return ObjectId(dish._id.toString());
        });

        match.dish = {$in:dishIdList};

        pipelinePerDay.push (
            { "$match":match},

            { $project :{
                _id : 1,
                createdAt : 1,
                user : 1,
                order: 1,
                dish : 1,
                quantity : 1,
                isPlus : 1,
                remark : 1,
                deliveryDateTime : 1,
                clientFrom : 1,

                year: { $year: {$add:["$createdAt",28800000]} }, //28800000 = 8*60*60*1000
                month: { $month: {$add:["$createdAt",28800000]}  },
                day: { $dayOfMonth: {$add:["$createdAt",28800000]}  },
                hour: { $hour: {$add:["$createdAt",28800000]}  },
                minutes: { $minute: {$add:["$createdAt",28800000]}  },
                dayOfYear: { $dayOfYear: {$add:["$createdAt",28800000]}  },
                dayOfWeek: { $dayOfWeek: {$add:["$createdAt",28800000]}  },
                week: { $week: {$add:["$createdAt",28800000]}  }
            }},

            { "$group": {
                "_id": {dish:'$dish', day : "$day", month : "$month", year : "$year"},

                "dishSaleQuantity": { "$sum": "$quantity" },
                "dishList": { "$push": { "_id": "$_id", "dish": "$dish", "user": "$user", "order": "$order", "quantity": "$quantity",  "isPlus": "$isPlus" , "createdAt": "$createdAt", "remark": "$remark", "deliveryDateTime":"$deliveryDateTime", "clientFrom":"$clientFrom"  } }
            }},

            { $project :{
                _id : 0,
                "dish" : "$_id.dish",
                "day" : "$_id.day",
                "month" : "$_id.month",
                "year" : "$_id.year",

                "dishSaleQuantity": 1,
                "dishList": 1

            }},

            { "$sort": { "year" : -1, "month": -1, "day": -1 , "dishSaleQuantity":1 } },
            { "$limit": 20000 }
        );


        pipelinePerDeliveryDay.push (
            { "$match":match},

            { $project :{
                _id : 1,
                createdAt : 1,
                user : 1,
                order: 1,
                dish : 1,
                quantity : 1,
                isPlus : 1,
                remark : 1,
                deliveryDateTime : 1,
                clientFrom : 1,

                year: { $year: {$add:["$deliveryDateTime",28800000]} },
                month: { $month: {$add:["$deliveryDateTime",28800000]} },
                day: { $dayOfMonth: {$add:["$deliveryDateTime",28800000]} },
                hour: { $hour: {$add:["$deliveryDateTime",28800000]} },
                minutes: { $minute: {$add:["$deliveryDateTime",28800000]} },
                dayOfYear: { $dayOfYear: {$add:["$deliveryDateTime",28800000]} },
                dayOfWeek: { $dayOfWeek: {$add:["$deliveryDateTime",28800000]} },
                week: { $week: {$add:["$deliveryDateTime",28800000]} }
            }},

            { "$group": {
                "_id": {dish:'$dish', day : "$day", month : "$month", year : "$year"},

                "dishSaleQuantityDeliveryDate": { "$sum": "$quantity" },
                "dishList": { "$push": { "_id": "$_id", "dish": "$dish", "user": "$user", "order": "$order", "quantity": "$quantity",  "isPlus": "$isPlus" , "createdAt": "$createdAt", "remark": "$remark", "deliveryDateTime":"$deliveryDateTime", "clientFrom":"$clientFrom"  } }
            }},

            { $project :{
                _id : 0,
                "dish" : "$_id.dish",
                "day" : "$_id.day",
                "month" : "$_id.month",
                "year" : "$_id.year",

                "dishSaleQuantityDeliveryDate": 1,
                "dishList": 1

            }},

            { "$sort": { "year" : -1, "month": -1, "day": -1 , "dishSaleQuantityDeliveryDate":1 } },
            { "$limit": 20000 }
        );


        var promiseList = [
            models.inventory.aggregateAsync( pipelinePerDay),
            models.inventory.aggregateAsync( pipelinePerDeliveryDay)
        ];

        Promise.all(promiseList).spread(function( resultInventroyPerDay, resultInventroyPerDeliveryDay){

            var tempDishObject ={};

            if (resultInventroyPerDeliveryDay  && resultInventroyPerDeliveryDay.length > 0 ) {

                resultInventroyPerDeliveryDay.forEach(function(inventroy){

                    inventroy.date =  inventroy.year + "-" + inventroy.month + "-" + inventroy.day;
                    tempDishObject[inventroy.date + '-' + inventroy.dish.toString()] = inventroy.dishSaleQuantityDeliveryDate;
                });
            }


            if (resultInventroyPerDay  && resultInventroyPerDay.length > 0 ) {

                resultInventroyPerDay.forEach(function(inventroyPerDay){
                    inventroyPerDay.dishname = dishHash[inventroyPerDay.dish.toString()].title.zh;
                    inventroyPerDay.cookingType = dishHash[inventroyPerDay.dish.toString()].cookingType;
                    inventroyPerDay.sideDishType = dishHash[inventroyPerDay.dish.toString()].sideDishType;
                    inventroyPerDay.priceOriginal = dishHash[inventroyPerDay.dish.toString()].priceOriginal;
                    inventroyPerDay.isPublished = dishHash[inventroyPerDay.dish.toString()].isPublished;
                    inventroyPerDay.date =  inventroyPerDay.year + "-" + inventroyPerDay.month + "-" + inventroyPerDay.day;
                    inventroyPerDay.dishSaleQuantityDeliveryDay =  tempDishObject[inventroyPerDay.date + '-' + inventroyPerDay.dish.toString()] || "";

                    inventroyPerDay.dishSaleQuantityPreOrder = 0;

                    inventroyPerDay.dishList.forEach(function(inventroySingle){
                        if (moment(inventroySingle.createdAt).date() !== moment(inventroySingle.deliveryDateTime).date()){
                            inventroyPerDay.dishSaleQuantityPreOrder = inventroyPerDay.dishSaleQuantityPreOrder + inventroySingle.quantity;
                        }
                    });
                });
            }

            res.status(200).json(resultInventroyPerDay);

        }).catch(next);

    }).catch(next);



};




exports.dishDailySalesChart = function(req, res, next) {

    var query = {};

    if (typeof req.query._id !== 'undefined' && req.query._id !== '') {
        query._id = req.query._id;
    }

    if (typeof req.query.cookingType !== 'undefined' && req.query.cookingType !== '') {
        query.cookingType = req.query.cookingType;
    }

    if (typeof req.query.sideDishType !== 'undefined' && req.query.sideDishType !== '') {
        query.sideDishType = req.query.sideDishType;
    }

    if (typeof req.query.isPublished !== 'undefined' && req.query.isPublished !== '') {
        query.isPublished = req.query.isPublished;
    }


    var matchQueryWarehouse  = '';

    if (typeof req.query.showForWarehouse !== 'undefined' && req.query.showForWarehouse !== '') {

        matchQueryWarehouse = warehouseObj[req.query.showForWarehouse];
    }else{
        matchQueryWarehouse = {$nin : [ObjectId('564ab6de2bde80bd10a9bc61')]};
    }



    var dishIdList = [];

    var pipelinePerDay = [];
    var pipelinePerWeek = [];
    var pipelinePerMonth = [];

    var match = {
        "warehouse" : matchQueryWarehouse,
        "isPlus" : false,
        "remark" : models.inventory.constantRemark().userOrder,
        "deliveryDateTime" : { $exists: true}
    };

    if (typeof req.query.createdAt !== 'undefined' && req.query.createdAt !== '') {
        var date = JSON.parse(req.query.createdAt);
        match.createdAt = {};
        if (date['$gte']) match.createdAt['$gte'] = new Date(date['$gte']);
        if (date['$lte']) match.createdAt['$lte'] = new Date(date['$lte']);
    }

    var project = {
        _id : 1,
        createdAt : 1,
        user : 1,
        order: 1,
        dish : 1,
        quantity : 1,
        isPlus : 1,
        remark : 1,
        deliveryDateTime : 1,
        clientFrom : 1,

        year: { $year: {$add:["$deliveryDateTime",28800000]} },
        month: { $month: {$add:["$deliveryDateTime",28800000]} },
        day: { $dayOfMonth: {$add:["$deliveryDateTime",28800000]} },
        hour: { $hour: {$add:["$deliveryDateTime",28800000]} },
        minutes: { $minute: {$add:["$deliveryDateTime",28800000]} },
        dayOfYear: { $dayOfYear: {$add:["$deliveryDateTime",28800000]} },
        dayOfWeek: { $dayOfWeek: {$add:["$deliveryDateTime",28800000]} },
        week: { $week: {$add:["$deliveryDateTime",28800000]} }
    };

    models.dish.find(query).lean().execAsync().then(function(resultDishList){
        dishIdList = resultDishList.map(function(dish){
            return  ObjectId(dish._id.toString());
        });

        match.dish = {$in:dishIdList};

        pipelinePerDay.push (
            { "$match":match},

            { $project :project},

            { "$group": {
                "_id": { day : "$day", month : "$month", year : "$year"},

                "dishSaleQuantity": { "$sum": "$quantity" },
                "dishList": { "$push": { "_id": "$_id", "dish": "$dish", "user": "$user", "order": "$order", "quantity": "$quantity",  "isPlus": "$isPlus" , "createdAt": "$createdAt", "remark": "$remark", "deliveryDateTime":"$deliveryDateTime", "clientFrom":"$clientFrom"   } }
            }},

            { $project :{
                _id : 0,
                "day" : "$_id.day",
                "month" : "$_id.month",
                "year" : "$_id.year",
                "date" :  { $concat: [ {$substr: ["$_id.year", 0, 4]}, "-", {$substr: ["$_id.month", 0, 2]}, "-", {$substr: ["$_id.day", 0, 2]}] },

                "dishSaleQuantity": 1,
                "dishList": 1
            }},

            { "$sort": { "year" : 1, "month": 1, "day": 1 } },
            { "$limit": 500 }
        );


        models.inventory.aggregateAsync( pipelinePerDay).then(function( resultInventroyPerDay){
            res.status(200).json(resultInventroyPerDay);
        }).catch(next);


    }).catch(next);





};





exports.dishWeeklySalesChart = function(req, res, next) {

    var query = {};

    if (typeof req.query._id !== 'undefined' && req.query._id !== '') {
        query._id = req.query._id;
    }

    if (typeof req.query.cookingType !== 'undefined' && req.query.cookingType !== '') {
        query.cookingType = req.query.cookingType;
    }

    if (typeof req.query.sideDishType !== 'undefined' && req.query.sideDishType !== '') {
        query.sideDishType = req.query.sideDishType;
    }

    if (typeof req.query.isPublished !== 'undefined' && req.query.isPublished !== '') {
        query.isPublished = req.query.isPublished;
    }


    var matchQueryWarehouse  = '';

    if (typeof req.query.showForWarehouse !== 'undefined' && req.query.showForWarehouse !== '') {

        matchQueryWarehouse = warehouseObj[req.query.showForWarehouse];
    }else{
        matchQueryWarehouse = {$nin : [ObjectId('564ab6de2bde80bd10a9bc61')]};
    }



    var dishIdList = [];

    var pipelinePerDay = [];
    var pipelinePerWeek = [];
    var pipelinePerMonth = [];

    var match = {
        "warehouse" : matchQueryWarehouse,
        "isPlus" : false,
        "remark" : models.inventory.constantRemark().userOrder,
        "deliveryDateTime" : { $exists: true}
    };

    if (typeof req.query.createdAt !== 'undefined' && req.query.createdAt !== '') {
        var date = JSON.parse(req.query.createdAt);
        match.createdAt = {};
        if (date['$gte']) match.createdAt['$gte'] = new Date(date['$gte']);
        if (date['$lte']) match.createdAt['$lte'] = new Date(date['$lte']);
    }


    var project = {
        _id : 1,
        createdAt : 1,
        user : 1,
        order: 1,
        dish : 1,
        quantity : 1,
        isPlus : 1,
        remark : 1,
        deliveryDateTime : 1,
        clientFrom : 1,

        year: { $year: {$add:["$deliveryDateTime",28800000]} },
        month: { $month: {$add:["$deliveryDateTime",28800000]} },
        day: { $dayOfMonth: {$add:["$deliveryDateTime",28800000]} },
        hour: { $hour: {$add:["$deliveryDateTime",28800000]} },
        minutes: { $minute: {$add:["$deliveryDateTime",28800000]} },
        dayOfYear: { $dayOfYear: {$add:["$deliveryDateTime",28800000]} },
        dayOfWeek: { $dayOfWeek: {$add:["$deliveryDateTime",28800000]} },
        week: { $week: {$add:["$deliveryDateTime",28800000]} }
    };

    models.dish.find(query).lean().execAsync().then(function(resultDishList){
        dishIdList = resultDishList.map(function(dish){
            return  ObjectId(dish._id.toString());
        });

        match.dish = {$in:dishIdList};

        pipelinePerWeek.push (
            { "$match":match},

            { $project :project},

            { "$group": {
                "_id": { week : "$week", year : "$year"},

                "firstDate" : { $first: "$createdAt" },
                "dishSaleQuantity": { "$sum": "$quantity" },
                "dishList": { "$push": { "_id": "$_id", "dish": "$dish", "user": "$user", "order": "$order", "quantity": "$quantity",  "isPlus": "$isPlus" , "createdAt": "$createdAt", "remark": "$remark", "deliveryDateTime":"$deliveryDateTime", "clientFrom":"$clientFrom"   } }

            }},

            { $project :{
                _id : 0,
                "week" : "$_id.week",
                "year" : "$_id.year",
                "date" :  { $concat: [  {$substr: ["$_id.year", 0, 4]}, "-", {$substr: ["$_id.week", 0, 2]}, " (", {$substr: ["$firstDate", 5, 5]}, ")"] },

                "firstDate": 1,
                "dishSaleQuantity": 1,
                "dishList": 1
            }},

            { "$sort": { "year" : 1, "week": 1 } },
            { "$limit": 100 }
        );


        pipelinePerMonth.push (
            { "$match":match},

            { $project :project},

            { "$group": {
                "_id": { month : "$month", year : "$year"},

                "dishSaleQuantity": { "$sum": "$quantity" },
                "dishList": { "$push": { "_id": "$_id", "dish": "$dish", "user": "$user", "order": "$order", "quantity": "$quantity",  "isPlus": "$isPlus" , "createdAt": "$createdAt", "remark": "$remark", "deliveryDateTime":"$deliveryDateTime", "clientFrom":"$clientFrom"   } }
            }},

            { $project :{
                _id : 0,
                "month" : "$_id.month",
                "year" : "$_id.year",
                "date" :  { $concat: [  {$substr: ["$_id.year", 0, 4]}, "-", {$substr: ["$_id.month", 0, 2]}] },

                "dishSaleQuantity": 1,
                "dishList": 1
            }},

            { "$sort": { "year" : 1, "month": 1 } },
            { "$limit": 100 }
        );


        var promiseList = [
            models.inventory.aggregateAsync( pipelinePerWeek),
            models.inventory.aggregateAsync( pipelinePerMonth)
        ];

        Promise.all(promiseList).spread(function( resultInventroyPerWeek, resultInventroyPerMonth){

            res.status(200).json({
                byWeek : resultInventroyPerWeek,
                byMonth : resultInventroyPerMonth
            });
        }).catch(next);


    }).catch(next);





};
