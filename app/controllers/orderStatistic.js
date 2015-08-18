/**
 * Created by jinwyp on 8/6/15.
 */

var path = require('path');
var XLSX = require('xlsx');


function datenum(v, date1904) {
    if(date1904) v+=1462;
    var epoch = Date.parse(v);
    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}


function generateSheetFromArray (worksheet, arrayData, propertyList, headerLabelList){
    var totalRow = arrayData.length;
    var totalColumn = propertyList.length;

    var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};

    for (var column=0; column < totalColumn; column++){

        var cell = {v: propertyList[column] };
        if(cell.v == null) continue;
        var cell_ref = XLSX.utils.encode_cell({c:column,r:0});

        if(typeof cell.v === 'number') cell.t = 'n';
        else if(typeof cell.v === 'boolean') cell.t = 'b';
        else if(cell.v instanceof Date) {
            cell.t = 'n'; cell.z = XLSX.SSF._table[14];
            cell.v = datenum(cell.v);
        }
        else cell.t = 's';

        worksheet[cell_ref] = cell;

    }


    for (var row=0; row < totalRow; row++){
        for (var column=0; column < totalColumn; column++){

            if(range.s.r > row) range.s.r = row;
            if(range.s.c > column) range.s.c = column;
            if(range.e.r < row) range.e.r = row+10;
            if(range.e.c < column) range.e.c = column;


            var cell = {v: arrayData[row][propertyList[column]] };
            var tempCellString = "";
            var currentCell = arrayData[row][propertyList[column]];

            if ( Array.isArray(currentCell) && propertyList[column] ==='dishList' ){

                currentCell.forEach(function(dish){
                    if (dish.dish){
                        tempCellString = tempCellString + '(' + dish.dish.title.zh + ' * '+ dish.number + ' ), ';

                        dish.subDish.forEach(function(subDish){
                            tempCellString = tempCellString + '[-->' + subDish.dish.title.zh + ' * '+ subDish.number + ' ], '
                        });
                    }else{
                        console.log('------+++++++',dish.dish);
                        console.log('------+++++++',dish);
                        console.log('------+++++++',currentCell);
                    }

                });

                cell.v = tempCellString
            }else if (Object.prototype.toString.call(currentCell) == "[object Object]" && propertyList[column] ==='address'){
                //cell.v = JSON.stringify(arrayData[row][propertyList[column])

                for(var pro in currentCell ){
                    if (currentCell.hasOwnProperty(pro)) {
                        tempCellString = tempCellString + '(' + pro + ' : '+ currentCell[pro] + ' ), ';
                    }
                }
                cell.v = tempCellString
            }


            if(cell.v == null) continue;
            var cell_ref = XLSX.utils.encode_cell({c:column,r:row+1});

            //console.log("-------:", cell_ref, cell);

            if(typeof cell.v === 'number') cell.t = 'n';
            else if(typeof cell.v === 'boolean') cell.t = 'b';
            else if(cell.v instanceof Date) {
                cell.t = 'n'; cell.z = XLSX.SSF._table[14];
                cell.v = datenum(cell.v);
            }
            else cell.t = 's';

            worksheet[cell_ref] = cell;

        }
    }
    if(range.s.c < 10000000) worksheet['!ref'] = XLSX.utils.encode_range(range);
    return worksheet
}


exports.orderExportList = function(req, res, next) {

    models.order.validationGetOrderList(req.query);

    var workbook = XLSX.readFile(path.join(__dirname, '../../app/public/admin/src/excel/empty.xlsx'));
    /* DO SOMETHING WITH workbook HERE */

    var first_sheet_name = workbook.SheetNames[0];
    var first_worksheet = workbook.Sheets[first_sheet_name];

    //var first_cell= first_worksheet['A1'];
    //console.log (first_cell);

    req.query.limit = 10000;


    models.order.find({}).sort("-createdAt").skip (req.query.skip).limit (req.query.limit)
    .populate({path: 'dishList.dish', select: models.dish.fields()})
    .populate({path: 'dishList.subDish.dish', select: models.dish.fields()})
    .lean()
    .execAsync()
    .then(function(resultOrders){

        var propertyList = [
            'createdAt',
            '_id',
            'orderNumber',
            'user',
            'isSplitOrder',
            'isChildOrder',
            'childOrderList',
            'cookingType',

            'clientFrom',
            'payment',
            'paymentUsedCash',
            'isPaymentPaid',

            'status',

            'address',
            'deliveryDateTime',
            'deliveryDate',
            'deliveryTime',
            'deliveryDateType',

            'express',

            'promotionCode',
            'promotionDiscount',
            'coupon',
            'couponDiscount',
            'accountUsedDiscount',
            'credit',
            'dishesPrice',
            'freight',
            'totalPrice',

            'userComment',
            'csComment',

            'dishList'


        ];

        var newSheet = generateSheetFromArray(first_worksheet, resultOrders, propertyList);
        workbook.Sheets[first_sheet_name] = newSheet;

        XLSX.writeFile(workbook, path.join(__dirname, '../../app/public/admin/src/excel/output1.xlsx'));

        //console.log (path.join(__dirname, '../../app/public/admin/src/excel/output1.xlsx'));
        res.download(path.join(__dirname, '../../app/public/admin/src/excel/output1.xlsx'));

    }).catch(next);


};





exports.orderStatisticByAddress = function(req, res, next) {

    var pipeline = [];

    var pipelineExample = [

        { "$match":{
            "createdAt": { $gte: req.query.createdAt }
        }},

        { "$group": {
            "_id": '$address.address',
            "orderQuantity": { "$sum": 1 },
            "orderTotalDishesPrice": { "$sum": "$dishesPrice" },
            "orderTotalFreightPrice": { "$sum": "$freight" },
            "orderTotalPrice": { "$sum": "$totalPrice" }
        }},


        // Sorting pipeline
        { "$sort": { "orderTotalPrice": -1 } },


        // Optionally limit results
        { "$limit": 100 }

    ];

    var matchList = {};
    if (typeof req.query.createdAt !== 'undefined' && req.query.createdAt !== '') {
        matchList.createdAt = { $gte: new Date(req.query.createdAt)}
    }

    if (typeof req.query.cookingType !== 'undefined' && req.query.cookingType !== '') {
        matchList.cookingType = req.query.cookingType
    }

    if (typeof req.query.clientFrom !== 'undefined' && req.query.clientFrom !== '') {
        matchList.clientFrom = req.query.clientFrom
    }

    if (typeof req.query.status !== 'undefined' && req.query.status !== '') {
        matchList.status = req.query.status
    }

    pipeline.push(
        { "$match":matchList}
    );


    // Grouping pipeline
    pipeline.push (
        { "$group": {
            "_id": '$address.address',
            "orderQuantity": { "$sum": 1 },
            "orderList": { "$push": { "_id": "$_id", "orderNumber": "$orderNumber", "totalPrice": "$totalPrice" } },
            "orderTotalDishesPrice": { "$sum": "$dishesPrice" },
            "orderTotalFreightPrice": { "$sum": "$freight" },
            "orderTotalPrice": { "$sum": "$totalPrice" },
            "orderAveragePrice": { "$avg": "$totalPrice" }
        }}
    );

    // Sorting pipeline
    pipeline.push (
        { "$sort": { "orderTotalPrice": -1 } }
    );

    // Optionally limit results
    pipeline.push (
        { "$limit": 100 }
    );

    //console.log (pipeline);
    models.order.aggregateAsync( pipeline).then(function(resultOrder){
        res.status(200).json(resultOrder)
    }).catch(next)


};










exports.dishStatisticByStock = function(req, res, next) {

    var pipeline = [];
    var pipelineYesterday = [];
    var pipelinePerDay = [];
    var pipelinePerWeek = [];

    var matchList = {};
    if (typeof req.query.createdAt !== 'undefined' && req.query.createdAt !== '') {
        matchList.createdAt = { $gte: new Date(req.query.createdAt)}
    }

    if (typeof req.query.cookingType !== 'undefined' && req.query.cookingType !== '') {
        matchList.cookingType = req.query.cookingType
    }

    if (typeof req.query.sideDishType !== 'undefined' && req.query.sideDishType !== '') {
        matchList.sideDishType = req.query.sideDishType
    }

    if (typeof req.query.isPublished !== 'undefined' && req.query.isPublished !== '') {
        matchList.isPublished = req.query.isPublished
    }


    //pipeline.push(
    //    { "$match":matchList}
    //);


    // Grouping pipeline
    pipeline.push (
        { "$match":{
            "isPlus" : false,
            "remark": { $ne: "adminOperation" }
        }},

        { "$group": {
            "_id": '$dish',
            "dishSaleQuantity": { "$sum": "$quantity" },
            "dishList": { "$push": { "_id": "$dish", "dish": "$dish", "quantity": "$quantity", "user": "$user", "isPlus": "$isPlus" , "createdAt": "$createdAt"  } }
        }}
    );

    // Sorting pipeline
    pipeline.push (
        { "$sort": { "dishSaleQuantity": 1 } }
    );

    // Optionally limit results
    pipeline.push (
        { "$limit": 1000 }
    );


    timeNow = moment();
    today = moment(timeNow.clone().format("YYYY-MM-DD 00:00:00"));
    yesterday = today.clone().subtract(1, 'days');

    pipelineYesterday.push (
        { "$match":{
            "isPlus" : false,
            "createdAt": { "$gte": yesterday.toDate(), "$lt": today.toDate() },
            "remark": { $ne: "adminOperation" }
        }},

        { "$group": {
            "_id": '$dish',
            "dishSaleQuantity": { "$sum": "$quantity" },
            "dishList": { "$push": { "_id": "$dish", "dish": "$dish", "quantity": "$quantity", "user": "$user", "isPlus": "$isPlus" , "createdAt": "$createdAt"  } }
        }},

        { "$sort": { "dishSaleQuantity": 1 } },
        { "$limit": 1000 }
    );


    pipelinePerDay.push (
        { "$match":{
            "isPlus" : false
        }},

        { $project :{
            _id : 1,
            createdAt : 1,
            user : 1,
            dish : 1,
            quantity : 1,
            isPlus : 1,

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
            "dishList": { "$push": { "_id": "$dish", "dish": "$dish", "quantity": "$quantity", "user": "$user", "isPlus": "$isPlus" , "createdAt": "$createdAt"  } }
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
            "isPlus" : false
        }},

        { $project :{
            _id : 1,
            createdAt : 1,
            user : 1,
            dish : 1,
            quantity : 1,
            isPlus : 1,

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
            "dishList": { "$push": { "_id": "$dish", "dish": "$dish", "quantity": "$quantity", "user": "$user", "isPlus": "$isPlus" , "createdAt": "$createdAt"  } }
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


    var dishList =[];
    var dishHashList ={};
    var dishHashListYesterday ={};
    var dishHashListPerDay ={};
    var dishHashListPerWeek ={};

    var promiseList = [
        models.dish.find(matchList).lean().execAsync(),
        models.inventory.aggregateAsync( pipeline),
        models.inventory.aggregateAsync( pipelineYesterday),
        models.inventory.aggregateAsync( pipelinePerDay),
        models.inventory.aggregateAsync( pipelinePerWeek)
    ];

    Promise.all(promiseList).spread(function(resultDish, resultInventroy, resultInventroyYesterday, resultInventroyPerDay, resultInventroyPerWeek){
        if (resultDish && resultDish.length > 0 && resultInventroy.length > 0 && resultInventroyPerDay.length > 0) {
            //dishIdList = resultDish.map(function(dish){
            //    return dish._id.toString()
            //});


            resultInventroy.forEach(function(dishInventory){
                dishHashList[dishInventory._id.toString()] = dishInventory
            });

            resultInventroyYesterday.forEach(function(dishInventoryYesterday){
                dishHashListYesterday[dishInventoryYesterday._id.toString()] = dishInventoryYesterday
            });


            resultInventroyPerDay.forEach(function(dishInventoryPerDay){
                if (typeof dishHashListPerDay[dishInventoryPerDay.dish.toString()] === "undefined"){
                    dishHashListPerDay[dishInventoryPerDay.dish.toString()] = [];
                }
                dishHashListPerDay[dishInventoryPerDay.dish.toString()].push(dishInventoryPerDay)

            });

            resultInventroyPerWeek.forEach(function(dishInventoryPerWeek){
                if (typeof dishHashListPerWeek[dishInventoryPerWeek.dish.toString()] === "undefined"){
                    dishHashListPerWeek[dishInventoryPerWeek.dish.toString()] = [];
                }
                dishHashListPerWeek[dishInventoryPerWeek.dish.toString()].push(dishInventoryPerWeek)

            });


            resultDish.forEach(function(dishOne){

                if (typeof dishHashList[dishOne._id.toString()] !== "undefined"){

                    dishOne.totalSales = dishHashList[dishOne._id.toString()].dishSaleQuantity;
                    dishOne.totalInventory = dishHashList[dishOne._id.toString()];

                    dishOne.dailySales = dishHashListPerDay[dishOne._id.toString()];
                    dishOne.weekSales = dishHashListPerWeek[dishOne._id.toString()];
                }else {
                    dishOne.totalSales = 0;
                }


                if (typeof dishHashListYesterday[dishOne._id.toString()] !== "undefined"){
                    dishOne.yesterdaySales = dishHashListYesterday[dishOne._id.toString()].dishSaleQuantity;
                    dishOne.yesterdayInventory = dishHashListYesterday[dishOne._id.toString()];
                }else{
                    dishOne.yesterdaySales = 0;
                }



            });


            res.status(200).json(resultDish)

        }else{
            res.status(200).json([])
        }
    }).catch(next);



};


