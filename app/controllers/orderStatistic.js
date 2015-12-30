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

            if(propertyList[column] == '_id'){
                console.log("-------", arrayData[row][propertyList[column]]);
            }

            var cell = {v: arrayData[row][propertyList[column]] };
            var tempCellString = "";
            var currentCell = arrayData[row][propertyList[column]];

            if ( Array.isArray(currentCell) && propertyList[column] ==='dishList' ){

                currentCell.forEach(function(dish){
                    if (dish.dish){

                        tempCellString = tempCellString + '(' + dish.dish.title.zh + ' * '+ dish.number + ' ), ';

                        dish.subDish.forEach(function(subDish){


                            if ( subDish.dish != null){
                                tempCellString = tempCellString + '[-->' + subDish.dish.title.zh + ' * '+ subDish.number + ' ], ';
                            }else{
                                console.log("---------------", subDish);
                            }

                        });



                    }else{
                        //console.log('------+++++++',dish.dish);
                        //console.log('------+++++++',dish);
                        //console.log('------+++++++',currentCell);
                    }

                });

                cell.v = tempCellString;
            }else if (Object.prototype.toString.call(currentCell) == "[object Object]" && propertyList[column] ==='address'){
                //cell.v = JSON.stringify(arrayData[row][propertyList[column])

                for(var pro in currentCell ){
                    if (currentCell.hasOwnProperty(pro)) {
                        tempCellString = tempCellString + ' ' + pro + ' : '+ currentCell[pro] + ' , ';
                    }
                }
                cell.v = tempCellString;
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
                cell.v = tempCellString;
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
    return worksheet;
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

            if (typeof tempDishList[rowdish].dish.title === 'undefined'){
                logger.error(tempDishList[rowdish].dish);
            }

            var tempDishName = tempDishList[rowdish].dish.title.zh || '已删除菜品';
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

    req.query.limit = 20000;


    models.order.find({}).skip (req.query.skip).limit (req.query.limit)
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



exports.orderList = function(req, res, next) {


    models.order.find({}).sort("-createdAt").limit (400).populate({path: 'dishList.dish', select: models.dish.fields()}).populate({path: 'dishList.subDish.dish', select: models.dish.fields()}).execAsync().then(function(resultOrderList){

        res.send(resultOrderList);

    })
    .catch(next);

};





exports.orderListByAdmin = function (req, res, next) {
    // 获取员工福利所有订单

    var userIdList = [];

    models.user.findAsync({group : {$in:["admin", "cs", "employee"]} }).then(function(resultUserList){
        if (resultUserList.length > 0){
            userIdList = resultUserList.map(function(user) {
                return user._id.toString();
            });
        }

        return models.order.find({user: {$in:userIdList}, status:{$in:['paid', 'shipped', 'finished']}}).sort("-createdAt").execAsync();
    })
    .then(function(orders){
        res.json(orders);
    })
    .catch(next);

};








exports.orderPrintShippingList = function(req, res, next) {

    var orderIdList = [];
    var pageType = req.query.pageType || 'a4';

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
                res.render('admin/ship_list.html', {title: 'XinWeiCook', orderList:resultOrderList, pageType: pageType})
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

    req.query.limit = 1000;
    req.query.skip = 0;

    models.order.find(query).sort("-createdAt").skip(req.query.skip).limit(req.query.limit)
        .populate({path: 'dishList.dish', select: models.dish.fields()})
        .populate({path: 'dishList.subDish.dish', select: models.dish.fields()})
        .lean()
        .execAsync()
        .then(function(resultOrders){
            logger.error("internal length:",resultOrders.length);
            if (resultOrders.length > 0){
                var newSheet = generateOrderInternalSheetFromArray(first_worksheet, resultOrders);
                workbook.Sheets[first_sheet_name] = newSheet;

                XLSX.writeFile(workbook, path.join(__dirname, '../../app/public/admin/src/excel/output2.xlsx'));

                res.download(path.join(__dirname, '../../app/public/admin/src/excel/output2.xlsx'));
            }else{
                res.send(resultOrders)
            }


        }).catch(next);


};
















exports.orderStatisticByAddress = function(req, res, next) {

    var pipeline = [];

    var matchList = {};

    if (typeof req.query.warehouse !== 'undefined' && req.query.warehouse !== '') {
        matchList.warehouse = ObjectId(req.query.warehouse.toString())
    }


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

            "orderList": { "$push": { "_id": "$_id", "createdAt": "$createdAt", "user": "$user", "orderNumber": "$orderNumber", "totalPrice": "$totalPrice" , "addressContactPerson": "$address.contactPerson", "addressContactMobile": "$address.mobile", "addressStreet": "$address.street", "addressAddress": "$address.address", "addressDistanceFrom": "$address.distanceFrom", "addressLatitude": "$address.geoLatitude", "addressLongitude": "$address.geoLongitude" } }

        }}
    );

    // Sorting pipeline
    pipeline.push (
        { "$sort": { "saleTotalPrice": -1 } }
    );

    // Optionally limit results
    pipeline.push (
        { "$limit": 500 }
    );

    //console.log (pipeline);
    models.order.aggregateAsync( pipeline).then(function(resultOrder){

        var totalAllPrice = 0;

        if (resultOrder.length > 0){
            totalAllPrice = resultOrder.reduce(function(previous, order) {
                return previous + order.saleTotalPrice;
            }, 0);



            resultOrder[0].totalAllPrice = totalAllPrice;

            resultOrder.forEach(function(order){
                order.totalPricePercent = order.saleTotalPrice / totalAllPrice
            });

        }



        res.status(200).json(resultOrder)
    }).catch(next)


};





exports.orderStatisticByAddressAuto = function(req, res, next) {

    var matchList = {};

    if (typeof req.query.warehouse !== 'undefined' && req.query.warehouse !== '') {
        matchList.warehouse = ObjectId(req.query.warehouse.toString())
    }


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

            "orderList": { "$push": { "_id": "$_id", "createdAt": "$createdAt", "user": "$user", "orderNumber": "$orderNumber", "totalPrice": "$totalPrice" , "addressContactPerson": "$address.contactPerson", "addressContactMobile": "$address.mobile", "addressStreet": "$address.street", "addressAddress": "$address.address", "addressDistanceFrom": "$address.distanceFrom", "addressLatitude": "$address.geoLatitude", "addressLongitude": "$address.geoLongitude" } }
        }}
    );

    // Sorting pipeline
    pipeline.push (
        { "$sort": { "saleTotalPrice": -1 } }
    );

    // Optionally limit results
    pipeline.push (
        { "$limit": 500 }
    );

    //console.log (pipeline);
    models.order.aggregateAsync( pipeline).then(function(resultOrder){

        var totalAllPrice = 0;

        if (resultOrder.length > 0){
            totalAllPrice = resultOrder.reduce(function(previous, order) {
                //console.log(previous, order.saleTotalPrice);
                return previous + order.saleTotalPrice;
            }, 0);

            resultOrder[0].totalAllPrice = totalAllPrice;

            resultOrder.forEach(function(order){
                order.totalPricePercent = order.saleTotalPrice / totalAllPrice
            });
        }


        res.status(200).json(resultOrder)
    }).catch(next)


};









exports.orderDailySales = function(req, res, next) {

    var matchList = {};

    if (typeof req.query.warehouse !== 'undefined' && req.query.warehouse !== '') {
        matchList.warehouse = ObjectId(req.query.warehouse.toString())
    }


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
        { "$limit": 3000 }
    );






    //console.log (pipeline);
    models.order.aggregateAsync( pipeline).then(function(resultOrder){
        res.status(200).json(resultOrder)
    }).catch(next)
};










exports.orderHourSales = function(req, res, next) {

    var matchList = {};

    if (typeof req.query.warehouse !== 'undefined' && req.query.warehouse !== '') {
        matchList.warehouse = ObjectId(req.query.warehouse.toString())
    }


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
        { "$limit": 3000 }
    );






    //console.log (pipeline);
    models.order.aggregateAsync( pipeline).then(function(resultOrder){
        res.status(200).json(resultOrder)
    }).catch(next)
};
