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

    // 写表头第一行
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

    // 从第二行写入内容
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
                        tempCellString = tempCellString + ' ' + pro + ' : '+ currentCell[pro] + ' , ';
                    }
                }
                cell.v = tempCellString
            }else if (Object.prototype.toString.call(currentCell) == "[object Object]" && propertyList[column] ==='express'){
                //cell.v = JSON.stringify(arrayData[row][propertyList[column])

                for(var pro in currentCell ){
                    if (currentCell.hasOwnProperty(pro)) {
                        if (Object.prototype.toString.call(currentCell[pro]) == "[object Object]"){
                            tempCellString = tempCellString + ' ' + pro + ' : '+ currentCell[pro].zh + ' , ';
                        }else{
                            tempCellString = tempCellString + ' ' + pro + ' : '+ currentCell[pro] + ' , ';
                        }

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



function generateOrderInternalSheetFromArray(worksheet, arrayData){
    var totalRow = arrayData.length - 1;
    var currentRow = 1;

    var range = {s: {c:0, r:0}, e: {c:10, r:200000 }};

    for (var row=0; row <= totalRow; row++){

        var cellOrderNumber = {v: arrayData[row].orderNumber, t:"s" };
        var cell_refOrderNumber = XLSX.utils.encode_cell({c:0,r:currentRow});
        worksheet[cell_refOrderNumber] = cellOrderNumber;

        currentRow = currentRow + 1;
        var tempPerson = arrayData[row].address.contactPerson + " - " + arrayData[row].address.mobile + " " + arrayData[row].address.city + " / " + arrayData[row].address.district + " / " + arrayData[row].address.street + " / " + arrayData[row].address.address + " / 距离:" + arrayData[row].address.distanceFrom + "米";
        var cellPerson = {v: tempPerson, t:"s" };
        var cell_refPerson = XLSX.utils.encode_cell({c:0,r:currentRow});
        worksheet[cell_refPerson] = cellPerson;

        var tempDishList = arrayData[row].dishList;
        for (var rowdish=0; rowdish <= tempDishList.length-1; rowdish++){

            currentRow = currentRow + 1;
            var tempDishName = tempDishList[rowdish].dish.title.zh;
            var cellDishName = {v: tempDishName, t:"s" };
            var cell_refDishName = XLSX.utils.encode_cell({c:0,r:currentRow});
            worksheet[cell_refDishName] = cellDishName;

            var cellDishNumber = {v: "*" + tempDishList[rowdish].number.toString(), t:"s" };
            var cell_refDishNumber = XLSX.utils.encode_cell({c:1,r:currentRow});
            worksheet[cell_refDishNumber] = cellDishNumber;


            var language = '中文';
            if (arrayData[row].language === 'en'){
                language = '英文';
            }

            var cellLanguage = {v: language, t:"s" };
            var cell_refLanguage = XLSX.utils.encode_cell({c:2,r:currentRow});
            worksheet[cell_refLanguage] = cellLanguage;


            var packageType = '';
            console.log(arrayData[row].packageType);
            if (arrayData[row].packageType === 'foambox'){
                packageType = '泡沫箱';
            }
            if (arrayData[row].packageType === 'paperbox'){
                packageType = '纸盒箱';
            }

            var cellPackageType = {v: packageType, t:"s" };
            var cell_refPackageType = XLSX.utils.encode_cell({c:3,r:currentRow});
            worksheet[cell_refPackageType] = cellPackageType;


            for (var rowsubdish=0; rowsubdish <= tempDishList[rowdish].subDish.length-1; rowsubdish++){
                currentRow = currentRow + 1;
                var tempSubDishName = "---> " + tempDishList[rowdish].subDish[rowsubdish].dish.title.zh;
                var cellSubDishName = {v: tempSubDishName, t:"s" };
                var cell_refSubDishName = XLSX.utils.encode_cell({c:0,r:currentRow});
                worksheet[cell_refSubDishName] = cellSubDishName;

                var cellSubDishNumber = {v: "*" + tempDishList[rowdish].subDish[rowsubdish].number.toString(), t:"s" };
                var cell_refSubDishNumber = XLSX.utils.encode_cell({c:1,r:currentRow});
                worksheet[cell_refSubDishNumber] = cellSubDishNumber;
            }

        }

        currentRow = currentRow + 3

    }
    worksheet['!ref'] = XLSX.utils.encode_range(range);

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







exports.orderPrintShippingList = function(req, res, next) {

    orderIdList = [];
    console.log(req.query.idList);
    if (req.query.idList){
        orderIdList = JSON.parse(req.query.idList)
    }

    if (libs.validator.isLength(req.params.orderId, 24, 24) ){
        orderIdList.push(req.params.orderId)
    }

    models.order.find({_id : {$in: orderIdList }}).populate({path: 'dishList.dish', select: models.dish.fields()}).populate({path: 'dishList.subDish.dish', select: models.dish.fields()}).execAsync()
        .then(function(resultOrderList){
            if (resultOrderList.length > 0){
                resultOrderList.forEach(function(order){
                    order.createdAtNew = moment(order.createdAt).format("ddd, YYYY-MM-D H:mm:ss")
                });
                res.render('admin/ship_list.html', {title: 'XinWeiCook', orderList:resultOrderList})
            }else{
                res.send('ok')
            }


        })
        .catch(next)


};







exports.orderExportInternalList = function(req, res, next) {
    models.order.validationGetOrderList(req.query);


    var idList = [];
    if (req.query.idList){
        idList = JSON.parse(req.query.idList)
    }


    var query = { $and: [] };

    if (Array.isArray(idList)){

        if (idList.length > 0){
            query.$and.push({_id : { $in: idList} }) ;
        }
    }



    if (typeof req.query.createdAt !== 'undefined' && req.query.createdAt !== '') {
        query.$and.push({createdAt : { $gte: new Date(req.query.createdAt)} }) ;
    }

    if (typeof req.query.cookingType !== 'undefined' && req.query.cookingType !== '') {
        query.$and.push( {cookingType : req.query.cookingType});
    }

    if (typeof req.query.clientFrom !== 'undefined' && req.query.clientFrom !== '') {
        query.$and.push( {clientFrom : req.query.clientFrom});
    }

    if (typeof req.query.deliveryDateType !== 'undefined' && req.query.deliveryDateType !== '') {
        query.$and.push( {deliveryDateType : req.query.deliveryDateType});
    }

    if (typeof req.query.status !== 'undefined' && req.query.status !== '') {
        query.$and.push( {status : req.query.status});
    }

    if (query.$and.length === 0 ){
        query ={}
    }

    var workbook = XLSX.readFile(path.join(__dirname, '../../app/public/admin/src/excel/empty.xlsx'));
    /* DO SOMETHING WITH workbook HERE */

    var first_sheet_name = workbook.SheetNames[0];
    var first_worksheet = workbook.Sheets[first_sheet_name];

    //var first_cell= first_worksheet['A1'];
    //console.log (first_cell);

    req.query.limit = 10000;

    models.order.find(query).sort("-createdAt").skip(req.query.skip).limit(req.query.limit)
        .populate({path: 'dishList.dish', select: models.dish.fields()})
        .populate({path: 'dishList.subDish.dish', select: models.dish.fields()})
        .lean()
        .execAsync()
        .then(function(resultOrders){
            var newSheet = generateOrderInternalSheetFromArray(first_worksheet, resultOrders);
            workbook.Sheets[first_sheet_name] = newSheet;

            XLSX.writeFile(workbook, path.join(__dirname, '../../app/public/admin/src/excel/output2.xlsx'));

            res.download(path.join(__dirname, '../../app/public/admin/src/excel/output2.xlsx'));
//            res.send(resultOrders)
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

    if (typeof req.query.deliveryDateType !== 'undefined' && req.query.deliveryDateType !== '') {
        matchList.deliveryDateType = req.query.deliveryDateType
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

            "saleQuantity": { "$sum": 1 },
            "saleTotalPrice": { "$sum": "$totalPrice" },
            "saleAvgTotalPrice": { "$avg": "$totalPrice" },

            "saleDishesPrice": { "$sum": "$dishesPrice" },
            "saleAvgDishesPrice": { "$avg": "$dishesPrice" },

            "saleFreight": { "$sum": "$freight" },
            "saleAvgFreight": { "$avg": "$freight" },

            "salePromotionDiscount": { "$sum": "$promotionDiscount" },
            "saleAvgPromotionDiscount": { "$avg": "$promotionDiscount" },

            "saleCouponDiscount": { "$sum": "$couponDiscount" },
            "saleAvgCouponDiscount": { "$avg": "$couponDiscount" },

            "saleAccountUsedDiscount": { "$sum": "$accountUsedDiscount" },
            "saleAvgAccountUsedDiscount": { "$avg": "$accountUsedDiscount" },

            "orderList": { "$push": { "_id": "$_id", "createdAt": "$createdAt", "user": "$user", "orderNumber": "$orderNumber", "totalPrice": "$totalPrice"   } }

        }}
    );

    // Sorting pipeline
    pipeline.push (
        { "$sort": { "saleTotalPrice": -1 } }
    );

    // Optionally limit results
    pipeline.push (
        { "$limit": 200 }
    );

    //console.log (pipeline);
    models.order.aggregateAsync( pipeline).then(function(resultOrder){
        res.status(200).json(resultOrder)
    }).catch(next)


};





exports.orderStatisticByAddressAuto = function(req, res, next) {

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

    if (typeof req.query.deliveryDateType !== 'undefined' && req.query.deliveryDateType !== '') {
        matchList.deliveryDateType = req.query.deliveryDateType
    }

    if (typeof req.query.status !== 'undefined' && req.query.status !== '') {
        matchList.status = req.query.status
    }

    var pipeline = [];

    pipeline.push(
        { "$match":matchList}
    );



    // Grouping pipeline
    pipeline.push (
        { "$group": {
            "_id": '$address.street',
            "saleQuantity": { "$sum": 1 },
            "saleTotalPrice": { "$sum": "$totalPrice" },
            "saleAvgTotalPrice": { "$avg": "$totalPrice" },

            "saleDishesPrice": { "$sum": "$dishesPrice" },
            "saleAvgDishesPrice": { "$avg": "$dishesPrice" },

            "saleFreight": { "$sum": "$freight" },
            "saleAvgFreight": { "$avg": "$freight" },

            "salePromotionDiscount": { "$sum": "$promotionDiscount" },
            "saleAvgPromotionDiscount": { "$avg": "$promotionDiscount" },

            "saleCouponDiscount": { "$sum": "$couponDiscount" },
            "saleAvgCouponDiscount": { "$avg": "$couponDiscount" },

            "saleAccountUsedDiscount": { "$sum": "$accountUsedDiscount" },
            "saleAvgAccountUsedDiscount": { "$avg": "$accountUsedDiscount" },

            "orderList": { "$push": { "_id": "$_id", "createdAt": "$createdAt", "user": "$user", "orderNumber": "$orderNumber", "totalPrice": "$totalPrice"   } }
        }}
    );

    // Sorting pipeline
    pipeline.push (
        { "$sort": { "saleTotalPrice": -1 } }
    );

    // Optionally limit results
    pipeline.push (
        { "$limit": 200 }
    );

    //console.log (pipeline);
    models.order.aggregateAsync( pipeline).then(function(resultOrder){
        res.status(200).json(resultOrder)
    }).catch(next)


};









exports.orderDailySales = function(req, res, next) {

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

    if (typeof req.query.deliveryDateType !== 'undefined' && req.query.deliveryDateType !== '') {
        matchList.deliveryDateType = req.query.deliveryDateType
    }

    if (typeof req.query.status !== 'undefined' && req.query.status !== '') {
        matchList.status = req.query.status
    }

    var pipeline = [];

    pipeline.push(
        { "$match":matchList}
    );


    pipeline.push (
        { $project :{
            _id : 1,
            createdAt : 1,
            user : 1,
            orderNumber: 1,
            isSplitOrder : 1,
            isChildOrder : 1,
            childOrderList : 1,
            cookingType : 1,

            clientFrom : 1,
            payment : 1,
            paymentUsedCash : 1,
            isPaymentPaid : 1,

            deliveryDateTime : 1,


            promotionCode : 1,
            promotionDiscount : 1,
            coupon : 1,
            couponDiscount : 1,
            accountUsedDiscount : 1,

            dishesPrice : 1,
            freight : 1,
            totalPrice : 1,

            packageType : 1,


            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
            hour: { $hour: "$createdAt" },
            minutes: { $minute: "$createdAt" },
            dayOfYear: { $dayOfYear: "$createdAt" },
            dayOfWeek: { $dayOfWeek: "$createdAt" },
            week: { $week: "$createdAt" },

            "hour" : {  "$hour" : "$createdAt" },
            "minute" : {"$minute" : "$createdAt"},
            "second" : { "$second" : "$createdAt"},
            "millisecond" : {"$millisecond" : "$createdAt"}
        }},


        { $project :{
            _id : 1,
            createdAt : 1,
            user : 1,
            orderNumber: 1,
            isSplitOrder : 1,
            isChildOrder : 1,
            childOrderList : 1,
            cookingType : 1,

            clientFrom : 1,
            payment : 1,
            paymentUsedCash : 1,
            isPaymentPaid : 1,

            deliveryDateTime : 1,


            promotionCode : 1,
            promotionDiscount : 1,
            coupon : 1,
            couponDiscount : 1,
            accountUsedDiscount : 1,

            dishesPrice : 1,
            freight : 1,
            totalPrice : 1,

            packageType : 1,


            year: 1,
            month: 1,
            day: 1,
            hour: 1,
            minutes: 1,
            dayOfYear: 1,
            dayOfWeek: 1,
            week: 1,

            "hour" : 1,
            "minute" : 1,
            "second" : 1,
            "millisecond" : 1,

            saleDate : {"$subtract" : [ "$createdAt",
                {"$add" : [ "$millisecond",
                    {"$multiply" : ["$second", 1000]},
                    {"$multiply" : ["$minute",60,1000]},
                    {"$multiply" : ["$hour", 60, 60,1000]}
                ]}
            ]}

        }}
    );


    // Grouping pipeline
    pipeline.push (
        { "$group": {
//            "_id": {dish:'$dish', day : "$day", month : "$month", year : "$year"},
            "_id":  "$saleDate",

            "saleQuantity": { "$sum": 1 },
            "saleTotalPrice": { "$sum": "$totalPrice" },
            "saleAvgTotalPrice": { "$avg": "$totalPrice" },
            "saleDishesPrice": { "$sum": "$dishesPrice" },
            "saleAvgDishesPrice": { "$avg": "$dishesPrice" },
            "saleFreight": { "$sum": "$freight" },
            "saleAvgFreight": { "$avg": "$freight" },

            "salePromotionDiscount": { "$sum": "$promotionDiscount" },
            "saleAvgPromotionDiscount": { "$avg": "$promotionDiscount" },

            "saleCouponDiscount": { "$sum": "$couponDiscount" },
            "saleAvgCouponDiscount": { "$avg": "$couponDiscount" },

            "saleAccountUsedDiscount": { "$sum": "$accountUsedDiscount" },
            "saleAvgAccountUsedDiscount": { "$avg": "$accountUsedDiscount" },

            "orderList": { "$push": { "_id": "$_id", "createdAt": "$createdAt", "user": "$user", "orderNumber": "$orderNumber", "totalPrice": "$totalPrice"   } }
        }},
        { $project :{
            _id : 0,
            "date" : "$_id",
            "saleQuantity": 1,
            "saleTotalPrice": 1,
            "saleAvgTotalPrice": 1,
            "saleDishesPrice": 1,
            "saleAvgDishesPrice": 1,
            "saleFreight": 1,
            "saleAvgFreight": 1,

            "salePromotionDiscount": 1,
            "saleAvgPromotionDiscount": 1,

            "saleCouponDiscount": 1,
            "saleAvgCouponDiscount": 1,

            "saleAccountUsedDiscount": 1,
            "saleAvgAccountUsedDiscount": 1,



            "orderList": 1

        }},

        { "$sort": { "date" : 1} },
        { "$limit": 1000 }
    );






    //console.log (pipeline);
    models.order.aggregateAsync( pipeline).then(function(resultOrder){
        res.status(200).json(resultOrder)
    }).catch(next)
};










exports.orderHourSales = function(req, res, next) {

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

    if (typeof req.query.deliveryDateType !== 'undefined' && req.query.deliveryDateType !== '') {
        matchList.deliveryDateType = req.query.deliveryDateType
    }

    if (typeof req.query.status !== 'undefined' && req.query.status !== '') {
        matchList.status = req.query.status
    }

    var pipeline = [];

    pipeline.push(
        { "$match":matchList}
    );


    pipeline.push (
        { $project :{
            _id : 1,
            createdAt : 1,
            user : 1,
            orderNumber: 1,
            isSplitOrder : 1,
            isChildOrder : 1,
            childOrderList : 1,
            cookingType : 1,

            clientFrom : 1,
            payment : 1,
            paymentUsedCash : 1,
            isPaymentPaid : 1,

            deliveryDateTime : 1,


            promotionCode : 1,
            promotionDiscount : 1,
            coupon : 1,
            couponDiscount : 1,
            accountUsedDiscount : 1,

            dishesPrice : 1,
            freight : 1,
            totalPrice : 1,

            packageType : 1,


            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
            hour: { $hour: "$createdAt" },
            minutes: { $minute: "$createdAt" },
            dayOfYear: { $dayOfYear: "$createdAt" },
            dayOfWeek: { $dayOfWeek: "$createdAt" },
            week: { $week: "$createdAt" },

            "hour" : {  "$hour" : "$createdAt" },
            "minute" : {"$minute" : "$createdAt"},
            "second" : { "$second" : "$createdAt"},
            "millisecond" : {"$millisecond" : "$createdAt"}
        }},


        { $project :{
            _id : 1,
            createdAt : 1,
            user : 1,
            orderNumber: 1,
            isSplitOrder : 1,
            isChildOrder : 1,
            childOrderList : 1,
            cookingType : 1,

            clientFrom : 1,
            payment : 1,
            paymentUsedCash : 1,
            isPaymentPaid : 1,

            deliveryDateTime : 1,


            promotionCode : 1,
            promotionDiscount : 1,
            coupon : 1,
            couponDiscount : 1,
            accountUsedDiscount : 1,

            dishesPrice : 1,
            freight : 1,
            totalPrice : 1,

            packageType : 1,


            year: 1,
            month: 1,
            day: 1,
            hour: 1,
            minutes: 1,
            dayOfYear: 1,
            dayOfWeek: 1,
            week: 1,

            "hour" : 1,
            "minute" : 1,
            "second" : 1,
            "millisecond" : 1,

            saleDate : {"$subtract" : [ "$createdAt",
                {"$add" : [ "$millisecond",
                    {"$multiply" : ["$second", 1000]},
                    {"$multiply" : ["$minute",60,1000]},
                    {"$multiply" : ["$hour", 60, 60,1000]}
                ]}
            ]}

        }}
    );


    // Grouping pipeline
    pipeline.push (
        { "$group": {
//            "_id": {dish:'$dish', day : "$day", month : "$month", year : "$year"},
            "_id":  "$hour",

            "saleQuantity": { "$sum": 1 },
            "saleTotalPrice": { "$sum": "$totalPrice" },
            "saleAvgTotalPrice": { "$avg": "$totalPrice" },
            "saleDishesPrice": { "$sum": "$dishesPrice" },
            "saleAvgDishesPrice": { "$avg": "$dishesPrice" },
            "saleFreight": { "$sum": "$freight" },
            "saleAvgFreight": { "$avg": "$freight" },

            "salePromotionDiscount": { "$sum": "$promotionDiscount" },
            "saleAvgPromotionDiscount": { "$avg": "$promotionDiscount" },

            "saleCouponDiscount": { "$sum": "$couponDiscount" },
            "saleAvgCouponDiscount": { "$avg": "$couponDiscount" },

            "saleAccountUsedDiscount": { "$sum": "$accountUsedDiscount" },
            "saleAvgAccountUsedDiscount": { "$avg": "$accountUsedDiscount" },

            "orderList": { "$push": { "_id": "$_id", "createdAt": "$createdAt", "user": "$user", "orderNumber": "$orderNumber", "totalPrice": "$totalPrice"   } }
        }},
        { $project :{
            _id : 0,
            "hour" : "$_id",
            "saleQuantity": 1,
            "saleTotalPrice": 1,
            "saleAvgTotalPrice": 1,
            "saleDishesPrice": 1,
            "saleAvgDishesPrice": 1,
            "saleFreight": 1,
            "saleAvgFreight": 1,

            "salePromotionDiscount": 1,
            "saleAvgPromotionDiscount": 1,

            "saleCouponDiscount": 1,
            "saleAvgCouponDiscount": 1,

            "saleAccountUsedDiscount": 1,
            "saleAvgAccountUsedDiscount": 1,



            "orderList": 1

        }},

        { "$sort": { "hour" : 1} },
        { "$limit": 1000 }
    );






    //console.log (pipeline);
    models.order.aggregateAsync( pipeline).then(function(resultOrder){
        res.status(200).json(resultOrder)
    }).catch(next)
};






























exports.dishDailySales = function(req, res, next) {

    var query = {};

    if (typeof req.query._id !== 'undefined' && req.query._id !== '') {
        query._id = req.query._id;
    }

    if (typeof req.query.createdAt !== 'undefined' && req.query.createdAt !== '') {
        query.createdAt = { $gte: new Date(req.query.createdAt)}
    }

    if (typeof req.query.cookingType !== 'undefined' && req.query.cookingType !== '') {
        query.cookingType = req.query.cookingType
    }

    if (typeof req.query.sideDishType !== 'undefined' && req.query.sideDishType !== '') {
        query.sideDishType = req.query.sideDishType
    }

    if (typeof req.query.isPublished !== 'undefined' && req.query.isPublished !== '') {
        query.isPublished = req.query.isPublished
    }

    var dishIdList = [];
    var dishHash = {};
    var pipelinePerDay = [];

    models.dish.find(query).lean().execAsync().then(function(resultDishList) {


        dishIdList = resultDishList.map(function (dish) {
            return ObjectId(dish._id.toString());
        });

        resultDishList.forEach(function(dish){
            dishHash[dish._id.toString()] = dish
        });


        pipelinePerDay.push (
            { "$match":{
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

            { "$sort": { "year" : -1, "month": -1, "day": -1 , "dishSaleQuantity":1 } },
            { "$limit": 1000 }
        );


        if (typeof req.query.searchDateFrom !== 'undefined' && req.query.searchDateFrom !== '') {
            pipelinePerDay[0]["$match"].createdAt = { $gte: new Date(req.query.searchDateFrom)}
        }

        models.inventory.aggregateAsync( pipelinePerDay).then(function(resultInventroyPerDay){

            if (resultInventroyPerDay  && resultInventroyPerDay.length > 0 ) {

                resultInventroyPerDay.forEach(function(inventroy){
                    inventroy.dishname = dishHash[inventroy.dish.toString()].title.zh;
                    inventroy.cookingType = dishHash[inventroy.dish.toString()].cookingType;
                    inventroy.sideDishType = dishHash[inventroy.dish.toString()].sideDishType;
                    inventroy.priceOriginal = dishHash[inventroy.dish.toString()].priceOriginal;
                    inventroy.isPublished = dishHash[inventroy.dish.toString()].isPublished;
                    inventroy.date =  inventroy.year + "-" + inventroy.month + "-" + inventroy.day;
                })

            }

            res.status(200).json(resultInventroyPerDay)

        }).catch(next);

    }).catch(next);





};








exports.dishDailySalesChart = function(req, res, next) {

    var query = {};

    if (typeof req.query._id !== 'undefined' && req.query._id !== '') {
        query._id = req.query._id;
    }

    if (typeof req.query.createdAt !== 'undefined' && req.query.createdAt !== '') {
        query.createdAt = { $gte: new Date(req.query.createdAt)}
    }

    if (typeof req.query.cookingType !== 'undefined' && req.query.cookingType !== '') {
        query.cookingType = req.query.cookingType
    }

    if (typeof req.query.sideDishType !== 'undefined' && req.query.sideDishType !== '') {
        query.sideDishType = req.query.sideDishType
    }

    if (typeof req.query.isPublished !== 'undefined' && req.query.isPublished !== '') {
        query.isPublished = req.query.isPublished
    }


    var dishIdList = [];
    var pipelinePerDay = [];
    var pipelinePerWeek = [];

    models.dish.find(query).lean().execAsync().then(function(resultDishList){
        dishIdList = resultDishList.map(function(dish){
            return  ObjectId(dish._id.toString());
        });


        pipelinePerDay.push (
            { "$match":{
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
                "dishList": { "$push": { "_id": "$dish", "dish": "$dish", "user": "$user", "order": "$order", "quantity": "$quantity",  "isPlus": "$isPlus" , "createdAt": "$createdAt", "remark": "$remark"  } }
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
            { "$limit": 1000 }
        );



        pipelinePerWeek.push (
            { "$match":{
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
                "_id": { week : "$week"},

                "dishSaleQuantity": { "$sum": "$quantity" },
                "dishList": { "$push": { "_id": "$dish", "dish": "$dish", "user": "$user", "order": "$order", "quantity": "$quantity",  "isPlus": "$isPlus" , "createdAt": "$createdAt", "remark": "$remark"  } }
            }},

            { $project :{
                _id : 0,
                "week" : "$_id.week",
                "dishSaleQuantity": 1,
                "dishList": 1
            }},

            { "$sort": { "week": 1 } },
            { "$limit": 1000 }
        );


        if (typeof req.query.searchDateFrom !== 'undefined' && req.query.searchDateFrom !== '') {
            pipelinePerDay[0]["$match"].createdAt = { $gte: new Date(req.query.searchDateFrom)};
            pipelinePerWeek[0]["$match"].createdAt = { $gte: new Date(req.query.searchDateFrom)};
        }

        var promiseList = [
            models.inventory.aggregateAsync( pipelinePerDay),
            models.inventory.aggregateAsync( pipelinePerWeek)
        ];

        Promise.all(promiseList).spread(function( resultInventroyPerDay, resultInventroyPerWeek){

            if (resultInventroyPerDay  && resultInventroyPerDay.length > 0 ) {

                resultInventroyPerDay.forEach(function(inventroy){
                    inventroy.date =  inventroy.year + "-" + inventroy.month + "-" + inventroy.day
                })

            }

            res.status(200).json({
                byDaily : resultInventroyPerDay,
                byWeek : resultInventroyPerWeek
            })
        }).catch(next);


    }).catch(next);





};










exports.dishStatisticByStock = function(req, res, next) {

    var query = {};

    if (typeof req.query._id !== 'undefined' && req.query._id !== '') {
        query._id = req.query._id;
    }

    if (typeof req.query.createdAt !== 'undefined' && req.query.createdAt !== '') {
        query.createdAt = { $gte: new Date(req.query.createdAt)};
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
    var limit =  { "$limit": 1000 };

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



    // Grouping pipeline
    pipelineTotal.push (
        { "$match":{
            "isPlus" : false,
            "remark": { $ne: "adminOperation" }
        }}, group, sort, limit
    );

    pipelineToday.push (
        { "$match":{
            "isPlus" : false,
            "createdAt": { "$gte": today.toDate() },
            "remark": { $ne: "adminOperation" }
        }}, group, sort, limit
    );

    pipelineYesterday.push (
        { "$match":{
            "isPlus" : false,
            "createdAt": { "$gte": yesterday.toDate(), "$lt": today.toDate() },
            "remark": { $ne: "adminOperation" }
        }}, group, sort, limit
    );

    pipelineDayBeforeYesterday.push (
        { "$match":{
            "isPlus" : false,
            "createdAt": { "$gte": dayBeforeYesterday2.toDate(), "$lt": yesterday.toDate() },
            "remark": { $ne: "adminOperation" }
        }}, group, sort, limit
    );

    pipelineLast3Day.push (
        { "$match":{
            "isPlus" : false,
            "createdAt": { "$gte": last3Day.toDate(), "$lt": today.toDate() },
            "remark": { $ne: "adminOperation" }
        }}, group, sort, limit
    );

    pipelineLast7Day.push (
        { "$match":{
            "isPlus" : false,
            "createdAt": { "$gte": last7Day.toDate(), "$lt": today.toDate() },
            "remark": { $ne: "adminOperation" }
        }}, group, sort, limit
    );

    pipelineLast15Day.push (
        { "$match":{
            "isPlus" : false,
            "createdAt": { "$gte": last15Day.toDate(), "$lt": today.toDate() },
            "remark": { $ne: "adminOperation" }
        }}, group, sort, limit
    );

    pipelineLast30Day.push (
        { "$match":{
            "isPlus" : false,
            "createdAt": { "$gte": last30Day.toDate(), "$lt": today.toDate() },
            "remark": { $ne: "adminOperation" }
        }}, group, sort, limit
    );

    pipelineLast60Day.push (
        { "$match":{
            "isPlus" : false,
            "createdAt": { "$gte": last60Day.toDate(), "$lt": today.toDate() },
            "remark": { $ne: "adminOperation" }
        }}, group, sort, limit
    );

    pipelineLast90Day.push (
        { "$match":{
            "isPlus" : false,
            "createdAt": { "$gte": last90Day.toDate(), "$lt": today.toDate() },
            "remark": { $ne: "adminOperation" }
        }}, group, sort, limit
    );


    pipelinePerDay.push (
        { "$match":{
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
                dishHashListTotal[dishInventory._id.toString()] = dishInventory
            });

            resultInventroyToday.forEach(function(dishInventory){
                dishHashListToday[dishInventory._id.toString()] = dishInventory
            });

            resultInventroyYesterday.forEach(function(dishInventoryYesterday){
                dishHashListYesterday[dishInventoryYesterday._id.toString()] = dishInventoryYesterday
            });

            resultInventroyDayBeforeYesterday.forEach(function(dishInventory){
                dishHashListDayBeforeYesterday[dishInventory._id.toString()] = dishInventory
            });

            resultInventroyLast3Day.forEach(function(dishInventory){
                dishHashListLast3Day[dishInventory._id.toString()] = dishInventory
            });

            resultInventroyLast7Day.forEach(function(dishInventory){
                dishHashListLast7Day[dishInventory._id.toString()] = dishInventory
            });

            resultInventroyLast15Day.forEach(function(dishInventory){
                dishHashListLast15Day[dishInventory._id.toString()] = dishInventory
            });

            resultInventroyLast30Day.forEach(function(dishInventory){
                dishHashListLast30Day[dishInventory._id.toString()] = dishInventory
            });

            resultInventroyLast60Day.forEach(function(dishInventory){
                dishHashListLast60Day[dishInventory._id.toString()] = dishInventory
            });

            resultInventroyLast90Day.forEach(function(dishInventory){
                dishHashListLast90Day[dishInventory._id.toString()] = dishInventory
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


            res.status(200).json(resultDish)

        }else{
            res.status(200).json([])
        }
    }).catch(next);



};


