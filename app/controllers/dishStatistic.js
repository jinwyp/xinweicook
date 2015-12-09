/**
 * Created by jinwyp on 11/24/15.
 */






exports.dishStatisticByStockLast7Day = function(req, res, next) {

    var query = {};



    if (typeof req.query._id !== 'undefined' && req.query._id !== '') {
        query._id = req.query._id;
    }

    // if (typeof req.query.searchDateFrom !== 'undefined' && req.query.searchDateFrom !== '') {
    //     query.createdAt = { $gte: new Date(req.query.searchDateFrom)};
    // }

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

        if (req.query.showForWarehouse === 'xinweioffice') {
            matchQueryWarehouse = {$nin : [ObjectId('56332196594b09af6e6c7dd7'), ObjectId('564ab6de2bde80bd10a9bc60')]};

        }else if (req.query.showForWarehouse === 'caohejing1'){
            matchQueryWarehouse = ObjectId('56332196594b09af6e6c7dd7');

        }else if (req.query.showForWarehouse === 'lujiazui1'){
            matchQueryWarehouse = ObjectId('564ab6de2bde80bd10a9bc60');
        }
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

            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
            hour: { $hour: "$createdAt" },
            minutes: { $minute: "$createdAt" },
            dayOfYear: { $dayOfYear: "$createdAt" },
            dayOfWeek: { $dayOfWeek: "$createdAt" },
            week: { $week: "$createdAt" }
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
        { "$limit": 1000 }
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

            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
            hour: { $hour: "$createdAt" },
            minutes: { $minute: "$createdAt" },
            dayOfYear: { $dayOfYear: "$createdAt" },
            dayOfWeek: { $dayOfWeek: "$createdAt" },
            week: { $week: "$createdAt" }
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
        { "$limit": 1000 }
    );


    if (typeof req.query.searchDateFrom !== 'undefined' && req.query.searchDateFrom !== '') {
        pipelinePerDay[0]["$match"].createdAt = { $gte: new Date(req.query.searchDateFrom)};
        pipelinePerWeek[0]["$match"].createdAt = { $gte: new Date(req.query.searchDateFrom)};
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
            //dishIdList = resultDish.map(function(dish){
            //    return dish._id.toString()
            //});


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


    var matchQueryWarehouse  = '';

    if (typeof req.query.showForWarehouse !== 'undefined' && req.query.showForWarehouse !== '') {

        if (req.query.showForWarehouse === 'xinweioffice') {
            matchQueryWarehouse = {$nin : [ObjectId('56332196594b09af6e6c7dd7'), ObjectId('564ab6de2bde80bd10a9bc60')]};

        }else if (req.query.showForWarehouse === 'caohejing1'){
            matchQueryWarehouse = ObjectId('56332196594b09af6e6c7dd7');

        }else if (req.query.showForWarehouse === 'lujiazui1'){
            matchQueryWarehouse = ObjectId('564ab6de2bde80bd10a9bc60');
        }
    }else{
        matchQueryWarehouse = {$nin : [ObjectId('564ab6de2bde80bd10a9bc61')]};
    }



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

    var dishIdList = [];
    var dishHash = {};
    var pipelinePerDay = [];
    var pipelinePerDeliveryDay = [];

    models.dish.find(query).lean().execAsync().then(function(resultDishList) {


        dishIdList = resultDishList.map(function (dish) {
            return ObjectId(dish._id.toString());
        });

        resultDishList.forEach(function(dish){
            dishHash[dish._id.toString()] = dish;
        });



        pipelinePerDay.push (
            { "$match":{
                "warehouse" : matchQueryWarehouse,
                "dish" : {$in:dishIdList},
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
                deliveryDateTime : 1,
                clientFrom : 1,

                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" },
                hour: { $hour: "$createdAt" },
                minutes: { $minute: "$createdAt" },
                dayOfYear: { $dayOfYear: "$createdAt" },
                dayOfWeek: { $dayOfWeek: "$createdAt" },
                week: { $week: "$createdAt" }
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
            { "$limit": 5000 }
        );

        pipelinePerDeliveryDay.push (
            { "$match":{
                "warehouse" : matchQueryWarehouse,
                "dish" : {$in:dishIdList},
                "isPlus" : false,
                "remark" : models.inventory.constantRemark().userOrder,
                "deliveryDateTime" : { $exists: true}
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
                deliveryDateTime : 1,
                clientFrom : 1,

                year: { $year: "$deliveryDateTime" },
                month: { $month: "$deliveryDateTime" },
                day: { $dayOfMonth: "$createdAt" },
                hour: { $hour: "$deliveryDateTime" },
                minutes: { $minute: "$deliveryDateTime" },
                dayOfYear: { $dayOfYear: "$deliveryDateTime" },
                dayOfWeek: { $dayOfWeek: "$deliveryDateTime" },
                week: { $week: "$deliveryDateTime" }
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
            { "$limit": 5000 }
        );


        if (typeof req.query.searchDateFrom !== 'undefined' && req.query.searchDateFrom !== '') {
            pipelinePerDay[0]["$match"].createdAt = { $gte: new Date(req.query.searchDateFrom)}
            pipelinePerDeliveryDay[0]["$match"].createdAt = { $gte: new Date(req.query.searchDateFrom)}
        }



        var promiseList = [
            models.inventory.aggregateAsync( pipelinePerDay),
            models.inventory.aggregateAsync( pipelinePerDeliveryDay)
        ];

        Promise.all(promiseList).spread(function( resultInventroyPerDay, resultInventroyPerDeliveryDay){

            var tempDishObject ={};

            if (resultInventroyPerDeliveryDay  && resultInventroyPerDeliveryDay.length > 0 ) {

                resultInventroyPerDeliveryDay.forEach(function(inventroy){
                    inventroy.dishname = dishHash[inventroy.dish.toString()].title.zh;
                    inventroy.cookingType = dishHash[inventroy.dish.toString()].cookingType;
                    inventroy.sideDishType = dishHash[inventroy.dish.toString()].sideDishType;
                    inventroy.priceOriginal = dishHash[inventroy.dish.toString()].priceOriginal;
                    inventroy.isPublished = dishHash[inventroy.dish.toString()].isPublished;
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
                    
                });
            }

            var result = {
                perDay : resultInventroyPerDay,
                perDeliveryDay : resultInventroyPerDeliveryDay
            };

            res.status(200).json(result);

        }).catch(next);

    }).catch(next);





};








exports.dishDailySalesChart = function(req, res, next) {

    var query = {};

    var matchQueryWarehouse  = '';

    if (typeof req.query.showForWarehouse !== 'undefined' && req.query.showForWarehouse !== '') {

        if (req.query.showForWarehouse === 'xinweioffice') {
            matchQueryWarehouse = {$nin : [ObjectId('56332196594b09af6e6c7dd7'), ObjectId('564ab6de2bde80bd10a9bc60')]};

        }else if (req.query.showForWarehouse === 'caohejing1'){
            matchQueryWarehouse = ObjectId('56332196594b09af6e6c7dd7');

        }else if (req.query.showForWarehouse === 'lujiazui1'){
            matchQueryWarehouse = ObjectId('564ab6de2bde80bd10a9bc60');
        }
    }else{
        matchQueryWarehouse = {$nin : [ObjectId('564ab6de2bde80bd10a9bc61')]};
    }



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


    var dishIdList = [];
    var pipelinePerDay = [];
    var pipelinePerWeek = [];
    var pipelinePerMonth = [];

    models.dish.find(query).lean().execAsync().then(function(resultDishList){
        dishIdList = resultDishList.map(function(dish){
            return  ObjectId(dish._id.toString());
        });


        pipelinePerDay.push (
            { "$match":{
                "warehouse" : matchQueryWarehouse,
                "dish" : {$in:dishIdList},
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

                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" },
                hour: { $hour: "$createdAt" },
                minutes: { $minute: "$createdAt" },
                dayOfYear: { $dayOfYear: "$createdAt" },
                dayOfWeek: { $dayOfWeek: "$createdAt" },
                week: { $week: "$createdAt" }
            }},

            { "$group": {
                "_id": { day : "$day", month : "$month", year : "$year"},

                "dishSaleQuantity": { "$sum": "$quantity" },
                "dishList": { "$push": { "_id": "$_id", "dish": "$dish", "user": "$user", "order": "$order", "quantity": "$quantity",  "isPlus": "$isPlus" , "createdAt": "$createdAt", "remark": "$remark"  } }
            }},

            { $project :{
                _id : 0,
                "day" : "$_id.day",
                "month" : "$_id.month",
                "year" : "$_id.year",

                "dishSaleQuantity": 1,
                "dishList": 1
            }},

            { "$sort": { "year" : 1, "month": 1, "day": 1 } },
            { "$limit": 5000 }
        );



        pipelinePerWeek.push (
            { "$match":{
                "warehouse" : matchQueryWarehouse,
                "dish" : {$in:dishIdList},
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

                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" },
                hour: { $hour: "$createdAt" },
                minutes: { $minute: "$createdAt" },
                dayOfYear: { $dayOfYear: "$createdAt" },
                dayOfWeek: { $dayOfWeek: "$createdAt" },
                week: { $week: "$createdAt" }
            }},

            { "$group": {
                "_id": { week : "$week", year : "$year"},

                "dishSaleQuantity": { "$sum": "$quantity" },
                "dishList": { "$push": { "_id": "$_id", "dish": "$dish", "user": "$user", "order": "$order", "quantity": "$quantity",  "isPlus": "$isPlus" , "createdAt": "$createdAt", "remark": "$remark"  } }
            }},

            { $project :{
                _id : 0,
                "week" : "$_id.week",
                "year" : "$_id.year",
                "dishSaleQuantity": 1,
                "dishList": 1
            }},

            { "$sort": { "year" : 1, "week": 1 } },
            { "$limit": 5000 }
        );



        pipelinePerMonth.push (
            { "$match":{
                "warehouse" : matchQueryWarehouse,
                "dish" : {$in:dishIdList},
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

                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" },
                hour: { $hour: "$createdAt" },
                minutes: { $minute: "$createdAt" },
                dayOfYear: { $dayOfYear: "$createdAt" },
                dayOfWeek: { $dayOfWeek: "$createdAt" },
                week: { $week: "$createdAt" }
            }},

            { "$group": {
                "_id": { month : "$month", year : "$year"},

                "dishSaleQuantity": { "$sum": "$quantity" },
                "dishList": { "$push": { "_id": "$_id", "dish": "$dish", "user": "$user", "order": "$order", "quantity": "$quantity",  "isPlus": "$isPlus" , "createdAt": "$createdAt", "remark": "$remark"  } }
            }},

            { $project :{
                _id : 0,
                "month" : "$_id.month",
                "year" : "$_id.year",

                "dishSaleQuantity": 1,
                "dishList": 1
            }},

            { "$sort": { "year" : 1, "month": 1 } },
            { "$limit": 5000 }
        );



        if (typeof req.query.searchDateFrom !== 'undefined' && req.query.searchDateFrom !== '') {
            pipelinePerDay[0]["$match"].createdAt = { $gte: new Date(req.query.searchDateFrom)};
            pipelinePerWeek[0]["$match"].createdAt = { $gte: new Date(req.query.searchDateFrom)};
            pipelinePerMonth[0]["$match"].createdAt = { $gte: new Date(req.query.searchDateFrom)};
        }

        var promiseList = [
            models.inventory.aggregateAsync( pipelinePerDay),
            models.inventory.aggregateAsync( pipelinePerWeek),
            models.inventory.aggregateAsync( pipelinePerMonth)
        ];

        Promise.all(promiseList).spread(function( resultInventroyPerDay, resultInventroyPerWeek, resultInventroyPerMonth){

            if (resultInventroyPerDay  && resultInventroyPerDay.length > 0 ) {

                resultInventroyPerDay.forEach(function(inventroy){
                    inventroy.date =  inventroy.year + "-" + inventroy.month + "-" + inventroy.day
                })

            }

            if (resultInventroyPerWeek  && resultInventroyPerWeek.length > 0 ) {

                resultInventroyPerWeek.forEach(function(inventroy){
                    inventroy.date =  inventroy.year + "-" + inventroy.week
                })

            }

            if (resultInventroyPerMonth  && resultInventroyPerMonth.length > 0 ) {

                resultInventroyPerMonth.forEach(function(inventroy){
                    inventroy.date =  inventroy.year + "-" + inventroy.month
                })

            }

            res.status(200).json({
                byDaily : resultInventroyPerDay,
                byWeek : resultInventroyPerWeek,
                byMonth : resultInventroyPerMonth
            })
        }).catch(next);


    }).catch(next);





};
